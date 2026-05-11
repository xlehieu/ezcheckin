"use client"
import { Button, Popconfirm, Space, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import React, { memo } from "react";

type TableActionProps<T> = {
  record: T;
  onClickEdit: (record: T) => void | Promise<void>;
  onConfirmDelete: (record: T) => void | Promise<void>;
  allowEdit?: boolean;
  allowDelete?: boolean;
};

const TableAction = <T,>({
  record,
  onClickEdit,
  onConfirmDelete,
  allowEdit = true,
  allowDelete = true,
}: TableActionProps<T>) => {
  return (
    <Space size="middle">
      {allowEdit && (
        <Tooltip title="Chỉnh sửa">
          <Button
            type="text"
            icon={<EditOutlined className="text-blue-500" style={{fontSize:18}}/>}
            onClick={() => onClickEdit(record)}
            className="hover:bg-blue-50"
          />
        </Tooltip>
      )}
      {allowDelete && (
        <Tooltip title="Xóa">
          <Popconfirm
            title="Xóa dữ liệu"
            description="Bạn có chắc muốn xóa không?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={async() => await onConfirmDelete(record)}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined style={{fontSize:18}}/>}
              className="hover:bg-red-50"
            />
          </Popconfirm>
        </Tooltip>
      )}
    </Space>
  );
};

TableAction.displayName = "TableAction";

export default memo(TableAction) as typeof TableAction;
