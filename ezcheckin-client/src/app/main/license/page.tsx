'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Select, Space, Statistic, Row, Col, Tag, Alert, Spin, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface License {
  _id: string;
  name: string;
  type: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'expiring_soon';
  features: string[];
  maxUsers?: number;
  createdAt: string;
}

const LicensePage = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/license');
      const data = await response.json();
      setLicenses(data.data || []);
    } catch (error) {
      console.error('Error fetching licenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLicense = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditLicense = (license: License) => {
    setEditingId(license._id);
    form.setFieldsValue(license);
    setIsModalVisible(true);
  };

  const handleDeleteLicense = async (id: string) => {
    Modal.confirm({
      title: 'Xóa giấy phép',
      content: 'Bạn có chắc chắn muốn xóa giấy phép này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await fetch(`/api/license/${id}`, { method: 'DELETE' });
          fetchLicenses();
        } catch (error) {
          console.error('Error deleting license:', error);
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId ? `/api/license/${editingId}` : '/api/license';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      setIsModalVisible(false);
      form.resetFields();
      fetchLicenses();
    } catch (error) {
      console.error('Error saving license:', error);
    }
  };

  const activeLicenses = licenses.filter(l => l.status === 'active').length;
  const expiredLicenses = licenses.filter(l => l.status === 'expired').length;
  const expiringLicenses = licenses.filter(l => l.status === 'expiring_soon').length;

  const columns = [
    {
      title: 'Tên giấy phép',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'Hạn sử dụng',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { color: string; label: string }> = {
          active: { color: 'success', label: 'Hoạt động' },
          expired: { color: 'red', label: 'Hết hạn' },
          expiring_soon: { color: 'warning', label: 'Sắp hết hạn' },
        };
        return <Tag color={statusMap[status]?.color}>{statusMap[status]?.label}</Tag>;
      },
    },
    {
      title: 'Số người dùng tối đa',
      dataIndex: 'maxUsers',
      key: 'maxUsers',
      render: (num: number) => num || 'Không giới hạn',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_: any, record: License) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditLicense(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteLicense(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {expiringLicenses > 0 && (
        <Alert
          message="Cảnh báo"
          description={`Bạn có ${expiringLicenses} giấy phép sắp hết hạn`}
          type="warning"
          showIcon
        />
      )}

      {/* Stats Cards */}
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng giấy phép"
              value={licenses.length}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Hoạt động"
              value={activeLicenses}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Sắp hết hạn"
              value={expiringLicenses}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Hết hạn"
              value={expiredLicenses}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Licenses Table */}
      <Card
        title="Danh sách giấy phép"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddLicense}>
            Thêm giấy phép
          </Button>
        }
      >
        <Spin spinning={loading}>
          <Table columns={columns} dataSource={licenses} rowKey="_id" />
        </Spin>
      </Card>

      {/* Modal for Add/Edit */}
      <Modal
        title={editingId ? 'Cập nhật giấy phép' : 'Thêm giấy phép'}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Tên giấy phép" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Loại" rules={[{ required: true }]}>
            <Select
              options={[
                { label: 'Pro', value: 'PRO' },
                { label: 'Enterprise', value: 'ENTERPRISE' },
                { label: 'Standard', value: 'STANDARD' },
              ]}
            />
          </Form.Item>
          <Form.Item name="expiryDate" label="Hạn sử dụng" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item name="maxUsers" label="Số người dùng tối đa">
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LicensePage;
