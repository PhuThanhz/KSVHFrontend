import { Button, Divider, Form, Input } from "antd";
import { Link, useLocation } from "react-router-dom";
import { callLogin } from "@/config/api";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserLoginInfo } from "@/redux/slice/accountSlide";
import styles from "@/styles/auth.module.scss";
import { useAppSelector } from "@/redux/hooks";
import { notify } from "@/components/common/notify";

const LoginPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useDispatch();
    const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const callback = params.get("callback");

    useEffect(() => {
        if (isAuthenticated) {
            window.location.href = "/";
        }
    }, [isAuthenticated]);

    const onFinish = async (values: { username: string; password: string }) => {
        const { username, password } = values;
        setIsSubmit(true);

        try {
            const res = await callLogin(username, password);
            setIsSubmit(false);

            if (res?.data) {
                const { access_token, user } = res.data;

                // Kiểm tra token hợp lệ trước khi lưu
                if (access_token) {
                    localStorage.setItem("access_token", access_token);
                } else {
                    notify.error("Không nhận được access_token từ server.");
                    return;
                }

                // Kiểm tra user
                if (user) {
                    dispatch(setUserLoginInfo(user));
                } else {
                    notify.error("Không nhận được thông tin người dùng.");
                    return;
                }

                notify.success("Đăng nhập tài khoản thành công!");
                window.location.href = callback || "/";
            } else {
                const message =
                    Array.isArray(res?.message)
                        ? res.message[0]
                        : res?.message || "Đăng nhập thất bại!";
                notify.error(message);
            }
        } catch (error: any) {
            setIsSubmit(false);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Lỗi kết nối đến máy chủ. Vui lòng thử lại.";
            notify.error(message);
        }
    };

    return (
        <div className={styles["login-page"]}>
            <main className={styles.main}>
                <div className={styles.container}>
                    <section className={styles.wrapper}>
                        <div className={styles.heading}>
                            <h2 className={`${styles.text} ${styles["text-large"]}`}>Đăng nhập</h2>
                            <Divider />
                        </div>

                        <Form name="login-form" onFinish={onFinish} autoComplete="off">
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Email"
                                name="username"
                                rules={[{ required: true, message: "Email không được để trống!" }]}
                            >
                                <Input placeholder="Nhập email của bạn" />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: "Mật khẩu không được để trống!" }]}
                            >
                                <Input.Password placeholder="Nhập mật khẩu" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isSubmit} block>
                                    Đăng nhập
                                </Button>
                            </Form.Item>

                            <Divider />
                            <div style={{ textAlign: "center" }}>
                                <p className="text text-normal">
                                    <span>Bạn quên mật khẩu hoặc chưa kích hoạt tài khoản?</span>
                                    <br />
                                    <Link to="/forgot-password">
                                        Nhận mã xác nhận qua email
                                    </Link>
                                </p>
                            </div>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
