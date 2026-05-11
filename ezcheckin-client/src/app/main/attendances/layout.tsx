import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chấm Công',
};

export default function AttendancesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
