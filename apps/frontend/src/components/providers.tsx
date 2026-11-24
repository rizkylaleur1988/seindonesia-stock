"use client";

import { App, ConfigProvider } from "antd";
import React from "react";

type ProvidersProps = Readonly<{ children: React.ReactNode }>;

export function Providers({ children }: ProvidersProps) {
  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#007bff", borderRadius: 4 },
        components: {
          Menu: {
            darkItemBg: "transparent",
            darkItemSelectedBg: "#007bff",
            darkItemHoverBg: "rgba(255,255,255,.1)",
          },
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
