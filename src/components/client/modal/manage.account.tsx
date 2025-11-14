import { useState } from "react";
import { Modal, Form, Input, Button, Upload, Avatar, message } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { isMobile } from "react-device-detect";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { callUploadSingleFile, callUpdateProfile } from "@/config/api";
import { updateUserProfile } from "@/redux/slice/accountSlide";
import type { IReqUpdateProfileDTO } from "@/types/backend";

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}

const UserUpdateInfo = ({ onClose }: { onClose: (v: boolean) => void }) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.account.user);
    const [form] = Form.useForm();

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const [submitting, setSubmitting] = useState(false);

    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const currentAvatar = user?.avatar
        ? `${backendURL}/storage/avatar/${user.avatar}`
        : "";

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
                avatar: finalAvatar
            };

            const res = await callUpdateProfile(payload);

            if (res?.data?.user) {
                dispatch(updateUserProfile({
                    ...res.data.user,
                    address: payload.address,
                }));

                if (previewUrl) URL.revokeObjectURL(previewUrl);

                message.success("Cập nhật thông tin thành công!");
                onClose(false);
            }
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Đã xảy ra lỗi!";
            message.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const displayAvatar = previewUrl || currentAvatar;

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
                name: user?.name,
                email: user?.email,
                address: user?.address
            }}
            className="pt-4"
        >
            <div style={{ textAlign: "center", marginBottom: 20 }}>
                <Avatar
                    size={100}
                    src={displayAvatar || undefined}
                    icon={<UserOutlined />}
                />

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
                        <br />
                    </div>
                )}
            </div>

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
    );
};

const ManageAccount = ({ open, onClose }: IProps) => {
    return (
        <Modal
            title="Quản lý tài khoản"
            open={open}
            onCancel={() => onClose(false)}
            footer={null}
            destroyOnClose
            maskClosable={false}
            width={isMobile ? "100%" : "600px"}
            className="rounded-lg"
        >
            <div className="min-h-[250px]">
                <UserUpdateInfo onClose={onClose} />
            </div>
        </Modal>
    );
};

export default ManageAccount;
