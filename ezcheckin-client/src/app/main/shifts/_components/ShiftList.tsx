"use client";

import { useState } from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import { ShiftRecord } from "@/@types/shift.type";
import ShiftModal from "./ShiftModal";
import TableAction from "@/components/ui/TableAction";
import ShiftFilter from "./ShiftFilter";
import { useApp } from "@/hooks/useApp";
import { useShifts } from "@/features/shifts/useShift";

const timeToHHmm = (time: string) => time.substring(0, 5);

export default function ShiftList() {
  const { notify } = useApp();

  const {
    data,
    loading,
    total,
    shiftListFilter,
    reload,
    changePagination,
  } = useShifts(notify);

  const [shiftDetail, setShiftDetail] = useState<ShiftRecord | null>(null);

  const handleOpenModal = (shift?: ShiftRecord) => {
    setShiftDetail(shift ?? ({} as ShiftRecord));
  };

  const handleCloseModal = () => {
    setShiftDetail(null);
  };

  const columns: ColumnsType<ShiftRecord> = [
    {
      title: "Tên ca",
      dataIndex: "shiftName",
      key: "shiftName",
    },
    {
      title: "Giờ vào",
      dataIndex: "startTime",
      key: "startTime",
      render: (value: string) => timeToHHmm(value),
    },
    {
      title: "Giờ ra",
      dataIndex: "endTime",
      key: "endTime",
      render: (value: string) => timeToHHmm(value),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (value: boolean) => (
        <Tag color={value ? "green" : "red"}>
          {value ? "Hoạt động" : "Ngừng"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) =>
        new Date(value).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 150,
      render: (_, record: ShiftRecord) => (
        <TableAction
          record={record}
          onClickEdit={(value) => setShiftDetail(value)}
          onConfirmDelete={() => {
            // nếu bạn muốn delete thì add lại vào hook hoặc gọi API riêng
          }}
        />
      ),
    },
  ];

  return (
    <>
      <ShiftFilter
        handleReload={reload}
        handleOpenModal={handleOpenModal}
      />

      <Table<ShiftRecord>
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{
          current: shiftListFilter.current || 1,
          pageSize: shiftListFilter.pageSize || 10,
          total,
          onChange: changePagination,
        }}
      />

      <ShiftModal
        shiftDetail={shiftDetail}
        onClose={handleCloseModal}
        onSubmitSuccess={reload}
      />
    </>
  );
}