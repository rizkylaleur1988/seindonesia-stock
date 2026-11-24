"use client";
import { api } from "@/lib/api";
import { getPermissions } from "@/lib/auth";
import { Pagination, Role } from "@/lib/types";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Modal, Popconfirm, Space, Table } from "antd";
import { useCallback, useEffect, useState } from "react";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

type FormValues = Omit<Role, "id">;

export default function RolePage() {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const [permissions] = useState<string[]>(JSON.parse(getPermissions()).map((item: { code: string }) => item.code));
  // datagrid
  const [rows, setRows] = useState<Role[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [q, setQ] = useState("");
  // modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sortBy: "id", sortType: "ASC", page: String(page), limit: String(pageSize), search: q });
      const response = await api<{ data: Role[]; pagination: Pagination }>(`/backend/api/roles?${params}`);
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

  const openEdit = (params: Role) => {
    setEditing(params);
    form.setFieldsValue(params);
    setOpen(true);
  };

  const save = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      if (editing) {
        await api(`/backend/api/roles/${editing.id}`, { method: "PUT", body: JSON.stringify(values) });
        message.success("Role has been updated");
      } else {
        await api("/backend/api/roles", { method: "POST", body: JSON.stringify(values) });
        message.success("Role has been created");
      }
      void load();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setSaving(false);
      setOpen(false);
    }
  };
  const remove = async (params: Role) => {
    try {
      await api(`/backend/api/roles/${params.id}`, { method: "DELETE" });
      message.success("Role has been deleted");
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
          <h3 className="box-title">Role List</h3>
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
            {permissions.includes("role:store") && (
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                Add New
              </Button>
            )}
          </Space>
        </div>
        <div className="box-body">
          <Table<Role>
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
              ...(["role:update", "role:delete"].every((permission) => permissions.includes(permission))
                ? [
                    {
                      title: "Action",
                      width: 110,
                      render: (_: any, r: Role) => (
                        <Space>
                          {permissions.includes("role:update") && (
                            <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => openEdit(r)} />
                          )}
                          {permissions.includes("role:delete") && (
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
        title={editing ? "Edit Role" : "Add New Role"}
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
        </Form>
      </Modal>
    </>
  );
}
