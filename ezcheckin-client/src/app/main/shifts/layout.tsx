import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ca làm việc",
};

export default function ShiftsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
