import { Button, Divider, Form, Input } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { callLogin } from "@/config/api";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUserLoginInfo } from "@/redux/slice/accountSlide";
import styles from "@/styles/auth.module.scss";
import { notify } from "@/components/common/notify";

const LoginPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const callback = params.get("callback");

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);

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

            // Điều hướng sau đăng nhập
            if (callback && callback.startsWith("/")) {
                navigate(callback, { replace: true });
            } else {
                navigate("/", { replace: true });
            }
        } catch (error: any) {
            const message =
                error?.response?.data?.message || error?.message || "Lỗi kết nối đến máy chủ. Vui lòng thử lại.";
            notify.error(message);
        } finally {
            setIsSubmit(false);
        }
    };

    const onFinish = (values: { username: string; password: string }) => {
        handleLogin(values.username, values.password);
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

                        <Form name="login-form" onFinish={onFinish} autoComplete="off" layout="vertical">
                            <Form.Item
                                label="Email"
                                name="username"
                                rules={[{ required: true, message: "Email không được để trống!" }]}
                            >
                                <Input placeholder="Nhập email của bạn" />
                            </Form.Item>

                            <Form.Item
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
                                <p>
                                    <span>Bạn quên mật khẩu hoặc chưa kích hoạt tài khoản?</span>
                                    <br />
                                    <Link to="/forgot-password">Nhận mã xác nhận qua email</Link>
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
