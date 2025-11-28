import { Button, Card, Divider, Form, Input, Space, Typography, Row, Col } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { callLogin } from "@/config/api";
import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setUserLoginInfo } from "@/redux/slice/accountSlide";
import { notify } from "@/components/common/notify";
import { PATHS } from "@/constants/paths";
import { getRedirectPathByRole } from "@/constants/roleRedirects";

const { Title, Text } = Typography;

const LoginPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const callback = params.get("callback");

    const handleLogin = async (username: string, password: string) => {
        setIsSubmit(true);
        try {
            const res = await callLogin(username, password);
            const { access_token, user } = res?.data || {};

            if (!access_token) {
                notify.error("Không nhận được access_token từ server.");
                return;
            }

            if (!user) {
                notify.error("Không nhận được thông tin người dùng.");
                return;
            }

            localStorage.setItem("access_token", access_token);
            dispatch(setUserLoginInfo(user));
            notify.success("Đăng nhập tài khoản thành công!");

            if (callback && callback.startsWith("/")) {
                navigate(callback, { replace: true });
            } else {
                const redirectPath = getRedirectPathByRole(user?.role?.name);
                navigate(redirectPath, { replace: true });
            }
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Lỗi kết nối đến máy chủ. Vui lòng thử lại.";
            notify.error(message);
        } finally {
            setIsSubmit(false);
        }
    };

    const onFinish = (values: { username: string; password: string }) => {
        handleLogin(values.username, values.password);
    };

    return (
        <Row
            justify="center"
            align="middle"
            style={{ minHeight: "100vh", background: "#f0f2f5", padding: "20px" }}
        >
            <Col xs={22} sm={18} md={12} lg={8} xl={6}>
                <Card>
                    <Space direction="vertical" size="large" style={{ width: "100%" }}>
                        <div style={{ textAlign: "center" }}>
                            <Title level={2}>Đăng nhập</Title>
                        </div>

                        <Divider />

                        <Form
                            name="login-form"
                            onFinish={onFinish}
                            autoComplete="off"
                            layout="vertical"
                            size="large"
                        >
                            <Form.Item
                                label="Email"
                                name="username"
                                rules={[
                                    { required: true, message: "Email không được để trống!" },
                                    { type: "email", message: "Email không hợp lệ!" }
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="Nhập email của bạn"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: "Mật khẩu không được để trống!" }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Nhập mật khẩu"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isSubmit}
                                    block
                                    size="large"
                                >
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                        </Form>

                        <Divider />

                        <div style={{ textAlign: "center" }}>
                            <Text>Bạn quên mật khẩu hoặc chưa kích hoạt tài khoản?</Text>
                            <br />
                            <Link to={PATHS.FORGOT_PASSWORD}>Nhận mã xác nhận qua email</Link>
                        </div>
                    </Space>
                </Card>
            </Col>
        </Row>
    );
};

export default LoginPage;