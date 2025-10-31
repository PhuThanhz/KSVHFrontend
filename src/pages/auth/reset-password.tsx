import { Button, Form, Input } from "antd";
import { callConfirmResetPassword } from "@/config/api";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "styles/auth.module.scss";
import { notify } from "@/components/common/notify";

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

            // ✅ Kiểm tra phản hồi backend
            if (res.statusCode === 200 && res.data?.success) {
                notify.success(res.data?.message || "Đặt lại mật khẩu thành công!");
                navigate("/login");
            } else {
                notify.error(res.message || "Mã xác nhận không đúng hoặc đã hết hạn.");
            }
        } catch (err: any) {
            // ✅ Bắt lỗi exception (400, 500,…)
            const msg =
                err?.response?.data?.message ||
                "Không thể đặt lại mật khẩu, vui lòng thử lại.";
            notify.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles["login-page"]}>
            <main className={styles.main}>
                <div className={styles.container}>
                    <section className={styles.wrapper}>
                        <h2 className={styles.text}>Đặt lại mật khẩu</h2>
                        <Form onFinish={onFinish}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Mã xác nhận"
                                name="code"
                                rules={[{ required: true, message: "Vui lòng nhập mã xác nhận!" }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Mật khẩu mới"
                                name="newPassword"
                                rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Đặt lại mật khẩu
                                </Button>
                            </Form.Item>

                            <p>
                                <Link to="/login">Quay lại đăng nhập</Link>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default ResetPasswordPage;
