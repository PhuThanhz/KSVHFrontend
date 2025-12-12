import { Breadcrumb, Card, Typography, Row, Col, Button, Form, Input } from "antd";

const { Title } = Typography;

const PromotionMain = () => {
  return (
    <div className="p-4">
      <Breadcrumb
        items={[
          { title: "Quản lý kiểm soát vận hành" },
          { title: "Kiểm soát vận hành" },
          { title: "Vận hành – Kinh doanh" },
          { title: "Chương trình khuyến mãi" },
          { title: "Form chính" },
        ]}
        className="mb-4"
      />

      <Title level={4}>Form chính – Chương trình khuyến mãi</Title>

      <Card className="mt-3" bordered={false}>
        <Form layout="vertical">
          <Form.Item label="Tên chương trình">
            <Input placeholder="Nhập tên chương trình" />
          </Form.Item>
          <Form.Item label="Mô tả">
            <Input.TextArea rows={4} placeholder="Nhập mô tả" />
          </Form.Item>
          <Button type="primary">Lưu chương trình</Button>
        </Form>
      </Card>
    </div>
  );
};

export default PromotionMain;
