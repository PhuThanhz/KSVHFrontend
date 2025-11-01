import { useEffect, useState } from "react";
import {
    Form,
    Input,
    Select,
    Button,
    Upload,
    Modal,
    message,
    Card,
    Typography,
    Image,
    Row,
    Col,
    Spin,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { v4 as uuidv4 } from "uuid";
import {
    callUploadMultipleFiles,
    callFetchDevice,
    callFetchIssue,
    callGetCurrentUser,
} from "@/config/api";
import { useQuery } from "@tanstack/react-query";
import { useCreateInternalMaintenanceRequestMutation } from "@/hooks/useMaintenanceRequests";
import type {
    IReqMaintenanceRequestInternalDTO,
    PriorityLevel,
    MaintenanceType,
} from "@/types/backend";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

interface ModalCreateMaintenanceProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const ModalCreateMaintenance = ({
    open,
    onClose,
    onSuccess,
}: ModalCreateMaintenanceProps) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [loadingUpload, setLoadingUpload] = useState(false);

    const { mutateAsync: createRequest, isPending } =
        useCreateInternalMaintenanceRequestMutation();

    // ===== FETCH DATA =====
    const { data: devices } = useQuery({
        queryKey: ["devices"],
        queryFn: async () => {
            const res = await callFetchDevice("page=1&pageSize=100");
            return res.data?.result ?? [];
        },
    });

    const { data: issues } = useQuery({
        queryKey: ["issues"],
        queryFn: async () => {
            const res = await callFetchIssue("page=1&pageSize=100");
            return res.data?.result ?? [];
        },
    });

    const { data: currentUser, isLoading: loadingUser } = useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const res = await callGetCurrentUser(); // API trả về thông tin user + employee
            return res.data;
        },
    });

    // ===== UPLOAD HANDLER =====
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj as File);
            reader.onload = () => {
                setPreviewImage(reader.result as string);
                setPreviewTitle(file.name);
                setPreviewOpen(true);
            };
        } else {
            setPreviewImage(file.url || (file.preview as string));
            setPreviewTitle(file.name);
            setPreviewOpen(true);
        }
    };

    const uploadProps: UploadProps = {
        listType: "picture-card",
        multiple: true,
        fileList,
        maxCount: 3,
        accept: ".jpg,.jpeg,.png,.webp",
        customRequest: async ({ file, onSuccess, onError }) => {
            try {
                setLoadingUpload(true);
                const res = await callUploadMultipleFiles(
                    [file as File],
                    "MAINTENANCE_REQUEST"
                );
                if (res?.data && Array.isArray(res.data)) {
                    const newFiles: UploadFile[] = res.data.map((f) => ({
                        uid: uuidv4(),
                        name: f.fileName,
                        status: "done" as const,
                        url: `${import.meta.env.VITE_BACKEND_URL}/storage/MAINTENANCE_REQUEST/${f.fileName}`,
                    }));
                    setFileList((prev) => [...prev, ...newFiles].slice(0, 3));
                    onSuccess?.("ok");
                } else throw new Error("Upload thất bại");
            } catch (err: any) {
                message.error(err?.message || "Không thể upload ảnh");
                onError?.(err);
            } finally {
                setLoadingUpload(false);
            }
        },
        onRemove: (file) =>
            setFileList((prev) => prev.filter((f) => f.uid !== file.uid)),
        onPreview: handlePreview,
    };

    // ===== SUBMIT FORM =====
    const handleSubmit = async (values: IReqMaintenanceRequestInternalDTO) => {
        const images = fileList.map((f) => f.name || "").slice(0, 3);
        const [attachment1, attachment2, attachment3] = images;

        const payload: IReqMaintenanceRequestInternalDTO = {
            ...values,
            attachment1,
            attachment2,
            attachment3,
        };

        await createRequest(payload);
        message.success("Tạo phiếu bảo trì nội bộ thành công");
        form.resetFields();
        setFileList([]);
        onSuccess?.();
        onClose();
    };

    useEffect(() => {
        if (currentUser?.employee && open) {
            const emp = currentUser.employee;
            form.setFieldsValue({
                fullName: currentUser.name,
                employeeCode: emp.employeeCode,
                phone: emp.phone,
                position: emp.position?.name || "-",
                companyName: emp.company?.name || "-",
                departmentName: emp.department?.name || "-",
            });
        }
    }, [currentUser, open, form]);

    return (
        <Modal
            open={open}
            title="Tạo Phiếu Bảo Trì (Nội bộ)"
            onCancel={onClose}
            footer={null}
            width={700}
            destroyOnClose
        >
            <Card bordered={false}>
                {loadingUser ? (
                    <Spin size="large" />
                ) : (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            priorityLevel: "TRUNG_BINH" as PriorityLevel,
                            maintenanceType: "DOT_XUAT" as MaintenanceType,
                        }}
                    >
                        <Title level={5} style={{ color: "#1f3b88" }}>
                            Thông tin cá nhân
                        </Title>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Họ và tên" name="fullName">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Mã nhân viên"
                                    name="employeeCode"
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Số điện thoại" name="phone">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Chức vụ" name="position">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Công ty" name="companyName">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Phòng ban" name="departmentName">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Title level={5} style={{ color: "#1f3b88" }}>
                            Thông tin phiếu bảo trì
                        </Title>

                        <Form.Item
                            label="Thiết bị"
                            name="deviceCode"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn thiết bị",
                                },
                            ]}
                        >
                            <Select placeholder="Chọn thiết bị">
                                {devices?.map((item: any) => (
                                    <Option
                                        key={item.deviceCode}
                                        value={item.deviceCode}
                                    >
                                        {item.deviceName} ({item.deviceCode})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Sự cố"
                            name="issueId"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn sự cố",
                                },
                            ]}
                        >
                            <Select placeholder="Chọn sự cố">
                                {issues?.map((item: any) => (
                                    <Option key={item.id} value={item.id}>
                                        {item.issueName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Địa điểm cụ thể" name="locationDetail">
                            <TextArea
                                rows={2}
                                placeholder="Nhập địa điểm cụ thể của thiết bị"
                            />
                        </Form.Item>

                        <Form.Item label="Ghi chú" name="note">
                            <TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Mức độ ưu tiên"
                                    name="priorityLevel"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Chọn mức độ ưu tiên",
                                        },
                                    ]}
                                >
                                    <Select>
                                        <Option value="KHAN_CAP">Khẩn cấp</Option>
                                        <Option value="CAO">Cao</Option>
                                        <Option value="TRUNG_BINH">
                                            Trung bình
                                        </Option>
                                        <Option value="THAP">Thấp</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Loại bảo trì"
                                    name="maintenanceType"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Chọn loại bảo trì",
                                        },
                                    ]}
                                >
                                    <Select>
                                        <Option value="DOT_XUAT">Đột xuất</Option>
                                        <Option value="DINH_KY">Định kỳ</Option>
                                        <Option value="SUA_CHUA">Sửa chữa</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Tệp đính kèm (tối đa 3)">
                            <Upload {...uploadProps}>
                                {fileList.length >= 3 ? null : (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>
                                            Tải lên
                                        </div>
                                    </div>
                                )}
                            </Upload>

                            <Modal
                                open={previewOpen}
                                title={previewTitle}
                                footer={null}
                                onCancel={() => setPreviewOpen(false)}
                            >
                                <Image
                                    alt="preview"
                                    src={previewImage}
                                    width="100%"
                                />
                            </Modal>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                loading={isPending || loadingUpload}
                            >
                                {isPending ? "Đang tạo..." : "Tạo phiếu"}
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Card>
        </Modal>
    );
};

export default ModalCreateMaintenance;
