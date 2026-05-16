'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, DatePicker, Select, Space, Statistic, Row, Col, Badge } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAttendanceBusinessLogs } from '@/features/attendances/useAttendanceBusinessLogs';

interface AttendanceLog {
  _id: string;
  userId: string;
  userName: string;
  shiftId: string;
  shiftName: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'present' | 'absent' | 'late' | 'early_leave';
  createdAt: string;
}

interface AttendanceStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
}

const AttendancesPage = () => {
  const {}=useAttendanceBusinessLogs()

  const columns = [
    {
      title: 'Nhân viên',
      dataIndex: 'userName',
      key: 'userName',
      width: 150,
    },
    {
      title: 'Ca làm việc',
      dataIndex: 'shiftName',
      key: 'shiftName',
      width: 150,
    },
    {
      title: 'Giờ vào',
      dataIndex: 'checkInTime',
      key: 'checkInTime',
      render: (time: string) => time ? dayjs(time).format('HH:mm:ss') : '-',
      width: 120,
    },
    {
      title: 'Giờ ra',
      dataIndex: 'checkOutTime',
      key: 'checkOutTime',
      render: (time: string) => time ? dayjs(time).format('HH:mm:ss') : '-',
      width: 120,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { color: string; label: string }> = {
          present: { color: 'success', label: 'Có mặt' },
          absent: { color: 'red', label: 'Vắng mặt' },
          late: { color: 'warning', label: 'Đi muộn' },
          early_leave: { color: 'orange', label: 'Về sớm' },
        };
        return <Badge color={statusMap[status]?.color} text={statusMap[status]?.label} />;
      },
      width: 100,
    },
  ];

  return (
    <div className="space-y-6">
      
    </div>
  );
};

export default AttendancesPage;
