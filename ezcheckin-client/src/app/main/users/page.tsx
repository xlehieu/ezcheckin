"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const users: User[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "a@gmail.com",
    role: "Admin",
  },
  {
    id: 2,
    name: "Trần Văn B",
    email: "b@gmail.com",
    role: "User",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "c@gmail.com",
    role: "Editor",
  },
  {
    id: 4,
    name: "Phạm Văn D",
    email: "d@gmail.com",
    role: "User",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "e@gmail.com",
    role: "Admin",
  },
  {
    id: 6,
    name: "Nguyễn Văn F",
    email: "f@gmail.com",
    role: "User",
  },
  {
    id: 7,
    name: "Trần Văn G",
    email: "g@gmail.com",
    role: "Editor",
  },
  {
    id: 8,
    name: "Lê Văn H",
    email: "h@gmail.com",
    role: "User",
  },
];

const PAGE_SIZE = 5;

export default function UserTable() {
  const [roleFilter, setRoleFilter] = React.useState("all");

  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);

  const [page, setPage] = React.useState(1);

  // filter
  const filteredUsers = React.useMemo(() => {
    if (roleFilter === "all") return users;

    return users.filter((user) => user.role === roleFilter);
  }, [roleFilter]);

  // pagination
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

  const paginatedUsers = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;

    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, page]);

  // checkbox
  const isAllSelected =
    paginatedUsers.length > 0 &&
    paginatedUsers.every((user) => selectedRows.includes(user.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows((prev) =>
        prev.filter(
          (id) => !paginatedUsers.some((user) => user.id === id)
        )
      );
    } else {
      setSelectedRows((prev) => [
        ...new Set([
          ...prev,
          ...paginatedUsers.map((user) => user.id),
        ]),
      ]);
    }
  };

  const toggleSelectRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  React.useEffect(() => {
    setPage(1);
  }, [roleFilter]);

  return (
    <div className="space-y-4">
      {/* FILTER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:w-[220px]">
          <Select
            value={roleFilter}
            onValueChange={setRoleFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Lọc theo role" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="User">User</SelectItem>
              <SelectItem value="Editor">Editor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          Đã chọn {selectedRows.length} dòng
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-md border">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>

              <TableHead>ID</TableHead>

              <TableHead>Họ tên</TableHead>

              <TableHead>Email</TableHead>

              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(user.id)}
                      onCheckedChange={() =>
                        toggleSelectRow(user.id)
                      }
                    />
                  </TableCell>

                  <TableCell>{user.id}</TableCell>

                  <TableCell className="font-medium">
                    {user.name}
                  </TableCell>

                  <TableCell>{user.email}</TableCell>

                  <TableCell>{user.role}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Trang {page} / {totalPages || 1}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            <ChevronsLeft className="size-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setPage((prev) => Math.max(prev - 1, 1))
            }
            disabled={page === 1}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setPage((prev) =>
                Math.min(prev + 1, totalPages)
              )
            }
            disabled={page === totalPages}
          >
            <ChevronRight className="size-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}