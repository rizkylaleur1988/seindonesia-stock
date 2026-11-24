"use client";
import { api } from "@/lib/api";
import { getPermissions, getStores } from "@/lib/auth";
import { Pagination, Product, StoreProduct } from "@/lib/types";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Modal, Popconfirm, Select, Space, Table } from "antd";
import { useCallback, useEffect, useState } from "react";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

type FormValues = Omit<StoreProduct, "id" | "stock">;

export default function StoreProductPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const [permissions] = useState<string[]>(JSON.parse(getPermissions()).map((item: { code: string }) => item.code));
  // datagrid
  const [rows, setRows] = useState<StoreProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
  const [q, setQ] = useState("");
  // modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<StoreProduct | null>(null);
  const [saving, setSaving] = useState(false);
  const [productLoading, setProductLoading] = useState<boolean>(false);
  const [productOptions, setProductOptions] = useState<{ value: number; label: string }[]>([]);
  const [storeLoading, setStoreLoading] = useState<boolean>(false);
  const [storeOptions, setStoreOptions] = useState<{ value: number; label: string }[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sortBy: "id", sortType: "ASC", page: String(page), limit: String(pageSize), search: q });
      const response = await api<{ data: StoreProduct[]; pagination: Pagination }>(`/backend/api/store-products?${params}`);
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

  const handleSearchStore = () => {
    setStoreLoading(true);
    try {
      const stores = getStores() ? JSON.parse(getStores()) : [];
      setStoreOptions(stores.map((item: { id: number; name: string }) => ({ value: item.id, label: item.name })));
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setStoreLoading(false);
    }
  };
  const handleSearchProduct = async (search: string) => {
    setProductLoading(true);
    try {
      const params = new URLSearchParams({ sortBy: "name", sortType: "ASC", page: "1", limit: "10", search });
      const response = await api<{ data: Product[]; pagination: Pagination }>(`/backend/api/products?${params}`);
      setProductOptions(response.data.map((item) => ({ value: item.id, label: item.name })));
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setProductLoading(false);
    }
  };
  const save = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      if (editing) {
        await api(`/backend/api/store-products/${editing.id}`, { method: "PUT", body: JSON.stringify(values) });
        message.success("Store Product has been updated");
      } else {
        await api("/backend/api/store-products", { method: "POST", body: JSON.stringify(values) });
        message.success("Store Product has been created");
      }
      void load();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setSaving(false);
      setOpen(false);
    }
  };
  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    handleSearchStore();
    void handleSearchProduct("");
    setOpen(true);
  };
  const openEdit = (params: StoreProduct) => {
    setEditing(params);
    form.setFieldsValue(params);
    handleSearchStore();
    void handleSearchProduct("");
    setOpen(true);
  };
  const remove = async (params: StoreProduct) => {
    try {
      await api(`/backend/api/store-products/${params.id}`, { method: "DELETE" });
      message.success("Store Product has been deleted");
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
          <h3 className="box-title">Store Product List</h3>
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
            {permissions.includes("store-product:store") && (
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                Add New
              </Button>
            )}
          </Space>
        </div>
        <div className="box-body">
          <Table<StoreProduct>
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
              { title: "Product", dataIndex: ["product", "name"] },
              { title: "Stock", dataIndex: "stock" },
              ...(["store-product:update", "store-product:delete"].every((permission) => permissions.includes(permission))
                ? [
                    {
                      title: "Action",
                      width: 110,
                      render: (_: any, r: StoreProduct) => (
                        <Space>
                          {permissions.includes("store-product:update") && (
                            <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => openEdit(r)} />
                          )}
                          {permissions.includes("store-product:delete") && (
                            <Popconfirm title="Are you sure ?" okText="Hapus" cancelText="Batal" onConfirm={() => remove(r)}>
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
        title={editing ? "Edit Store Product" : "Add New Store Product"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={save}
        okText="Save"
        confirmLoading={saving}
        forceRender
      >
        <Form<FormValues> form={form} layout="vertical">
          <Form.Item label="Store" name="store_id" rules={[{ required: true, message: "Store is required" }]}>
            <Select
              showSearch={{ filterOption: false, onSearch: handleSearchStore }}
              allowClear
              placeholder="Choose Store"
              options={storeOptions}
              loading={storeLoading}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item label="Product" name="product_id" rules={[{ required: true, message: "Product is required" }]}>
            <Select
              showSearch={{ filterOption: false, onSearch: handleSearchProduct }}
              allowClear
              placeholder="Choose Product"
              options={productOptions}
              loading={productLoading}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
