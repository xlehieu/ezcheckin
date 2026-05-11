import { Metadata } from "next";
import ShiftList from "./_components/ShiftList";

export const metadata: Metadata = {
  title: "Ca làm việc",
};

export default function ShiftsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Danh sách ca làm việc</h1>
      </div>
      <ShiftList />
    </div>
  );
}
