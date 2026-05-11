import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import "sonner/dist/styles.css";
import AntProvider from "@/provider/AntProvider";
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({ subsets: ["latin"] });
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Ez Checkin",
    template: "%s | Ez Checkin",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={cn("font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-right" richColors />
          {/* Main Content: grow để đẩy Footer xuống cuối trang */}
          <AntProvider>
            <main className="grow w-screen">{children}</main>
          </AntProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
