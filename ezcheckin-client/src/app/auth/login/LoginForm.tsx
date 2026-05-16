'use client';

import { useState } from 'react';
import { Form, Input, Button, Spin } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { login } from '@/features/auth/auth.action';
import { useApp } from '@/hooks/useApp';
import { ROUTE_MAIN } from '@/routes/main/main.route';

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { notify } = useApp();
  const router = useRouter();

  const onFinish = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      const data = await login(values);
      
      if (data?.data) {
        notify?.success?.('Đăng nhập thành công');
        router.replace(ROUTE_MAIN.MAIN);
        //để loading ở đây để đợi nó load cho đến khi chuyển trang
        setLoading(false);
      } else {
        notify?.error?.(data?.message || 'Đăng nhập thất bại');
      }
    } catch (error: any) {
      notify?.error?.(error?.message || 'Có lỗi xảy ra');
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Email"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Nhập mật khẩu' },
            { min: 6, message: 'Tối thiểu 6 ký tự' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Mật khẩu"
            size="large"
            iconRender={(visible) =>
              visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            Đăng Nhập
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
}