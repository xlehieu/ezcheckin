"use client";

import { useEffect, useState } from "react";
import { Modal, Form, Input, TimePicker, App } from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  createShift,
  updateShift,
} from "@/features/shifts/shift.action";
import { ShiftRecord, CreateShiftPayload } from "@/@types/shift.type";
import { toast } from "sonner";

const timeToHHmm = (time: string) => time.substring(0, 5);

type CreatShiftPayLoadAnt ={
  shiftName:string
  startTime: Dayjs;
  endTime: Dayjs;
};

interface ShiftModalProps {
  shiftDetail: ShiftRecord | null;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export default function ShiftModal({
  shiftDetail,
  onClose,
  onSubmitSuccess,
}: ShiftModalProps) {
  const [form] = Form.useForm<CreatShiftPayLoadAnt>();
  const [submitting, setSubmitting] = useState(false);

  const isEdit = !!shiftDetail?._id;
  const isOpen = shiftDetail !== null;

  useEffect(()=>{
    if(isOpen){
      if(shiftDetail._id){
        console.log(shiftDetail.startTime)
        form.setFieldsValue({
          shiftName:shiftDetail.shiftName,
          startTime:dayjs(shiftDetail.startTime, "HH:mm:ss"),
          endTime:dayjs(shiftDetail.endTime, "HH:mm:ss"),
        })
      }
      else {
        form.resetFields()
      }
    }
  },[isOpen,shiftDetail])

  const handleSubmit = async (values: CreatShiftPayLoadAnt) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        startTime: values.startTime.format("HH:mm:ss"),
        endTime: values.endTime.format("HH:mm:ss"),
      };

      if (isEdit) {
        await updateShift(shiftDetail!._id, payload);
        toast.success("Cập nhật ca làm việc thành công");
      } else {
        await createShift(payload);
        toast.success("Tạo ca làm việc thành công");
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
      title={isEdit ? "Chỉnh sửa ca làm việc" : "Thêm ca làm việc"}
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={() => onClose()}
      confirmLoading={submitting}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Form.Item<CreateShiftPayload>
          name="shiftName"
          label="Tên ca làm việc"
          rules={[
            { required: true, message: "Vui lòng nhập tên ca làm việc" },
          ]}
        >
          <Input placeholder="VD: Ca sáng" />
        </Form.Item>

        <Form.Item<CreateShiftPayload>
          name="startTime"
          label="Giờ bắt đầu"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn giờ bắt đầu",
            },
          ]}
        >
          <TimePicker format="HH:mm:ss" className="w-full" />
        </Form.Item>

        <Form.Item<CreateShiftPayload>
          name="endTime"
          label="Giờ kết thúc"
          rules={[{ required: true, message: "Vui lòng nhập giờ kết thúc" }]}
        >
          <TimePicker format="HH:mm:ss" className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
}