// src/types/index.ts - UPDATED WITH NEW TYPES
import { Timestamp } from 'firebase/firestore';

export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  PARENT = 'parent',
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  schoolId?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Student {
  id: string;
  studentCode: string;
  name: string;
  class: string;
  major: string;
  email?: string;
  phone?: string;
  photoURL?: string;
  faceEmbedding?: number[];
  createdAt: Date;
  updatedAt: Date;
  isSynced: boolean;
}

export interface CreateStudentData {
  studentCode: string;
  name: string;
  class: string;
  major: string;
  email?: string;
  phone?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  class: string;
  date: Date;
  status: AttendanceStatus;
  timestamp: Date;
  scannedBy?: string;
  confidence?: number;
  sessionId?: string;
  note?: string;
}

export interface AttendanceStats {
  totalStudents: number;
  todayPresent: number;
  todayAbsent: number;
  todayLate: number;
  todayRate: number;
  weekPresent: number;
  weekRate: number;
  monthPresent: number;
  monthRate: number;
}

export interface AttendanceSession {
  id: string;
  class: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  createdBy: string;
  totalStudents: number;
  presentCount: number;
  status: 'active' | 'completed';
}
