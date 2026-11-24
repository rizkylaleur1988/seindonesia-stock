"use client";
import { api } from "@/lib/api";
import { getPermissions } from "@/lib/auth";
import { Pagination, StockOpnameShift } from "@/lib/types";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, InputNumber, Modal, Popconfirm, Space, Table } from "antd";
import { useCallback, useEffect, useState } from "react";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

type FormValues = Omit<StockOpnameShift, "id">;

export default function StockOpnameShiftPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const [permissions] = useState<string[]>(JSON.parse(getPermissions()).map((item: { code: string }) => item.code));
  // datagrid
  const [rows, setRows] = useState<StockOpnameShift[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [q, setQ] = useState("");
  // modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<StockOpnameShift | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sortBy: "id", sortType: "ASC", page: String(page), limit: String(pageSize), search: q });
      const response = await api<{ data: StockOpnameShift[]; pagination: Pagination }>(`/backend/api/stock-opname-shifts?${params}`);
      setRows(response.data);
      setTotal(response.pagination.total);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, q, message]);
  useEffect(() => void load(), [load]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (params: StockOpnameShift) => {
    setEditing(params);
    form.setFieldsValue(params);
    setOpen(true);
  };

  const save = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      if (editing) {
        await api(`/backend/api/stock-opname-shifts/${editing.id}`, { method: "PUT", body: JSON.stringify(values) });
        message.success("Stock Opname Shift has been updated");
      } else {
        await api("/backend/api/stock-opname-shifts", { method: "POST", body: JSON.stringify(values) });
        message.success("Stock Opname Shift has been created");
      }
      void load();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setSaving(false);
      setOpen(false);
    }
  };
  const remove = async (params: StockOpnameShift) => {
    try {
      await api(`/backend/api/stock-opname-shifts/${params.id}`, { method: "DELETE" });
      message.success("Stock Opname Shift has been deleted");
      if (rows.length === 1 && page > 1) setPage(page - 1);
      else void load();
    } catch (error: any) {
      message.error(error.message);
    }
  };
  return (
    <>
      <div className="box">
        <div className="box-head">
          <h3 className="box-title">Stock Opname Shift List</h3>
          <Space wrap>
            <Input.Search
              allowClear
              placeholder="Find Code / Name"
              style={{ width: 240 }}
              onSearch={(v) => {
                setQ(v);
                setPage(1);
              }}
            />
            {permissions.includes("stock-opname-shift:store") && (
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                Add New
              </Button>
            )}
          </Space>
        </div>
        <div className="box-body">
          <Table<StockOpnameShift>
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
              { title: "Code", dataIndex: "code" },
              { title: "Name", dataIndex: "name" },
              { title: "Ordering", dataIndex: "ordering" },
              ...(["stock-opname-shift:update", "stock-opname-shift:delete"].every((permission) => permissions.includes(permission))
                ? [
                    {
                      title: "Action",
                      width: 110,
                      render: (_: any, r: StockOpnameShift) => (
                        <Space>
                          {permissions.includes("stock-opname-shift:update") && (
                            <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => openEdit(r)} />
                          )}
                          {permissions.includes("stock-opname-shift:delete") && (
                            <Popconfirm title="Are you sure ?" okText="Delete" cancelText="Cancel" onConfirm={() => remove(r)}>
                              <Button size="small" danger icon={<DeleteOutlined />} />
                            </Popconfirm>
                          )}
                        </Space>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </div>
      </div>
      <Modal
        title={editing ? "Edit Stock Opname Shift" : "Add New Stock Opname Shift"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={save}
        okText="Save"
        confirmLoading={saving}
        forceRender
      >
        <Form<FormValues> form={form} layout="vertical">
          <Form.Item label="Code" name="code" rules={[{ required: true, message: "Code is required" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Name is required" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Ordering" name="ordering" rules={[{ required: true, message: "Ordering is required" }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
