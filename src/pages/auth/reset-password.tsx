import { Button, Form, Input, Card, Row, Col, Typography, Space, Divider } from "antd";
import { callConfirmResetPassword } from "@/config/api";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { notify } from "@/components/common/notification/notify";

const { Title, Text } = Typography;

const ResetPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const email = params.get("email") || "";

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            const res = await callConfirmResetPassword({
                email,
                code: values.code,
                newPassword: values.newPassword,
            });

            if (res.statusCode === 200 && res.data?.success) {
                notify.success(res.data?.message || "Đặt lại mật khẩu thành công!");
                navigate("/login");
            } else {
                notify.error(res.message || "Mã xác nhận không đúng hoặc đã hết hạn.");
            }
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                "Không thể đặt lại mật khẩu, vui lòng thử lại.";
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
                            Đặt lại mật khẩu
                        </Title>
                        <Divider />

                        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
                            <Form.Item
                                label="Mã xác nhận"
                                name="code"
                                rules={[
                                    { required: true, message: "Vui lòng nhập mã xác nhận!" },
                                ]}
                            >
                                <Input placeholder="Nhập mã xác nhận" size="large" />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu mới"
                                name="newPassword"
                                rules={[
                                    { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                                    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                                ]}
                            >
                                <Input.Password placeholder="Nhập mật khẩu mới" size="large" />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    size="large"
                                    block
                                >
                                    Đặt lại mật khẩu
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

export default ResetPasswordPage;
