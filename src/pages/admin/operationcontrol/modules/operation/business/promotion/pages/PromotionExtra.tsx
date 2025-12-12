import { Breadcrumb, Card, Typography, Row, Col, Button, Form, Input } from "antd";

const { Title } = Typography;

const PromotionExtra = () => {
  return (
    <div className="p-4">
      <Breadcrumb
        items={[
          { title: "Quản lý kiểm soát vận hành" },
          { title: "Kiểm soát vận hành" },
          { title: "Vận hành – Kinh doanh" },
          { title: "Chương trình khuyến mãi" },
          { title: "Form bổ sung" },
        ]}
        className="mb-4"
      />

      <Title level={4}>Form bổ sung – Chương trình khuyến mãi</Title>

      <Card className="mt-3" bordered={false}>
        <Form layout="vertical">
          <Form.Item label="Nội dung bổ sung">
            <Input.TextArea rows={4} placeholder="Nhập nội dung" />
          </Form.Item>
          <Button type="primary">Thêm thông tin</Button>
        </Form>
      </Card>
    </div>
  );
};

export default PromotionExtra;
