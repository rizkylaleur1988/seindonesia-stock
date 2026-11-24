"use client";
import { api } from "@/lib/api";
import { getPermissions } from "@/lib/auth";
import { Pagination, Permission, Role, RolePermission } from "@/lib/types";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Form, Modal, Popconfirm, Select, Space, Table } from "antd";
import { useCallback, useEffect, useState } from "react";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

type FormValues = Omit<RolePermission, "id">;

export default function RolePermissionPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const [permissions] = useState<string[]>(JSON.parse(getPermissions()).map((item: { code: string }) => item.code));
  // datagrid
  const [rows, setRows] = useState<RolePermission[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [q, setQ] = useState("");
  // modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<RolePermission | null>(null);
  const [saving, setSaving] = useState(false);
  const [roleLoading, setRoleLoading] = useState<boolean>(false);
  const [roleOptions, setRoleOptions] = useState<{ value: number; label: string }[]>([]);
  const [permissionLoading, setPermissionLoading] = useState<boolean>(false);
  const [permissionOptions, setPermissionOptions] = useState<{ value: number; label: string }[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sortBy: "role_id", sortType: "ASC", page: String(page), limit: String(pageSize), search: q });
      const response = await api<{ data: RolePermission[]; pagination: Pagination }>(`/backend/api/role-permissions?${params}`);
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
    void handleSearchPermission("");
    setOpen(true);
  };

  const openEdit = (params: RolePermission) => {
    console.log("params", params);
    setEditing(params);
    form.setFieldsValue(params);
    void handleSearchRole("");
    void handleSearchPermission("");
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

  const handleSearchPermission = async (search: string) => {
    setPermissionLoading(true);
    try {
      const params = new URLSearchParams({ sortBy: "name", sortType: "ASC", page: "1", limit: "10", search });
      const response = await api<{ data: Permission[]; pagination: Pagination }>(`/backend/api/permissions?${params}`);
      setPermissionOptions(response.data.map((item) => ({ value: item.id, label: item.name })));
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setPermissionLoading(false);
    }
  };

  const save = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      if (editing) {
        await api(`/backend/api/role-permissions/${editing.role_id}/${editing.permission_id}`, { method: "PUT", body: JSON.stringify(values) });
        message.success("Role Permission has been updated");
      } else {
        await api("/backend/api/role-permissions", { method: "POST", body: JSON.stringify(values) });
        message.success("Role Permission has been created");
      }
      void load();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setSaving(false);
      setOpen(false);
    }
  };
  const remove = async (params: RolePermission) => {
    try {
      await api(`/backend/api/role-permissions/${params.role_id}/${params.permission_id}`, { method: "DELETE" });
      message.success("Role Permission has been deleted");
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
          <h3 className="box-title">Role Permission List</h3>
          <Space wrap>
            {permissions.includes("role-permission:store") && (
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                Add New
              </Button>
            )}
          </Space>
        </div>
        <div className="box-body">
          <Table<RolePermission>
            rowKey={(record) => `${record.role_id}-${record.permission_id}`}
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
              {
                title: "Role",
                dataIndex: "role_id",
                render: (_: any, r: RolePermission) => {
                  return r.role?.name ?? null;
                },
              },
              {
                title: "Permission",
                dataIndex: "permission_id",
                render: (_: any, r: RolePermission) => {
                  return r.permission?.name ?? null;
                },
              },
              ...(["role-permission:update", "role-permission:delete"].every((permission) => permissions.includes(permission))
                ? [
                    {
                      title: "Action",
                      width: 110,
                      render: (_: any, r: RolePermission) => (
                        <Space>
                          {/* {permissions.includes("role-permission:update") && (
                            <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => openEdit(r)} />
                          )} */}
                          {permissions.includes("role-permission:delete") && (
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
        title={editing ? "Edit Role Permission" : "Add New Role Permission"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={save}
        okText="Save"
        confirmLoading={saving}
        forceRender
      >
        <Form<FormValues> form={form} layout="vertical">
          <Form.Item label="Role" name="role_id" rules={[{ required: true, message: "Role is required" }]}>
            <Select
              showSearch={{ filterOption: false, onSearch: handleSearchRole }}
              allowClear
              placeholder="Choose Store"
              options={roleOptions}
              loading={roleLoading}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item label="Permission" name="permission_id" rules={[{ required: true, message: "Permission is required" }]}>
            <Select
              showSearch={{ filterOption: false, onSearch: handleSearchPermission }}
              allowClear
              placeholder="Choose Store"
              options={permissionOptions}
              loading={permissionLoading}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
