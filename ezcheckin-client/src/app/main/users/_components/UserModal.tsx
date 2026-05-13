"use client";

import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Checkbox, App } from "antd";
import {
  createUser,
  updateUser,
} from "@/features/users/user.action";
import { UserRecord, UserRole, CreateUserPayload } from "@/@types/user.type";
import { toast } from "sonner";
import { roleOptions } from "../constants";

interface UserModalProps {
  userDetail: UserRecord | null;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export default function UserModal({
  userDetail,
  onClose,
  onSubmitSuccess,
}: UserModalProps) {
  const [form] = Form.useForm<CreateUserPayload>();
  const [submitting, setSubmitting] = useState(false);

  const isEdit = !!userDetail?._id;
  const isOpen = userDetail !== null;

  useEffect(() => {
    if (isOpen) {
      if (userDetail._id) {
        form.setFieldsValue({
          fullName: userDetail.fullName,
          email: userDetail.email,
          role: userDetail.role,
          employeeCode: userDetail.employeeCode,
        });
      } else {
        form.resetFields();
      }
    }
  }, [isOpen, userDetail, form]);

  const handleSubmit = async (values: CreateUserPayload) => {
    setSubmitting(true);
    try {
      if (isEdit) {
        // Cập nhật - không cần password nếu không thay đổi
        await updateUser(userDetail!._id, {
          fullName: values.fullName,
          email: values.email,
          role: values.role,
          employeeCode:values.employeeCode
        });
        toast.success("Cập nhật người dùng thành công");
      } else {
        // Tạo mới - yêu cầu password
        if (!values.password) {
          toast.error("Vui lòng nhập mật khẩu");
          setSubmitting(false);
          return;
        }
        await createUser({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          role: values.role,
          employeeCode:values.employeeCode
        });
        toast.success("Tạo người dùng thành công");
      }

      onSubmitSuccess();
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={isEdit ? "Chỉnh sửa người dùng" : "Thêm người dùng"}
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={onClose}
      confirmLoading={submitting}
      destroyOnHidden
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Form.Item<CreateUserPayload>
          name="fullName"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
        >
          <Input placeholder="VD: Lê Xuân Hiếu" />
        </Form.Item>

        <Form.Item<CreateUserPayload>
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input type="email" placeholder="user@example.com" disabled={isEdit} />
        </Form.Item>
          {!isEdit &&
        <Form.Item<CreateUserPayload>
            name="password"
            label={isEdit ? "Mật khẩu (để trống nếu không thay đổi)" : "Mật khẩu"}
            rules={[
                {
                    required: !isEdit,
              message: "Vui lòng nhập mật khẩu",
            },
            {
              min: 6,
              message: "Mật khẩu phải có ít nhất 6 ký tự",
            },
        ]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>
        }

        <Form.Item<CreateUserPayload>
          name="role"
          label="Vai trò"
          rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
        >
          <Select placeholder="Chọn vai trò" options={roleOptions} />
        </Form.Item>

        <Form.Item<CreateUserPayload>
          name="employeeCode"
          label="Mã nhân viên (tùy chọn)"
        >
          <Input placeholder="VD: NV001" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
