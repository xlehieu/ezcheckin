"use client"
import { useApp } from "@/hooks/useApp";
import { useOnChangeDebounce } from "@/hooks/useOnChangeDebounce";
import { useShiftStore } from "@/store/shift.store";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";
import React, { memo } from "react";
import { useShallow } from "zustand/react/shallow";

type Props = {
  handleReload: () => void;
  handleOpenModal: () => void;
};

const ShiftFilter: React.FC<Props> = ({
  handleOpenModal,
  handleReload,
}: Props) => {
  const { shiftListFilter, setShiftListFilter } = useShiftStore(
    useShallow((state) => ({
      shiftListFilter: state.shiftListFilter,
      setShiftListFilter: state.setShiftListFilter,
    })),
  );

  const { debounced, value } = useOnChangeDebounce((value) => {
    setShiftListFilter({
      search: value || undefined,
      current: 1,
    });
  }, shiftListFilter.search);

  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <Input.Search
        placeholder="Tìm kiếm theo tên ca..."
        allowClear
        className="w-55"
        value={value}
        onChange={(e) => debounced(e.target.value)}
      />
      <Space>
        <Button
          icon={<ReloadOutlined />}
          onClick={handleReload}
          // loading={loading}
        >
          Tải lại
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenModal}
        >
          Thêm ca làm việc
        </Button>
      </Space>
    </div>
  );
};

ShiftFilter.displayName = "ShiftFilter";
export default memo(ShiftFilter);
