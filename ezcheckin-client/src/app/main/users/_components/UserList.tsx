"use client";

import { Table, Tag } from "antd";
import { useEffect, useState } from "react";

import type { ColumnsType } from "antd/es/table";

import {
  deleteUser,
  getUsers,
} from "@/features/users/user.action";

import { OptionsFetch } from "@/@types/common";
import { UserRecord, UserRole } from "@/@types/user.type";
import TableAction from "@/components/ui/TableAction";
import { usePaginationData } from "@/hooks/useDataPagination";
import { useUserStore } from "@/store/user.store";
import { useShallow } from "zustand/react/shallow";
import UserFilter from "./UserFilter";
import UserModal from "./UserModal";
import { useApp } from "@/hooks/useApp";

const roleColors: Record<UserRole, string> = {
  ADMIN: "red",
  MANAGER: "blue",
  EMPLOYEE: "green",
};

export default function UserList() {
  const {notify}=useApp()
  const { userListFilter, setUserListFilter } = useUserStore(
    useShallow((state) => ({
      userListFilter: state.userListFilter,
      setUserListFilter: state.setUserListFilter,
    }))
  );

  const { data, setData, setLoading, loading, setTotal, total } =
    usePaginationData<UserRecord>();
  const [userDetail, setUserDetail] = useState<UserRecord | null>(null);

  const fetchUsers = async (options?: OptionsFetch) => {
    try {
      setLoading(true);

      const res = await getUsers(userListFilter, options);

      setData(res.data);
      setTotal(res.meta.total);
    } catch (error) {
      notify.error("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userListFilter]);

  const handleOpenModal = (user?: UserRecord) => {
    if (user) {
      setUserDetail(user);
    } else {
      setUserDetail({} as UserRecord); // ← Empty object để mở modal create
    }
  };

  const handleCloseModal = () => {
    setUserDetail(null);
  };

  const handleSubmitSuccess = async () => {
    handleCloseModal();
    await fetchUsers({ hasRevalidate: true });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      notify.success("Xóa người dùng thành công");
      fetchUsers({ hasRevalidate: true });
    } catch (error: any) {
      notify.error(error?.message || "Có lỗi xảy ra");
    }
  };

  const columns: ColumnsType<UserRecord> = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: UserRole) => <Tag color={roleColors[role]}>{role}</Tag>,
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
      render: (_, record: UserRecord) => (
        <TableAction
          record={record}
          onClickEdit={(value) => {
            setUserDetail(value);
          }}
          onConfirmDelete={(value) => handleDelete(value._id)}
        />
      ),
    },
  ];

  return (
    <>
     <UserFilter handleReload={()=>fetchUsers({hasRevalidate:true})} handleOpenModal={handleOpenModal}/>

      <Table<UserRecord>
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{
          current: userListFilter.current || 1,
          pageSize: userListFilter.pageSize || 10,
          total,
          onChange: (page, pageSize) => {
            setUserListFilter({
              ...userListFilter,
              current: page,
              pageSize: pageSize,
            });
          },
        }}
      />
      <UserModal
        userDetail={userDetail}
        onClose={handleCloseModal}
        onSubmitSuccess={handleSubmitSuccess}
      />
    </>
  );
}

