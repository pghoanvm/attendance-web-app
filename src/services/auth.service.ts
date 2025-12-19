// src/services/auth.service.ts
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User, UserRole } from '../types';

export const authService = {
  // Sign in with email/password
  async signIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userData = await this.getUserData(userCredential.user.uid);

    if (!userData) {
      throw new Error('User data not found');
    }

    // Update last login
    await this.updateLastLogin(userCredential.user.uid);

    return userData;
  },

  // Sign in with Google
  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    // Check if user exists
    let userData = await this.getUserData(userCredential.user.uid);

    // If not exists, create with default role (teacher)
    if (!userData) {
      userData = await this.createUserDocument(userCredential.user, UserRole.TEACHER);
    }

    await this.updateLastLogin(userCredential.user.uid);

    return userData;
  },

  // Sign out
  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  },

  // Create user with email/password (Admin only)
  async createUser(
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
    schoolId?: string
  ): Promise<User> {
    // Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update profile
    await updateProfile(userCredential.user, { displayName });

    // Create Firestore document
    const userData = await this.createUserDocument(userCredential.user, role, schoolId);

    return userData;
  },

  // Create user document in Firestore
  async createUserDocument(
    firebaseUser: FirebaseUser,
    role: UserRole = UserRole.TEACHER,
    schoolId?: string
  ): Promise<User> {
    const userData: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName || firebaseUser.email!,
      photoURL: firebaseUser.photoURL || undefined,
      role,
      schoolId,
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...userData,
      createdAt: Timestamp.now(),
      lastLogin: Timestamp.now(),
    });

    return userData;
  },

  // Get user data from Firestore
  async getUserData(uid: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, 'users', uid));

    if (!userDoc.exists()) {
      return null;
    }

    const data = userDoc.data();
    return {
      uid: userDoc.id,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      role: data.role || UserRole.TEACHER,
      schoolId: data.schoolId,
      createdAt: data.createdAt?.toDate() || new Date(),
      lastLogin: data.lastLogin?.toDate(),
    };
  },

  // Update last login
  async updateLastLogin(uid: string): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      lastLogin: Timestamp.now(),
    });
  },

  // Update user profile
  async updateUserProfile(uid: string, data: Partial<User>): Promise<void> {
    const updateData: any = { ...data };

    if (updateData.createdAt) {
      delete updateData.createdAt;
    }

    await updateDoc(doc(db, 'users', uid), updateData);
  },

  // Change user role (Admin only)
  async changeUserRole(uid: string, role: UserRole): Promise<void> {
    await updateDoc(doc(db, 'users', uid), { role });
  },

  // Send password reset email
  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  // Get all users (Admin only)
  async getAllUsers(): Promise<User[]> {
    const usersSnapshot = await getDocs(collection(db, 'users'));

    return usersSnapshot.docs.map((doc) => ({
      uid: doc.id,
      email: doc.data().email,
      displayName: doc.data().displayName,
      photoURL: doc.data().photoURL,
      role: doc.data().role || UserRole.TEACHER,
      schoolId: doc.data().schoolId,
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      lastLogin: doc.data().lastLogin?.toDate(),
    }));
  },

  // Get users by role
  async getUsersByRole(role: UserRole): Promise<User[]> {
    const q = query(collection(db, 'users'), where('role', '==', role));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      uid: doc.id,
      email: doc.data().email,
      displayName: doc.data().displayName,
      photoURL: doc.data().photoURL,
      role: doc.data().role,
      schoolId: doc.data().schoolId,
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      lastLogin: doc.data().lastLogin?.toDate(),
    }));
  },

  // Create accounts from existing students (for parents)
  async createAccountsFromStudents(): Promise<void> {
    const studentsSnapshot = await getDocs(collection(db, 'students'));

    for (const studentDoc of studentsSnapshot.docs) {
      const student = studentDoc.data();

      // Check if student has email
      if (student.email) {
        try {
          // Check if user already exists
          const existingUsers = await getDocs(
            query(collection(db, 'users'), where('email', '==', student.email))
          );

          if (existingUsers.empty) {
            // Create user with default password
            const defaultPassword = `${student.studentCode}@123`;

            await this.createUser(
              student.email,
              defaultPassword,
              student.name,
              UserRole.PARENT,
              student.class
            );

            console.log(`Created account for: ${student.email}`);
          }
        } catch (error) {
          console.error(`Error creating account for ${student.email}:`, error);
        }
      }
    }
  },
};
