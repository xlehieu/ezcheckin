import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Doanh nghiệp',
};

export default function MyBusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
