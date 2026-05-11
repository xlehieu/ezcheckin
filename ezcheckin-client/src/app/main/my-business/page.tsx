'use client';

import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Spin, Space, Divider, Tag, Alert, Collapse } from 'antd';
import { SaveOutlined, EditOutlined } from '@ant-design/icons';

interface BusinessInfo {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  companySize?: number;
  industry?: string;
  website?: string;
  taxId?: string;
  createdAt: string;
  updatedAt: string;
}

const MyBusinessPage = () => {
  const [business, setBusiness] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBusinessInfo();
  }, []);

  const fetchBusinessInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/business');
      const data = await response.json();
      if (data.data) {
        setBusiness(data.data);
        form.setFieldsValue(data.data);
      }
    } catch (error) {
      console.error('Error fetching business info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values: any) => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/business/${business?._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (data.data) {
        setBusiness(data.data);
        setEditing(false);
        // Show success message
      }
    } catch (error) {
      console.error('Error updating business:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <div className="space-y-6">
      {/* Business Info Card */}
      <Card
        title="Thông tin doanh nghiệp"
        extra={
          <Button
            type={editing ? 'default' : 'primary'}
            icon={editing ? null : <EditOutlined />}
            onClick={() => setEditing(!editing)}
          >
            {editing ? 'Hủy' : 'Chỉnh sửa'}
          </Button>
        }
      >
        {!editing ? (
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm">Tên doanh nghiệp</p>
              <p className="font-semibold">{business?.name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="font-semibold">{business?.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Số điện thoại</p>
              <p className="font-semibold">{business?.phone}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Địa chỉ</p>
              <p className="font-semibold">{business?.address}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Thành phố</p>
                <p className="font-semibold">{business?.city}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Quốc gia</p>
                <p className="font-semibold">{business?.country}</p>
              </div>
            </div>
          </div>
        ) : (
          <Form form={form} layout="vertical" onFinish={handleUpdate}>
            <Form.Item name="name" label="Tên doanh nghiệp" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="Số điện thoại">
              <Input />
            </Form.Item>
            <Form.Item name="address" label="Địa chỉ">
              <Input />
            </Form.Item>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="city" label="Thành phố">
                <Input />
              </Form.Item>
              <Form.Item name="country" label="Quốc gia">
                <Input />
              </Form.Item>
            </div>
            <Form.Item name="website" label="Website">
              <Input />
            </Form.Item>
            <Form.Item name="taxId" label="Mã số thuế">
              <Input />
            </Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <SaveOutlined /> Lưu
              </Button>
              <Button onClick={() => setEditing(false)}>Hủy</Button>
            </Space>
          </Form>
        )}
      </Card>

      {/* Additional Info */}
      <Card title="Thông tin chi tiết">
        <Collapse
          items={[
            {
              key: '1',
              label: 'Quy mô công ty',
              children: (
                <div className="space-y-2">
                  <p>Quy mô: <Tag>{business?.companySize || 'Không xác định'}</Tag></p>
                  <p>Ngành: <Tag color="blue">{business?.industry || 'Không xác định'}</Tag></p>
                </div>
              ),
            },
            {
              key: '2',
              label: 'Các hoạt động gần đây',
              children: (
                <div className="space-y-2">
                  <p>Tạo ngày: {new Date(business?.createdAt || '').toLocaleDateString('vi-VN')}</p>
                  <p>Cập nhật lần cuối: {new Date(business?.updatedAt || '').toLocaleDateString('vi-VN')}</p>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default MyBusinessPage;
