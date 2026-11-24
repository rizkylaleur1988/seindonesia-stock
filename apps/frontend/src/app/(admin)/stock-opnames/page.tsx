"use client";
import { api } from "@/lib/api";
import { getPermissions } from "@/lib/auth";
import { Pagination, StockOpname } from "@/lib/types";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Space, Table } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export default function StockOpnamePage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [permissions] = useState<string[]>(JSON.parse(getPermissions()).map((item: { code: string }) => item.code));
  // datagrid
  const [rows, setRows] = useState<StockOpname[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
  const [q, setQ] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sortBy: "id", sortType: "ASC", page: String(page), limit: String(pageSize), search: q });
      const response = await api<{ data: StockOpname[]; pagination: Pagination }>(`/backend/api/stock-opnames?${params}`);
      setRows(response.data);
      setTotal(response.pagination.total);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const load = useCallback(loadData, [page, pageSize, q, message]);
  useEffect(() => void load(), [load]);

  return (
    <div className="box">
      <div className="box-head">
        <h3 className="box-title">Stock Opname List</h3>
        <Space wrap>
          {permissions.includes("stock-opname:store") && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("stock-opnames/create")}>
              Add New
            </Button>
          )}
        </Space>
      </div>
      <div className="box-body">
        <Table<StockOpname>
          rowKey="id"
          loading={loading}
          dataSource={rows}
          scroll={{ x: "max-content" }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            onChange: (p, s) => {
              setPage(p);
              setPageSize(s);
            },
          }}
          columns={[
            { title: "ID", dataIndex: "id", width: 70 },
            { title: "Store", dataIndex: ["store", "name"] },
            { title: "Shift", dataIndex: ["stock_opname_shift", "name"] },
            { title: "Date", dataIndex: "stock_opname_date" },
            { title: "Status", dataIndex: "status_name" },
            { title: "Status By", dataIndex: ["statused_by_user", "name"] },
            {
              title: "Status At",
              dataIndex: "statused_at",
              render: (value: string) => {
                return value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : null;
              },
            },
            {
              title: "Action",
              width: 110,
              align: "center",
              render: (_: any, r: StockOpname) => (
                <Space align="center">
                  <Button size="small" type="primary" icon={<EyeOutlined />} onClick={() => router.push(`/stock-opnames/${r.id}`)} />
                </Space>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
