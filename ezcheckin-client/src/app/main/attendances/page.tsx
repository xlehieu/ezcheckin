'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, DatePicker, Select, Space, Statistic, Row, Col, Badge } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

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
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [selectedDate, selectedUserId]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        date: selectedDate.format('YYYY-MM-DD'),
        ...(selectedUserId && { userId: selectedUserId }),
      });
      const response = await fetch(`/api/attendances/business-logs?${params}`);
      const data = await response.json();
      setLogs(data.data || []);
    } catch (error) {
      console.error('Error fetching attendance logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/attendances/business-stats?date=${selectedDate.format('YYYY-MM-DD')}`);
      const data = await response.json();
      setStats(data.data || null);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

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
      {/* Stats Cards */}
      {stats && (
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng nhân viên"
                value={stats.totalEmployees}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Có mặt hôm nay"
                value={stats.presentToday}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Vắng mặt"
                value={stats.absentToday}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đi muộn"
                value={stats.lateToday}
                valueStyle={{ color: '#faad14' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card>
        <Space>
          <DatePicker
            value={selectedDate}
            onChange={(date) => date && setSelectedDate(date)}
            format="YYYY-MM-DD"
          />
          <Select
            style={{ width: 200 }}
            placeholder="Chọn nhân viên"
            allowClear
            onChange={(value) => setSelectedUserId(value)}
          />
          <Button type="primary" onClick={fetchLogs} loading={loading}>
            Tải lại
          </Button>
        </Space>
      </Card>

      {/* Logs Table */}
      <Card title="Danh sách chấm công">
        <Table
          columns={columns}
          dataSource={logs}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default AttendancesPage;
