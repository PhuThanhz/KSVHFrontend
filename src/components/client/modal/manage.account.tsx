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
    const [avatar, setAvatar] = useState(user?.avatar || "");
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const handleUpload = async ({ file }: any) => {
        try {
            setUploading(true);
            const res = await callUploadSingleFile(file, "avatar");
            if (res?.data?.length) {
                setAvatar(res.data[0].fileName);
                message.success("Tải ảnh lên thành công!");
            }
        } catch {
            message.error("Tải ảnh thất bại!");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (values: any) => {
        setSubmitting(true);
        const payload: IReqUpdateProfileDTO = {
            name: values.name,
            address: values.address,
            avatar,
        };

        try {
            const res = await callUpdateProfile(payload);
            if (res?.data?.user) {
                dispatch(updateUserProfile({
                    ...res.data.user,
                    address: payload.address,
                }));
                message.success("Cập nhật thông tin thành công!");
                onClose(false);
            }
        } catch (err) {
            message.error("Đã xảy ra lỗi khi cập nhật!");
        } finally {
            setSubmitting(false);
        }
    };

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
                    src={avatar ? `${backendURL}/storage/avatar/${avatar}` : undefined}
                    icon={<UserOutlined />}
                />
                <div className="mt-2">
                    <Upload
                        showUploadList={false}
                        customRequest={handleUpload}
                        accept="image/*"
                    >
                        <Button
                            icon={<UploadOutlined />}
                            size="small"
                            loading={uploading}
                        >
                            Upload Avatar
                        </Button>
                    </Upload>
                </div>
            </div>

            <Form.Item
                label="Họ và tên"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            >
                <Input placeholder="Nhập họ và tên" />
            </Form.Item>

            <Form.Item label="Email" name="email">
                <Input disabled />
            </Form.Item>

            <Form.Item label="Địa chỉ" name="address">
                <Input placeholder="Nhập địa chỉ" />
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
            maskClosable={false}
            footer={null}
            destroyOnClose
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
