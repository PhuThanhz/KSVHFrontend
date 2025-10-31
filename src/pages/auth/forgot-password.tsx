import { Button, Form, Input } from "antd";
import { callRequestPasswordCode } from "@/config/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "styles/auth.module.scss";
import { notify } from "@/components/common/notify";

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
        <div className={styles["login-page"]}>
            <main className={styles.main}>
                <div className={styles.container}>
                    <section className={styles.wrapper}>
                        <h2 className={styles.text}>Xác nhận qua email</h2>
                        <Form onFinish={onFinish}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Gửi mã xác nhận
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

export default ForgotPasswordPage;
