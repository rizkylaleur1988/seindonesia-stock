"use client";
import { api } from "@/lib/api";
import { getStores } from "@/lib/auth";
import { Pagination, Product, StockOpnameShift } from "@/lib/types";
import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { App, Button, Card, Col, DatePicker, Form, InputNumber, Row, Select, Space } from "antd";
import type { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

type Item = { product_id: number; counted_qty: number };
type FormValues = { store_id: number; stock_opname_shift_id: number; stock_opname_date: Dayjs; items: Item[] };

export default function CreateStockOpnamePage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState<boolean>(false);
  const [storeLoading, setStoreLoading] = useState<boolean>(false);
  const [storeOptions, setStoreOptions] = useState<{ value: number; label: string }[]>([]);
  const [productLoading, setProductLoading] = useState<boolean>(false);
  const [productOptions, setProductOptions] = useState<{ value: number; label: string }[]>([]);
  const [shiftLoading, setShiftLoading] = useState<boolean>(false);
  const [shiftOptions, setShiftOptions] = useState<{ value: number; label: string }[]>([]);
  useEffect(() => {
    handleSearchStore();
    void handleSearchProduct("");
    void handleSearchShift("");
  }, []);

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

  const handleSearchShift = async (search: string) => {
    setShiftLoading(true);
    try {
      const params = new URLSearchParams({ sortBy: "name", sortType: "ASC", page: "1", limit: "10", search });
      const response = await api<{ data: StockOpnameShift[]; pagination: Pagination }>(`/backend/api/stock-opname-shifts?${params}`);
      setShiftOptions(response.data.map((item) => ({ value: item.id, label: item.name })));
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setShiftLoading(false);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const payload = { ...values, stock_opname_date: values.stock_opname_date.format("YYYY-MM-DD") };
      await api("/backend/api/stock-opnames", { method: "POST", body: JSON.stringify(payload) });
      message.success("Store Product has been created");
      router.push("/stock-opnames");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="box">
      <div className="box-head">
        <h3 className="box-title">Create Stock Opname</h3>
      </div>
      <div className="box-body">
        <Form<FormValues> form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ items: [{ product_id: undefined, stock: 0 }] }}>
          <Row gutter={16}>
            <Col xs={24} md={24}>
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
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Date" name="stock_opname_date" rules={[{ required: true, message: "Date is required" }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Shift" name="stock_opname_shift_id" rules={[{ required: true, message: "Shift is required" }]}>
                <Select
                  showSearch={{ filterOption: false, onSearch: handleSearchShift }}
                  allowClear
                  placeholder="Choose Shift"
                  options={shiftOptions}
                  loading={shiftLoading}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Card
            title="Products"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  const items = form.getFieldValue("items") ?? [];
                  form.setFieldValue("items", [...items, { product_id: undefined, stock: 0 }]);
                }}
              >
                Add Product
              </Button>
            }
          >
            <Form.List name="items">
              {(fields, { remove }) => (
                <Space orientation="vertical" style={{ width: "100%" }}>
                  {fields.map((field) => (
                    <Row key={field.key} gutter={16} align="middle">
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="Product"
                          name={[field.name, "product_id"]}
                          rules={[
                            { required: true, message: "Product is required" },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (value === undefined) return Promise.resolve();
                                const items: Item[] = getFieldValue("items") ?? [];
                                const duplicate = items.filter((item) => item.product_id === value).length;
                                if (duplicate > 1) return Promise.reject(new Error("Duplicate product"));
                                return Promise.resolve();
                              },
                            }),
                          ]}
                        >
                          <Select
                            allowClear
                            showSearch={{ filterOption: false, onSearch: handleSearchProduct }}
                            placeholder="Choose Product"
                            options={productOptions}
                            loading={productLoading}
                            style={{ width: "100%" }}
                            onChange={async () => await form.validateFields(["items"])}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item label="Stock" name={[field.name, "counted_qty"]} rules={[{ required: true, message: "Stock is required" }]}>
                          <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={4}>
                        <Form.Item label=" ">
                          <Button danger icon={<DeleteOutlined />} disabled={fields.length === 1} onClick={() => remove(field.name)}>
                            Remove
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                </Space>
              )}
            </Form.List>
          </Card>
          <Row justify="end" style={{ marginTop: 16 }}>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
              Save
            </Button>
          </Row>
        </Form>
      </div>
    </div>
  );
}
