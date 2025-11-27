import React, { useState } from "react";
import {
    Card,
    Avatar,
    Typography,
    Button,
    Space,
    Divider,
    message,
    Modal,
    Form,
    Input,
    Upload,
} from "antd";
import {
    UserOutlined,
    LogoutOutlined,
    EditOutlined,
    UploadOutlined,
    MailOutlined,
    IdcardOutlined,
    PhoneOutlined,
    ToolOutlined,
} from "@ant-design/icons";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
    callLogout,
    callUploadSingleFile,
    callUpdateProfile,
} from "@/config/api";
import {
    setLogoutAction,
    updateUserProfile,
} from "@/redux/slice/accountSlide";
import { PATHS } from "@/constants/paths";
import type { IReqUpdateProfileDTO } from "@/types/backend";

const { Text, Title } = Typography;

const TechnicianProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user, employee } = useAppSelector((state) => state.account);
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const avatarSrc = user?.avatar
        ? `${backendURL}/storage/AVATAR/${user.avatar}`
        : undefined;

    const [openModal, setOpenModal] = useState(false);
    const [form] = Form.useForm();
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);

    /** ========== Logout ========== */
    const handleLogout = async () => {
        try {
            await callLogout();
        } catch {
            // ignore
        } finally {
            localStorage.removeItem("access_token");
            sessionStorage.clear();
            dispatch(setLogoutAction());
            message.success("Đăng xuất thành công");
            navigate(PATHS.HOME, { replace: true });
        }
    };

    /** ========== Upload avatar ========== */
    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith("image/")) {
            message.error("Vui lòng chọn file ảnh!");
            return false;
        }
        if (file.size > 5 * 1024 * 1024) {
            message.error("Kích thước file không vượt quá 5MB!");
            return false;
        }

        setAvatarFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return false;
    };

    /** ========== Gọi API cập nhật hồ sơ ========== */
    const handleSubmit = async (values: any) => {
        setSubmitting(true);
        try {
            let finalAvatar = user?.avatar || "";
            if (avatarFile) {
                const uploadRes = await callUploadSingleFile(avatarFile, "avatar");
                if (uploadRes?.data?.length) {
                    finalAvatar = uploadRes.data[0].fileName;
                }
            }

            const payload: IReqUpdateProfileDTO = {
                name: values.name,
                address: values.address || "",
                avatar: finalAvatar,
            };

            const res = await callUpdateProfile(payload);

            if (res?.data?.user) {
                dispatch(
                    updateUserProfile({
                        ...res.data.user,
                        address: payload.address,
                    })
                );

                if (previewUrl) URL.revokeObjectURL(previewUrl);

                message.success("Cập nhật thông tin thành công!");
                setOpenModal(false);
            }
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Đã xảy ra lỗi!";
            message.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const displayAvatar = previewUrl || avatarSrc;

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex justify-center py-10 px-4 pb-28">
            <Card className="w-full max-w-md rounded-xl shadow-md p-6 bg-white">
                {/* ====== Header thông tin ====== */}
                <div className="flex flex-col items-center text-center">
                    <Avatar
                        size={100}
                        src={avatarSrc}
                        icon={!avatarSrc && <UserOutlined />}
                        className={`shadow-md mb-3 ${avatarSrc
                            ? ""
                            : "bg-gradient-to-br from-pink-400 to-orange-400 text-white"
                            }`}
                    >
                        {!avatarSrc && user?.name?.charAt(0)?.toUpperCase()}
                    </Avatar>

                    <Title level={4} style={{ marginBottom: 4 }}>
                        {user?.name || employee?.fullName || "Kỹ thuật viên"}
                    </Title>
                    <Text type="secondary">Kỹ thuật viên bảo trì</Text>
                </div>

                <Divider />

                {/* ====== Thông tin chi tiết ====== */}
                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-700">
                            <MailOutlined />
                            <Text>Email:</Text>
                        </div>
                        <Text strong>{user?.email || employee?.email || "Chưa cập nhật"}</Text>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-700">
                            <IdcardOutlined />
                            <Text>Mã nhân viên:</Text>
                        </div>
                        <Text strong>{employee?.employeeCode || "Không có"}</Text>
                    </div>

                    {employee?.phone && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-700">
                                <PhoneOutlined />
                                <Text>Số điện thoại:</Text>
                            </div>
                            <Text strong>{employee.phone}</Text>
                        </div>
                    )}

                    {employee?.positionName && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-700">
                                <ToolOutlined />
                                <Text>Chức vụ:</Text>
                            </div>
                            <Text strong>{employee.positionName}</Text>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-700">
                            <UserOutlined />
                            <Text>Địa chỉ:</Text>
                        </div>
                        <Text strong>{user?.address || "Chưa cập nhật"}</Text>
                    </div>
                </Space>

                <Divider />

                <Space className="w-full mt-4 flex justify-between">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => setOpenModal(true)}
                    >
                        Cập nhật thông tin
                    </Button>

                    <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
                        Đăng xuất
                    </Button>
                </Space>
            </Card>

            {/* ===== Modal cập nhật hồ sơ ===== */}
            <Modal
                title="Cập nhật thông tin cá nhân"
                open={openModal}
                onCancel={() => setOpenModal(false)}
                footer={null}
                destroyOnClose
                maskClosable={false}
                width={isMobile ? "100%" : 600}
                className="rounded-lg"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        name: user?.name,
                        email: user?.email,
                        address: user?.address,
                        employeeCode: employee?.employeeCode,
                    }}
                    className="pt-4"
                >
                    {/* Avatar */}
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <Avatar size={100} src={displayAvatar || undefined} icon={<UserOutlined />} />
                        <div className="mt-2">
                            <Upload
                                showUploadList={false}
                                beforeUpload={handleFileSelect}
                                accept="image/*"
                                multiple={false}
                            >
                                <Button
                                    icon={<UploadOutlined />}
                                    size="small"
                                    disabled={submitting}
                                >
                                    Chọn Avatar
                                </Button>
                            </Upload>
                        </div>

                        {avatarFile && (
                            <div className="mt-1 text-xs text-gray-500">
                                Đã chọn: {avatarFile.name} ({(avatarFile.size / 1024).toFixed(1)}KB)
                            </div>
                        )}
                    </div>

                    {/* Form fields */}
                    <Form.Item
                        label="Họ và tên"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                    >
                        <Input placeholder="Nhập họ và tên" disabled={submitting} />
                    </Form.Item>

                    <Form.Item label="Email" name="email">
                        <Input disabled />
                    </Form.Item>

                    <Form.Item label="Mã nhân viên" name="employeeCode">
                        <Input disabled />
                    </Form.Item>

                    <Form.Item label="Địa chỉ" name="address">
                        <Input placeholder="Nhập địa chỉ" disabled={submitting} />
                    </Form.Item>

                    <div className="text-right">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={submitting}
                            className="bg-blue-500 hover:bg-blue-600"
                        >
                            Lưu thay đổi
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default TechnicianProfilePage;
