import { Providers } from "@/components/providers";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const metadata: Metadata = {
  title: "SE'INDONESIA",
  description: "SE'INDONESIA::STOCK",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <Suspense>
          <AntdRegistry>
            <Providers>{children}</Providers>
          </AntdRegistry>
        </Suspense>
      </body>
    </html>
  );
}
