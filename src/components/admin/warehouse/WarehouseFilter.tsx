import { Button, Col, Form, Input, Row } from "antd";

interface IProps {
    onFilter: (values: any) => void;
}

const WarehouseFilter = ({ onFilter }: IProps) => {
    const [form] = Form.useForm();

    const handleSubmit = () => {
        const values = form.getFieldsValue();
        onFilter(values);
    };

    const handleReset = () => {
        form.resetFields();
        onFilter({});
    };

    return (
        <Form form={form} layout="vertical">
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12} lg={6}>
                    <Form.Item name="warehouseName" label="Tên kho">
                        <Input placeholder="Nhập tên kho..." allowClear />
                    </Form.Item>
                </Col>

                <Col
                    xs={24}
                    md={12}
                    lg={6}
                    style={{ display: "flex", gap: 8, alignItems: "end" }}
                >
                    <Button type="primary" onClick={handleSubmit}>
                        Tìm kiếm
                    </Button>
                    <Button onClick={handleReset}>Làm mới</Button>
                </Col>
            </Row>
        </Form>
    );
};

export default WarehouseFilter;
