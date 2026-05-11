"use client";

import { ConfigProvider, theme } from "antd";
import { useTheme } from "next-themes";

export default function AntdProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark
          ? theme.darkAlgorithm
          : theme.defaultAlgorithm,

        token: {
          colorPrimary: "#f0b100",
          borderRadius: 10,
        },
        components:{
          Table:{
            headerBg:!isDark?"#eaeaea":undefined
          }
        }
      }}
    >
      {children}
    </ConfigProvider>
  );
}