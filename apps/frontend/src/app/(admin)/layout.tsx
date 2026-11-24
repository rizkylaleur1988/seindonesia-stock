"use client";
import { clearTokens, getName, getPermissions, getRoles, getStores, isLoggedIn } from "@/lib/auth";
import { DashboardOutlined, HddOutlined, LogoutOutlined, ReadOutlined, ShopOutlined, TeamOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, MenuProps } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

type ProvidersProps = Readonly<{ children: React.ReactNode }>;
const { Sider, Header, Content } = Layout;
const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/store-products": "Store Products",
  "/stock-opnames": "Stock Opnames",
};

type MenuItem = Required<MenuProps>["items"][number];

export default function AdminLayout({ children }: ProvidersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [stores, setStores] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }
    setName(getName());
    getRoles() && setRoles(JSON.parse(getRoles()).map((item: { name: string }) => item.name));
    getPermissions() && setPermissions(JSON.parse(getPermissions()).map((item: { code: string }) => item.code));
    getStores() && setStores(JSON.parse(getStores()).map((item: { name: string }) => item.name));
    setReady(true);
  }, [router]);

  const logout = () => {
    clearTokens();
    router.replace("/login");
  };

  const onClick = () => {};

  const items: MenuItem[] = [
    { key: "dashboard", label: "Dashboard", icon: <DashboardOutlined />, onClick: () => router.replace("/dashboard") },
    ...(permissions.includes("store-product:view")
      ? [{ key: "store-product", label: "Store Products", icon: <HddOutlined />, onClick: () => router.replace("/store-products") }]
      : []),

    ...(permissions.includes("stock-opname:view")
      ? [{ key: "stock-opname", label: "Stock Opname", icon: <ShopOutlined />, onClick: () => router.replace("/stock-opnames") }]
      : []),

    ...(permissions.some((permission) => ["product:view", "store:view", "stock-opname-shift:view"].includes(permission))
      ? [
          {
            key: "master",
            label: "Master",
            icon: <ReadOutlined />,
            children: [
              ...(permissions.includes("product:view") ? [{ key: "product", label: "Products", onClick: () => router.replace("/products") }] : []),
              ...(permissions.includes("store:view") ? [{ key: "store", label: "Stores", onClick: () => router.replace("/stores") }] : []),
              ...(permissions.includes("stock-opname-shift:view")
                ? [{ key: "stock-opname-shift", label: "Stock Opname Shift", onClick: () => router.replace("/stock-opname-shifts") }]
                : []),
            ],
          },
        ]
      : []),

    ...(permissions.some((permission) => ["permission:view", "role:view", "role-permission:view", "user:view"].includes(permission))
      ? [
          {
            key: "authentication",
            label: "Authentication",
            icon: <TeamOutlined />,
            children: [
              ...(permissions.includes("permission:view")
                ? [{ key: "permission", label: "Permissions", onClick: () => router.replace("/permissions") }]
                : []),
              ...(permissions.includes("role:view") ? [{ key: "role", label: "Roles", onClick: () => router.replace("/roles") }] : []),
              ...(permissions.includes("role-permission:view")
                ? [{ key: "role-permission", label: "Role Permissions", onClick: () => router.replace("/role-permissions") }]
                : []),
              ...(permissions.includes("user:view") ? [{ key: "user", label: "Users", onClick: () => router.replace("/users") }] : []),
            ],
          },
        ]
      : []),
  ];

  if (!ready) return null;
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={230} breakpoint="lg" collapsedWidth={0} style={{ background: "#343a40" }}>
        <div className="brand">
          <b>Se'</b>Indonesia
        </div>
        <Menu
          onClick={onClick}
          style={{ marginTop: 8 }}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["dashboard"]}
          mode="inline"
          theme="dark"
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 12,
            borderBottom: "1px solid #dee2e6",
            padding: "0 20px",
          }}
        >
          <span>
            {name} :: {roles.join(",")} :: {stores.join(", ")}
          </span>
          <Button icon={<LogoutOutlined />} onClick={logout}>
            Sign out
          </Button>
        </Header>
        <h1 className="page-title">{TITLES[pathname] ?? ""}</h1>
        <Content className="page-body">{children}</Content>
      </Layout>
    </Layout>
  );
}
