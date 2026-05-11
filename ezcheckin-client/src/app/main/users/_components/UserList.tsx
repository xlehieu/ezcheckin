"use client";

import { useEffect } from "react";

import { Select, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import { getUsers } from "@/features/users/user.action";

import { UserRecord, UserRole } from "@/@types/user.type";
import { usePaginationData } from "@/hooks/useDataPagination";
import { useUserStore } from "@/store/user.store";
import { useShallow } from "zustand/react/shallow";
const roleColors: Record<UserRole, string> = {
  ADMIN: "red",
  MANAGER: "blue",
  EMPLOYEE: "green",
};


export default function UserList() {
  const { userListFilter, setUserListFilter } = useUserStore(
  useShallow((state) => ({
    userListFilter: state.userListFilter,
    setUserListFilter: state.setUserListFilter,
  }))
);

  const {data,setData,setLoading,loading,setTotal,total}=usePaginationData<UserRecord>()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const res = await getUsers(userListFilter);

        setData(res.data);
        setTotal(res.meta.total);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userListFilter]);

  const columns: ColumnsType<UserRecord> = [
    // {
    //   title: <Checkbox />,

    //   width: 60,

    //   render: () => <Checkbox />,
    // },

    {
      title: "Email",
      dataIndex: "email",
    },

    {
      title: "Role",
      dataIndex: "role",

      render: (role: UserRole) => <Tag color={roleColors[role]}>{role}</Tag>,
    },

    {
      title: "Status",
      dataIndex: "isActive",

      render: (value: boolean) => (value ? "Active" : "Inactive"),
    },

    {
      title: "Created At",
      dataIndex: "createdAt",

      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
      <>
          <div className="flex items-center justify-between gap-4">
            <Select
              allowClear
              placeholder="Filter role"
              className="w-[220px]"
              value={userListFilter.role}
              onChange={(value) =>
                setUserListFilter({
                  ...userListFilter,
                  role: value,
                  current: 1,
                })
              }
              options={[
                {
                  label: "ADMIN",
                  value: "ADMIN",
                },
                {
                  label: "MANAGER",
                  value: "MANAGER",
                },
                {
                  label: "EMPLOYEE",
                  value: "EMPLOYEE",
                },
              ]}
            />
          </div>
    
          <Table<UserRecord>
            rowKey="_id"
            loading={loading}
            columns={columns}
            dataSource={data}
            pagination={{
              current: userListFilter.current,
              pageSize: userListFilter.pageSize,
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
      </>
  );
}
