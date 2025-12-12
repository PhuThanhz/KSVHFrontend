import React, { useEffect } from "react";
import { Card, Row, Col, Form, Input, Typography, DatePicker } from "antd";
import dayjs from "dayjs";

const { Title } = Typography;

interface ChecklistHeaderProps {
  restaurant: {
    name: string;
    location: string;
  };
  form: any;
  isLocked: boolean;
}

const ChecklistHeader: React.FC<ChecklistHeaderProps> = ({
  restaurant,
  form,
  isLocked,
}) => {
  useEffect(() => {
    form.setFieldsValue({
      restaurantName: restaurant.name,
    });
  }, [restaurant]);

  const fields = [
    {
      label: "Nhà hàng",
      name: "restaurantName",
      disabled: true,
      span: { xs: 24, sm: 12, md: 6 },
      render: () => <Input disabled />,
    },
    {
      label: "Lần kiểm tra",
      name: "round",
      placeholder: "VD: 03",
      span: { xs: 24, sm: 12, md: 4 },
      render: (locked: boolean) => (
        <Input placeholder="VD: 03" disabled={locked} />
      ),
    },
    {
      label: "Ngày kiểm tra",
      name: "date",
      span: { xs: 24, sm: 12, md: 5 },

      // ✨✨ DÙNG DATE PICKER CHO XỊN ✨✨
      render: (locked: boolean) => (
        <DatePicker
          style={{ width: "100%" }}
          format="DD/MM/YYYY"
          placeholder="Chọn ngày kiểm tra"
          disabled={locked}
        />
      ),
    },
    {
      label: "Người kiểm tra",
      name: "inspector",
      placeholder: "Họ tên KSVH",
      span: { xs: 24, sm: 12, md: 5 },
      render: (locked: boolean) => (
        <Input placeholder="Họ tên KSVH" disabled={locked} />
      ),
    },
    {
      label: "Quản lý NHK",
      name: "manager",
      placeholder: "Họ tên QL",
      span: { xs: 24, sm: 12, md: 4 },
      render: (locked: boolean) => (
        <Input placeholder="Họ tên QL" disabled={locked} />
      ),
    },
  ];

  return (
    <Card style={{ marginBottom: 24 }}>
      <Title level={5}>Thông tin đánh giá</Title>

      <Form form={form} layout="vertical">
        <Row gutter={16}>
          {fields.map((f) => (
            <Col key={f.name} {...f.span}>
              <Form.Item label={f.label} name={f.name}>
                {f.render(f.disabled ?? isLocked)}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </Card>
  );
};

export default ChecklistHeader;
