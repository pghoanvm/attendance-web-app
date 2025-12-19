// src/services/mockData.service.ts
import { AttendanceRecord, Student, AttendanceStats } from '../types';

/**
 * 🎭 MOCK DATA SERVICE
 * Tạo dữ liệu ảo để demo Dashboard mà không cần Firebase
 */

export class MockDataService {
  // Mock students data
  private static students: Student[] = [
    {
      id: '1',
      studentCode: 'HS001',
      name: 'Nguyễn Văn An',
      class: '12A1',
      major: 'Toán',
      email: 'van.an@student.edu.vn',
      phone: '0912345001',
      photoURL: 'https://i.pravatar.cc/150?img=1',
      createdAt: new Date('2025-09-01'),
      updatedAt: new Date('2025-12-20'),
      isSynced: true,
    },
    {
      id: '2',
      studentCode: 'HS002',
      name: 'Trần Thị Bích',
      class: '12A1',
      major: 'Toán',
      email: 'thi.bich@student.edu.vn',
      phone: '0912345002',
      photoURL: 'https://i.pravatar.cc/150?img=5',
      createdAt: new Date('2025-09-01'),
      updatedAt: new Date('2025-12-20'),
      isSynced: true,
    },
    {
      id: '3',
      studentCode: 'HS003',
      name: 'Lê Minh Cường',
      class: '12A1',
      major: 'Toán',
      email: 'minh.cuong@student.edu.vn',
      phone: '0912345003',
      photoURL: 'https://i.pravatar.cc/150?img=12',
      createdAt: new Date('2025-09-01'),
      updatedAt: new Date('2025-12-20'),
      isSynced: true,
    },
    {
      id: '4',
      studentCode: 'HS004',
      name: 'Phạm Thu Duyên',
      class: '12A2',
      major: 'Ngữ Văn',
      email: 'thu.duyen@student.edu.vn',
      phone: '0912345004',
      photoURL: 'https://i.pravatar.cc/150?img=9',
      createdAt: new Date('2025-09-01'),
      updatedAt: new Date('2025-12-20'),
      isSynced: true,
    },
    {
      id: '5',
      studentCode: 'SV005',
      name: 'Hoàng Văn Em',
      class: '12A2',
      major: 'Ngữ Văn',
      email: 'van.em@student.edu.vn',
      phone: '0912345005',
      photoURL: 'https://i.pravatar.cc/150?img=15',
      createdAt: new Date('2025-09-01'),
      updatedAt: new Date('2025-12-20'),
      isSynced: true,
    },
    {
      id: '6',
      studentCode: 'SV006',
      name: 'Đỗ Thị Phương',
      class: '12A1',
      major: 'Toán',
      email: 'thi.phuong@student.edu.vn',
      phone: '0912345006',
      photoURL: 'https://i.pravatar.cc/150?img=10',
      createdAt: new Date('2025-09-01'),
      updatedAt: new Date('2025-12-20'),
      isSynced: true,
    },
    {
      id: '7',
      studentCode: 'SV007',
      name: 'Vũ Minh Giang',
      class: '12A2',
      major: 'Ngữ Văn',
      email: 'minh.giang@student.edu.vn',
      phone: '0912345007',
      photoURL: 'https://i.pravatar.cc/150?img=8',
      createdAt: new Date('2025-09-01'),
      updatedAt: new Date('2025-12-20'),
      isSynced: true,
    },
    {
      id: '8',
      studentCode: 'SV008',
      name: 'Bùi Văn Hùng',
      class: '12A1',
      major: 'Toán',
      email: 'van.hung@student.edu.vn',
      phone: '0912345008',
      photoURL: 'https://i.pravatar.cc/150?img=13',
      createdAt: new Date('2025-09-01'),
      updatedAt: new Date('2025-12-20'),
      isSynced: true,
    },
  ];

  // Generate mock attendance records
  static generateMockAttendance(): AttendanceRecord[] {
    const records: AttendanceRecord[] = [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Today's attendance - 5 students present
    const todayStudents = this.students.slice(0, 5);
    todayStudents.forEach((student, index) => {
      const baseTime = today.getTime() + 8 * 60 * 60 * 1000; // 8:00 AM
      const timestamp = new Date(baseTime + index * 3 * 60 * 1000); // 3 minutes apart

      records.push({
        id: `att_today_${index}`,
        studentId: student.id,
        studentName: student.name,
        studentCode: student.studentCode,
        class: student.class,
        date: today,
        status: Math.random() > 0.1 ? 'present' : Math.random() > 0.5 ? 'late' : 'absent',
        timestamp: timestamp,
        scannedBy: 'demo_user',
        confidence: 0.85 + Math.random() * 0.14, // 0.85 - 0.99
        note: 'Attendance',
      });
    });

    // Yesterday's attendance
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    this.students.forEach((student, index) => {
      const baseTime = yesterday.getTime() + 8 * 60 * 60 * 1000;
      const timestamp = new Date(baseTime + index * 2 * 60 * 1000);

      records.push({
        id: `att_yesterday_${index}`,
        studentId: student.id,
        studentName: student.name,
        studentCode: student.studentCode,
        class: student.class,
        date: yesterday,
        status: Math.random() > 0.15 ? 'present' : 'absent',
        timestamp: timestamp,
        scannedBy: 'demo_user',
        confidence: 0.8 + Math.random() * 0.19,
        note: 'Demo attendance',
      });
    });

    // Last 7 days
    for (let i = 2; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Random 60-80% attendance
      const attendingCount = Math.floor(this.students.length * (0.6 + Math.random() * 0.2));
      const shuffled = [...this.students].sort(() => Math.random() - 0.5);
      const attending = shuffled.slice(0, attendingCount);

      attending.forEach((student, index) => {
        const baseTime = date.getTime() + 8 * 60 * 60 * 1000;
        const timestamp = new Date(baseTime + index * 2 * 60 * 1000);

        records.push({
          id: `att_day${i}_${index}`,
          studentId: student.id,
          studentName: student.name,
          studentCode: student.studentCode,
          class: student.class,
          date: date,
          status: Math.random() > 0.1 ? 'present' : 'late',
          timestamp: timestamp,
          scannedBy: 'demo_user',
          confidence: 0.8 + Math.random() * 0.19,
          note: 'Attendance',
        });
      });
    }

    return records.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Calculate stats from mock data
  static calculateStats(records: AttendanceRecord[]): AttendanceStats {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);

    const totalStudents = this.students.length;

    // Today's stats
    const todayRecords = records.filter((r) => r.date.getTime() >= today.getTime());
    const todayPresent = todayRecords.filter((r) => r.status === 'present').length;
    const todayAbsent = totalStudents - todayPresent;
    const todayLate = todayRecords.filter((r) => r.status === 'late').length;
    const todayRate = totalStudents > 0 ? (todayPresent / totalStudents) * 100 : 0;

    // Week's stats
    const weekRecords = records.filter((r) => r.date.getTime() >= weekAgo.getTime());
    const weekPresent = weekRecords.filter((r) => r.status === 'present').length;
    const weekTotal = totalStudents * 7;
    const weekRate = weekTotal > 0 ? (weekPresent / weekTotal) * 100 : 0;

    // Month's stats
    const monthRecords = records.filter((r) => r.date.getTime() >= monthAgo.getTime());
    const monthPresent = monthRecords.filter((r) => r.status === 'present').length;
    const monthTotal = totalStudents * 30;
    const monthRate = monthTotal > 0 ? (monthPresent / monthTotal) * 100 : 0;

    return {
      totalStudents,
      todayPresent,
      todayAbsent,
      todayLate,
      todayRate,
      weekPresent,
      weekRate,
      monthPresent,
      monthRate,
    };
  }

  // Get recent activities for dashboard
  static getRecentActivities(records: AttendanceRecord[], limit: number = 5) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const todayRecords = records.filter((r) => r.date.getTime() >= today.getTime());

    // Group by class
    const classSummary = new Map<
      string,
      {
        class: string;
        present: number;
        total: number;
        latestTime: Date;
      }
    >();

    todayRecords.forEach((record) => {
      if (!classSummary.has(record.class)) {
        classSummary.set(record.class, {
          class: record.class,
          present: 0,
          total: 0,
          latestTime: record.timestamp,
        });
      }
      const summary = classSummary.get(record.class)!;
      summary.total++;
      if (record.status === 'present') summary.present++;
      if (record.timestamp > summary.latestTime) {
        summary.latestTime = record.timestamp;
      }
    });

    return Array.from(classSummary.values())
      .sort((a, b) => b.latestTime.getTime() - a.latestTime.getTime())
      .slice(0, limit)
      .map((item) => ({
        class: item.class,
        time: item.latestTime.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        present: item.present,
        total: item.total,
        date: 'Hôm nay',
        teacher: 'Demo Teacher',
        isNew: now.getTime() - item.latestTime.getTime() < 60000, // Last 1 minute
      }));
  }

  // Get all students
  static getStudents(): Student[] {
    return [...this.students];
  }

  // Get chart data for reports
  static getChartData(records: AttendanceRecord[]) {
    const now = new Date();
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayRecords = records.filter(
        (r) => r.date.getTime() >= date.getTime() && r.date.getTime() < nextDate.getTime()
      );

      const present = dayRecords.filter((r) => r.status === 'present').length;
      const absent = this.students.length - present;

      last7Days.push({
        date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        present,
        absent,
        rate: this.students.length > 0 ? (present / this.students.length) * 100 : 0,
      });
    }

    return last7Days;
  }

  // Simulate real-time update
  static addRealtimeRecord(): AttendanceRecord {
    const randomStudent = this.students[Math.floor(Math.random() * this.students.length)];
    const now = new Date();

    return {
      id: `att_realtime_${Date.now()}`,
      studentId: randomStudent.id,
      studentName: randomStudent.name,
      studentCode: randomStudent.studentCode,
      class: randomStudent.class,
      date: now,
      status: 'present',
      timestamp: now,
      scannedBy: 'mobile_app',
      confidence: 0.85 + Math.random() * 0.14,
      note: 'Real-time scan',
    };
  }
}

export default MockDataService;
