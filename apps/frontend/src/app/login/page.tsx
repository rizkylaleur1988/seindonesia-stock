"use client";
import { API_URL } from "@/lib/api";
import { isLoggedIn, saveTokens, TokenResponse } from "@/lib/auth";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn()) router.replace("/dashboard");
  }, [router]);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/backend/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.message ?? "Email atau password salah");
      saveTokens(body.data as TokenResponse);
      router.replace("/dashboard");
    } catch (error: any) {
      setError(error instanceof TypeError ? "Tidak dapat terhubung ke server API" : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <b>SE</b>Indonesia
        </div>
        <div className="login-card">
          {error && <Alert type="error" showIcon title={error} style={{ marginTop: 16, marginBottom: 16 }} />}
          <Form layout="vertical" onFinish={onFinish} initialValues={{ password: "P@ssw0rd" }}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Wrong email format" },
              ]}
            >
              <Input size="large" prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: "Password is required" }]}>
              <Input.Password size="large" prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Signin
            </Button>
          </Form>
          <div style={{ marginTop: 10 }}>
            admin: system@seindonesia.com
            <br />
            demo staff: staff.store1@seindonesia.com
            <br />
            demo manager: staff.manager@seindonesia.com
            <br />
            password: P@ssw0rd
          </div>
        </div>
      </div>
    </div>
  );
}
