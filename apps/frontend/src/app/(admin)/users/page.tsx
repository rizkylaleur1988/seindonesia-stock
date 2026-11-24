"use client";
import { api } from "@/lib/api";
import { getPermissions } from "@/lib/auth";
import { Pagination, Role, Store, User } from "@/lib/types";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Modal, Popconfirm, Select, Space, Table } from "antd";
import { useCallback, useEffect, useState } from "react";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

type FormValues = Omit<User, "id">;

export default function UserPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const [permissions] = useState<string[]>(JSON.parse(getPermissions()).map((item: { code: string }) => item.code));
  // datagrid
  const [rows, setRows] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [q, setQ] = useState("");
  // modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [roleLoading, setRoleLoading] = useState<boolean>(false);
  const [roleOptions, setRoleOptions] = useState<{ value: number; label: string }[]>([]);
  const [storeLoading, setStoreLoading] = useState<boolean>(false);
  const [storeOptions, setStoreOptions] = useState<{ value: number; label: string }[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sortBy: "id", sortType: "ASC", page: String(page), limit: String(pageSize), search: q });
      const response = await api<{ data: User[]; pagination: Pagination }>(`/backend/api/users?${params}`);
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
    void handleSearchRole("");
    void handleSearchStore("");
    setOpen(true);
  };

  const openEdit = (params: User) => {
    setEditing(params);
    form.setFieldsValue({
      name: params.name,
      email: params.email,
      roles: params.roles.map((item) => item.id),
      stores: params.stores.map((item) => item.id),
    });
    void handleSearchRole("");
    void handleSearchStore("");
    setOpen(true);
  };

  const handleSearchRole = async (search: string) => {
    setRoleLoading(true);
    try {
      const params = new URLSearchParams({ sortBy: "name", sortType: "ASC", page: "1", limit: "10", search });
      const response = await api<{ data: Role[]; pagination: Pagination }>(`/backend/api/roles?${params}`);
      setRoleOptions(response.data.map((item) => ({ value: item.id, label: item.name })));
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setRoleLoading(false);
    }
  };

  const handleSearchStore = async (search: string) => {
    setStoreLoading(true);
    try {
      const params = new URLSearchParams({ sortBy: "name", sortType: "ASC", page: "1", limit: "10", search });
      const response = await api<{ data: Store[]; pagination: Pagination }>(`/backend/api/stores?${params}`);
      setStoreOptions(response.data.map((item) => ({ value: item.id, label: item.name })));
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setStoreLoading(false);
    }
  };

  const save = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      if (editing) {
        await api(`/backend/api/users/${editing.id}`, { method: "PUT", body: JSON.stringify(values) });
        message.success("User has been updated");
      } else {
        await api("/backend/api/users", { method: "POST", body: JSON.stringify(values) });
        message.success("User has been created");
      }
      void load();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setSaving(false);
      setOpen(false);
    }
  };
  const remove = async (params: User) => {
    try {
      await api(`/backend/api/users/${params.id}`, { method: "DELETE" });
      message.success("User has been deleted");
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
          <h3 className="box-title">User List</h3>
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
            {permissions.includes("user:store") && (
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                Add New
              </Button>
            )}
          </Space>
        </div>
        <div className="box-body">
          <Table<User>
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
              { title: "Name", dataIndex: "name" },
              { title: "Email", dataIndex: "email" },
              {
                title: "Store",
                dataIndex: "store",
                render: (_: any, r: User) => {
                  return r.stores.map((item) => item.name).join(", ");
                },
              },
              {
                title: "Role",
                dataIndex: "role",
                render: (_: any, r: User) => {
                  return r.roles.map((item) => item.name).join(", ");
                },
              },
              ...(["user:update", "user:delete"].every((permission) => permissions.includes(permission))
                ? [
                    {
                      title: "Action",
                      width: 110,
                      render: (_: any, r: User) => (
                        <Space>
                          {permissions.includes("user:update") && (
                            <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => openEdit(r)} />
                          )}
                          {permissions.includes("user:delete") && (
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
        title={editing ? "Edit User" : "Add New User"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={save}
        okText="Save"
        confirmLoading={saving}
        forceRender
      >
        <Form<FormValues> form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Name is required" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Wrong email format" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Roles" name="roles" rules={[{ required: true, message: "Roles is required" }]}>
            <Select
              mode="multiple"
              showSearch={{ filterOption: false, onSearch: handleSearchRole }}
              allowClear
              placeholder="Choose Role"
              options={roleOptions}
              loading={roleLoading}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item label="Stores" name="stores" rules={[{ required: true, message: "Stores is required" }]}>
            <Select
              mode="multiple"
              showSearch={{ filterOption: false, onSearch: handleSearchStore }}
              allowClear
              placeholder="Choose Store"
              options={storeOptions}
              loading={storeLoading}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
