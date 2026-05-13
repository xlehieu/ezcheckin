"use client";

import { useEffect, useState } from "react";
import { Button, Table, Tag, Input, Space, Popconfirm, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import {
  getShifts,
  createShift,
  updateShift,
  deleteShift,
} from "@/features/shifts/shift.action";
import { ShiftRecord, CreateShiftPayload } from "@/@types/shift.type";
import { usePaginationData } from "@/hooks/useDataPagination";
import { useShiftStore } from "@/store/shift.store";
import { useShallow } from "zustand/react/shallow";
import { OptionsFetch } from "@/@types/common";
import ShiftModal from "./ShiftModal";
import TableAction from "@/components/ui/TableAction";
import ShiftFilter from "./ShiftFilter";
import { useApp } from "@/hooks/useApp";

const timeToHHmm = (time: string) => time.substring(0, 5);

export default function ShiftList() {
  const {notify}=useApp()
  const { shiftListFilter, setShiftListFilter } = useShiftStore(
    useShallow((state) => ({
      shiftListFilter: state.shiftListFilter,
      setShiftListFilter: state.setShiftListFilter,
    })),
  );

  const { data, setData, setLoading, loading, setTotal, total } =
    usePaginationData<ShiftRecord>();

  const [shiftDetail, setShiftDetail] = useState<ShiftRecord | null>(null);

  const fetchShifts = async (options?: OptionsFetch) => {
    try {
      setLoading(true);
      const res = await getShifts(shiftListFilter, options);
      setData(res.data);
      setTotal(res.meta.total);
    } catch (error) {
      notify.error("Lỗi khi tải danh sách ca làm việc");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, [shiftListFilter]);

  const handleOpenModal = (shift?: ShiftRecord) => {
    if (shift) {
      setShiftDetail(shift);
    } else {
      setShiftDetail({} as ShiftRecord); // ← Empty object để mở modal create
    }
  };

  const handleCloseModal = () => {
    setShiftDetail(null);
  };

  const handleSubmitSuccess = async () => {
    handleCloseModal();
    await fetchShifts({ hasRevalidate: true });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteShift(id);
      notify.success("Xóa ca làm việc thành công");
      fetchShifts({hasRevalidate:true});
    } catch (error: any) {
      notify.error(error?.message || "Có lỗi xảy ra");
    }
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
      render: (value: string) => new Date(value).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 150,
      render: (_, record: ShiftRecord) => (
        <TableAction
          record={record}
          onClickEdit={(value) => {
            setShiftDetail(value)
          }}
          onConfirmDelete={(value) => handleDelete(value._id)}
        />
      ),
    },
  ];

  return (
    <>
      <ShiftFilter handleReload={()=>fetchShifts({hasRevalidate:true})} handleOpenModal={handleOpenModal}/>

      <Table<ShiftRecord>
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{
          current: shiftListFilter.current || 1,
          pageSize: shiftListFilter.pageSize || 10,
          total,
          onChange: (page, pageSize) => {
            setShiftListFilter({
              ...shiftListFilter,
              current: page,
              pageSize: pageSize,
            });
          },
        }}
      />

      {/* ✅ Modal tách riêng */}
      <ShiftModal
        shiftDetail={shiftDetail}
        onClose={handleCloseModal}
        onSubmitSuccess={handleSubmitSuccess}
      />
    </>
  );
}
