import { Button, Form, Input, Card, Row, Col, Typography, Space, Divider } from "antd";
import { callRequestPasswordCode } from "@/config/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notify } from "@/components/common/notification/notify";

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            const res = await callRequestPasswordCode({ email: values.email });

            if (res.statusCode === 200 && res.data?.success) {
                notify.success(res.data?.message || "Mã xác nhận đã được gửi đến email của bạn");
                navigate("/reset-password?email=" + values.email);
            } else {
                notify.error(res.message || "Không thể gửi mã, vui lòng thử lại.");
            }
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                "Đã xảy ra lỗi, vui lòng thử lại sau.";
            notify.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row
            justify="center"
            align="middle"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f0f2f5 0%, #e6f7ff 100%)",
                padding: 24,
            }}
        >
            <Col xs={24} sm={18} md={12} lg={8} xl={6}>
                <Card
                    bordered={false}
                    style={{
                        borderRadius: 16,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        padding: "16px 24px",
                    }}
                >
                    <Space direction="vertical" style={{ width: "100%" }} size="middle">
                        <Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>
                            Xác nhận qua email
                        </Title>
                        <Divider />

                        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: "Vui lòng nhập email!" },
                                    { type: "email", message: "Email không hợp lệ!" },
                                ]}
                            >
                                <Input placeholder="Nhập địa chỉ email của bạn" size="large" />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    loading={loading}
                                    block
                                >
                                    Gửi mã xác nhận
                                </Button>
                            </Form.Item>
                        </Form>

                        <Divider />

                        <div style={{ textAlign: "center" }}>
                            <Text>Đã nhớ mật khẩu?</Text>
                            <br />
                            <Link to="/login">Quay lại đăng nhập</Link>
                        </div>
                    </Space>
                </Card>
            </Col>
        </Row>
    );
};

export default ForgotPasswordPage;
