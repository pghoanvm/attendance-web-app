// src/services/student.service.ts
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Student, CreateStudentData } from '../types';

export const studentService = {
  async getAll(): Promise<Student[]> {
    const q = query(collection(db, 'students'), orderBy('name'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Student[];
  },

  async getByClass(className: string): Promise<Student[]> {
    const q = query(
      collection(db, 'students'),
      where('class', '==', className),
      orderBy('name')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Student[];
  },

  async getById(id: string): Promise<Student | null> {
    const docRef = doc(db, 'students', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate(),
    } as Student;
  },

  async create(data: CreateStudentData): Promise<string> {
    const docRef = await addDoc(collection(db, 'students'), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isSynced: true,
    });
    
    return docRef.id;
  },

  async update(id: string, data: Partial<Student>): Promise<void> {
    const docRef = doc(db, 'students', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'students', id);
    await deleteDoc(docRef);
  },

  async uploadPhoto(studentId: string, file: File): Promise<string> {
    const storageRef = ref(storage, `students/${studentId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    
    await this.update(studentId, { photoURL: url });
    
    return url;
  },
};