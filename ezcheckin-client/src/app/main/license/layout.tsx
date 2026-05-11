import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giấy phép',
};

export default function LicenseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
