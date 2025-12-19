// src/services/sync.service.ts
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  where,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { AttendanceRecord, Student } from '../types';

export class SyncService {
  private unsubscribers: Unsubscribe[] = [];

  // Real-time sync for attendance records
  syncAttendance(
    onUpdate: (records: AttendanceRecord[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    const q = query(collection(db, 'attendance'), orderBy('timestamp', 'desc'), limit(100));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const records: AttendanceRecord[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          records.push({
            id: doc.id,
            studentId: data.studentId,
            studentName: data.studentName,
            studentCode: data.studentCode,
            class: data.class,
            date: data.date?.toDate() || new Date(),
            status: data.status,
            timestamp: data.timestamp?.toDate() || new Date(),
            scannedBy: data.scannedBy,
            confidence: data.confidence,
            sessionId: data.sessionId,
            note: data.note,
          });
        });

        onUpdate(records);

        console.log('📡 [Sync] Attendance updated:', records.length, 'records');
      },
      (error) => {
        console.error('❌ [Sync] Attendance error:', error);
        if (onError) onError(error);
      }
    );

    this.unsubscribers.push(unsubscribe);
    return unsubscribe;
  }

  // Real-time sync for today's attendance
  syncTodayAttendance(
    onUpdate: (records: AttendanceRecord[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, 'attendance'),
      where('date', '>=', Timestamp.fromDate(today)),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const records: AttendanceRecord[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          records.push({
            id: doc.id,
            studentId: data.studentId,
            studentName: data.studentName,
            studentCode: data.studentCode,
            class: data.class,
            date: data.date?.toDate() || new Date(),
            status: data.status,
            timestamp: data.timestamp?.toDate() || new Date(),
            scannedBy: data.scannedBy,
            confidence: data.confidence,
            sessionId: data.sessionId,
            note: data.note,
          });
        });

        onUpdate(records);

        console.log('📡 [Sync] Today attendance updated:', records.length, 'records');
      },
      (error) => {
        console.error('❌ [Sync] Today attendance error:', error);
        if (onError) onError(error);
      }
    );

    this.unsubscribers.push(unsubscribe);
    return unsubscribe;
  }

  // Real-time sync for students
  syncStudents(
    onUpdate: (students: Student[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    const q = query(collection(db, 'students'), orderBy('name'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const students: Student[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          students.push({
            id: doc.id,
            studentCode: data.studentCode,
            name: data.name,
            class: data.class,
            major: data.major,
            email: data.email,
            phone: data.phone,
            photoURL: data.photoURL,
            faceEmbedding: data.faceEmbedding,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            isSynced: data.isSynced ?? true,
          });
        });

        onUpdate(students);

        console.log('📡 [Sync] Students updated:', students.length, 'students');
      },
      (error) => {
        console.error('❌ [Sync] Students error:', error);
        if (onError) onError(error);
      }
    );

    this.unsubscribers.push(unsubscribe);
    return unsubscribe;
  }

  // Real-time sync for specific class attendance
  syncClassAttendance(
    className: string,
    date: Date,
    onUpdate: (records: AttendanceRecord[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, 'attendance'),
      where('class', '==', className),
      where('date', '>=', Timestamp.fromDate(startOfDay)),
      where('date', '<=', Timestamp.fromDate(endOfDay)),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const records: AttendanceRecord[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          records.push({
            id: doc.id,
            studentId: data.studentId,
            studentName: data.studentName,
            studentCode: data.studentCode,
            class: data.class,
            date: data.date?.toDate() || new Date(),
            status: data.status,
            timestamp: data.timestamp?.toDate() || new Date(),
            scannedBy: data.scannedBy,
            confidence: data.confidence,
            sessionId: data.sessionId,
            note: data.note,
          });
        });

        onUpdate(records);

        console.log(`📡 [Sync] Class ${className} attendance updated:`, records.length, 'records');
      },
      (error) => {
        console.error(`❌ [Sync] Class ${className} attendance error:`, error);
        if (onError) onError(error);
      }
    );

    this.unsubscribers.push(unsubscribe);
    return unsubscribe;
  }

  // Unsubscribe all listeners
  unsubscribeAll() {
    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
    this.unsubscribers = [];
    console.log('🔌 [Sync] All listeners unsubscribed');
  }
}

// Export singleton instance
export const syncService = new SyncService();
