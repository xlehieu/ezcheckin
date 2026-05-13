import { Metadata } from "next";
import UserList from "./_components/UserList";

export const metadata: Metadata = {
  title: "Nhân viên",
};

export default function UsersPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Danh sách nhân viên</h1>
        <p className="text-gray-500 mt-1">Quản lý danh sách nhân viên trong công ty</p>
      </div>
      <UserList />
    </div>
  );
}

