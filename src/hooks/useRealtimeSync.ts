// src/hooks/useRealtimeSync.ts
import { useEffect, useState } from 'react';
import { syncService } from '../services/sync.service';
import { AttendanceRecord, Student } from '../types';

export function useRealtimeAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = syncService.syncAttendance(
      (newRecords) => {
        setRecords(newRecords);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return { records, loading, error };
}

export function useRealtimeTodayAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = syncService.syncTodayAttendance(
      (newRecords) => {
        setRecords(newRecords);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return { records, loading, error };
}

export function useRealtimeStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = syncService.syncStudents(
      (newStudents) => {
        setStudents(newStudents);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return { students, loading, error };
}

export function useRealtimeClassAttendance(className: string, date: Date) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!className) return;

    setLoading(true);

    const unsubscribe = syncService.syncClassAttendance(
      className,
      date,
      (newRecords) => {
        setRecords(newRecords);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [className, date]);

  return { records, loading, error };
}
