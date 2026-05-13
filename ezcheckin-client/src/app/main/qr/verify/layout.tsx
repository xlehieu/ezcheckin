import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xác thực QR | EzCheckIn",
  description: "Xác thực mã QR check-in",
};

export default function QRVerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
