"use client"
import { useUserStore } from "@/store/user.store";
import { Button, Input, Space } from "antd";
import React, { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useOnChangeDebounce } from "@/hooks/useOnChangeDebounce";
import { useApp } from "@/hooks/useApp";
type Props = {
  handleReload: () => void;
  handleOpenModal: () => void;
};
const UserFilter: React.FC<Props> = ({
  handleOpenModal,
  handleReload,
}: Props) => {
  const { notify } = useApp();
  const { userListFilter, setUserListFilter } = useUserStore(
    useShallow((state) => ({
      userListFilter: state.userListFilter,
      setUserListFilter: state.setUserListFilter,
    })),
  );
  const { debounced, value } = useOnChangeDebounce((value) => {
    setUserListFilter({
      search: value || undefined,
      current: 1,
    });
  }, userListFilter.search);
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <Input.Search
        placeholder="Tìm kiếm theo tên hoặc email..."
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
          Thêm người dùng
        </Button>
      </Space>
    </div>
  );
};
UserFilter.displayName = "UserFilter";
export default memo(UserFilter);
