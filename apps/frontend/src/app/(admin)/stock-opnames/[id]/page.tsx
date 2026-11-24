"use client";
import { api } from "@/lib/api";
import { getPermissions, getRoles } from "@/lib/auth";
import { GetStockOpname, GetStockOpnameItem } from "@/lib/types";
import { DislikeOutlined, LikeOutlined, RestOutlined, SendOutlined } from "@ant-design/icons";
import { App, Button, Card, Descriptions, Row, Space, Table, Tag } from "antd";
import Text from "antd/es/typography/Text";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

type Params = { id: string };

export default function ViewStockOpnamePage() {
  const router = useRouter();
  const { message } = App.useApp();
  const params = useParams<Params>();
  const [permissions] = useState<string[]>(JSON.parse(getPermissions()).map((item: { code: string }) => item.code));
  const [roles] = useState<string[]>(JSON.parse(getRoles()).map((item: { code: string }) => item.code));
  const [data, setData] = useState<GetStockOpname>();
  const [ready, setReady] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [items, setItems] = useState<GetStockOpnameItem[]>([]);

  useEffect(() => void getData(params), [params.id]);

  const getData = async (params: Params) => {
    setLoading(true);
    try {
      const response = await api<{ data: GetStockOpname }>(`/backend/api/stock-opnames/${params.id}`);
      setData(response.data);
      setItems(response.data.items);
      setReady(true);
    } catch (error: any) {
      message.error(error.message);
      if (error.message.trim().toLowerCase() === "not found") router.push("/stock-opnames");
    } finally {
      setLoading(false);
    }
  };

  const approval = async (id: number, approval_code: string) => {
    setLoadingAction(true);
    try {
      const payload = { id, approval_code };
      await api("/backend/api/stock-opnames/approval", { method: "POST", body: JSON.stringify(payload) });
      message.success(`Stock Opname has been ${approval_code}`);
      router.push("/stock-opnames");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const getStatusColor = (status?: string | null) => {
    switch (status) {
      case "DRAFT":
        return "default";
      case "SUBMITTED":
        return "processing";
      case "APPROVED":
        return "success";
      case "REJECTED":
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  if (!ready) return null;

  return (
    <>
      <Card title="Stock Opname Detail" extra={<Tag color={getStatusColor(data?.status_name)}>{data?.status_name}</Tag>}>
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 2 }}>
          <Descriptions.Item label="Store">{data?.store ? `${data.store.code} - ${data.store.name}` : null}</Descriptions.Item>
          <Descriptions.Item label="Date">{data?.stock_opname_date ?? null}</Descriptions.Item>
          <Descriptions.Item label="Shift">{data?.shift ? `${data.shift.code} - ${data.shift.name}` : null}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(data?.status_name)}>{data?.status_name ?? null}</Tag>
            <div>{data?.statused_by_user ?? null}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {data?.statused_at ? dayjs(data?.statused_at).format("YYYY-MM-DD HH:mm:ss") : null}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Created By">{data?.created_by_user ?? null}</Descriptions.Item>
          <Descriptions.Item label="Created At">{data?.created_at ? dayjs(data?.created_at).format("YYYY-MM-DD HH:mm:ss") : null}</Descriptions.Item>
          <Descriptions.Item label="Updated By">{data?.updated_by_user ?? null}</Descriptions.Item>
          <Descriptions.Item label="Updated At">{data?.updated_at ? dayjs(data?.updated_at).format("YYYY-MM-DD HH:mm:ss") : null}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="Products" extra={<Text type="secondary">{items.length} products</Text>}>
        <Table<GetStockOpnameItem>
          rowKey="id"
          loading={loading}
          dataSource={items}
          pagination={false}
          scroll={{ x: "max-content" }}
          columns={[
            { title: "Product", dataIndex: ["product_name"] },
            { title: "Counted Stock", dataIndex: ["counted_qty"] },
            ...(data?.status_name && ["DRAFT", "SUBMITTED"].includes(data?.status_name)
              ? [
                  { title: "System Stock", dataIndex: ["system_qty"] },
                  {
                    title: "Notes",
                    dataIndex: ["notes"],
                    render: (_: any, r: GetStockOpnameItem) => {
                      if (r.notes?.trim().toLowerCase() === "listed") {
                        return <Tag color="success">{r.notes.toUpperCase()}</Tag>;
                      } else if (r.notes?.trim().toLowerCase() === "unlisted") {
                        return <Tag color="warning">{r.notes.toUpperCase()}</Tag>;
                      }
                      return r.notes;
                    },
                  },
                ]
              : []),
          ]}
        />
      </Card>
      <Row justify="end" style={{ marginTop: 16 }}>
        <Space orientation="horizontal">
          {permissions.includes("stock-opname:approval") && roles.includes("STORE_STAFF") && data && data?.status_name === "DRAFT" && (
            <>
              <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={loadingAction} onClick={() => approval(data.id, "SUBMITTED")}>
                Send
              </Button>
              <Button danger htmlType="submit" icon={<RestOutlined />} loading={loadingAction} onClick={() => approval(data.id, "CANCELLED")}>
                Cancel
              </Button>
            </>
          )}
          {permissions.includes("stock-opname:approval") && roles.includes("STORE_MANAGER") && data && data?.status_name === "SUBMITTED" && (
            <>
              <Button type="primary" htmlType="submit" icon={<LikeOutlined />} loading={loadingAction} onClick={() => approval(data.id, "APPROVED")}>
                Approve
              </Button>
              <Button danger htmlType="submit" icon={<DislikeOutlined />} loading={loadingAction} onClick={() => approval(data.id, "REJECTED")}>
                Reject
              </Button>
            </>
          )}
        </Space>
      </Row>
    </>
  );
}
