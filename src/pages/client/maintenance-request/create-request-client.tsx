import { useState } from "react";
import {
    Form,
    Input,
    Select,
    Button,
    Upload,
    message,
    Card,
    Typography,
    Image,
    Modal,
} from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { useCreateCustomerMaintenanceRequestMutation } from "@/hooks/useMaintenanceRequests";
import type {
    IReqMaintenanceRequestCustomerDTO,
    PriorityLevel,
    MaintenanceType,
} from "@/types/backend";
import {
    callUploadMultipleFiles,
    callFetchMyPurchaseHistory,
    callFetchIssue,
} from "@/config/api";
import { useQuery } from "@tanstack/react-query";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

interface CreateMaintenanceRequestClientPageProps {
    onSuccess?: () => void;
}

const CreateMaintenanceRequestClientPage = ({ onSuccess }: CreateMaintenanceRequestClientPageProps) => {
    const [form] = Form.useForm();

    // Upload states
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");

    const { mutateAsync: createRequest, isPending } =
        useCreateCustomerMaintenanceRequestMutation();

    /** ========================= FETCH DỮ LIỆU THIẾT BỊ & SỰ CỐ ========================= */
    const { data: deviceData } = useQuery({
        queryKey: ["my-devices"],
        queryFn: async () => {
            const res = await callFetchMyPurchaseHistory();
            return res.data?.result?.map((r) => r.device) ?? [];
        },
    });

    const { data: issueData } = useQuery({
        queryKey: ["issues"],
        queryFn: async () => {
            const res = await callFetchIssue("page=1&pageSize=100");
            return res.data?.result ?? [];
        },
    });

    /** ========================= XỬ LÝ UPLOAD FILE ========================= */
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
                const res = await callUploadMultipleFiles([file as File], "maintenance_request");
                if (res?.data && Array.isArray(res.data)) {
                    const newFiles: UploadFile[] = res.data.map((f) => ({
                        uid: uuidv4(),
                        name: f.fileName,
                        status: "done" as const,
                        url: `${import.meta.env.VITE_BACKEND_URL}/storage/maintenance_request/${f.fileName}`,
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
        onRemove: (file) => setFileList((prev) => prev.filter((f) => f.uid !== file.uid)),
        onPreview: handlePreview,
    };

    /** ========================= SUBMIT FORM ========================= */
    const handleSubmit = async (values: IReqMaintenanceRequestCustomerDTO) => {
        const images = fileList.map((f) => f.name || "").slice(0, 3);
        const [attachment1, attachment2, attachment3] = images;

        const payload: IReqMaintenanceRequestCustomerDTO = {
            ...values,
            attachment1,
            attachment2,
            attachment3,
        };

        await createRequest(payload);
        form.resetFields();
        setFileList([]);

        // Gọi callback để đóng modal
        onSuccess?.();
    };

    /** ========================= RENDER ========================= */
    return (
        <Card
            title={<Title level={4}>Tạo Phiếu Bảo Trì (Khách hàng)</Title>}
            className="max-w-2xl mx-auto mt-8 shadow-md"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    priorityLevel: "TRUNG_BINH" as PriorityLevel,
                    maintenanceType: "DOT_XUAT" as MaintenanceType,
                }}
            >
                {/* THIẾT BỊ */}
                <Form.Item
                    label="Thiết bị"
                    name="deviceCode"
                    rules={[{ required: true, message: "Vui lòng chọn thiết bị" }]}
                >
                    <Select
                        showSearch
                        placeholder="Chọn thiết bị của bạn"
                        optionFilterProp="children"
                    >
                        {deviceData?.map((item: any) => (
                            <Option key={item.deviceCode} value={item.deviceCode}>
                                {item.deviceName} ({item.deviceCode})
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* SỰ CỐ */}
                <Form.Item
                    label="Loại sự cố"
                    name="issueId"
                    rules={[{ required: true, message: "Vui lòng chọn sự cố" }]}
                >
                    <Select placeholder="Chọn loại sự cố" optionFilterProp="children">
                        {issueData?.map((issue: any) => (
                            <Option key={issue.id} value={issue.id}>
                                {issue.issueName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* ĐỊA ĐIỂM */}
                <Form.Item label="Địa điểm cụ thể" name="locationDetail">
                    <TextArea
                        placeholder="Nhập địa chỉ hoặc vị trí cụ thể của thiết bị"
                        rows={2}
                    />
                </Form.Item>

                {/* GHI CHÚ */}
                <Form.Item label="Ghi chú" name="note">
                    <TextArea
                        placeholder="Nhập ghi chú bổ sung (nếu có)"
                        rows={3}
                        maxLength={1000}
                        showCount
                    />
                </Form.Item>

                {/* MỨC ĐỘ ƯU TIÊN */}
                <Form.Item
                    label="Mức độ ưu tiên"
                    name="priorityLevel"
                    rules={[{ required: true, message: "Chọn mức độ ưu tiên" }]}
                >
                    <Select placeholder="Chọn mức độ ưu tiên">
                        <Option value="KHAN_CAP">Khẩn cấp</Option>
                        <Option value="CAO">Cao</Option>
                        <Option value="TRUNG_BINH">Trung bình</Option>
                        <Option value="THAP">Thấp</Option>
                    </Select>
                </Form.Item>

                {/* LOẠI BẢO TRÌ */}
                <Form.Item
                    label="Loại bảo trì"
                    name="maintenanceType"
                    rules={[{ required: true, message: "Chọn loại bảo trì" }]}
                >
                    <Select placeholder="Chọn loại bảo trì">
                        <Option value="DOT_XUAT">Đột xuất</Option>
                        <Option value="DINH_KY">Định kỳ</Option>
                        <Option value="SUA_CHUA">Sửa chữa</Option>
                    </Select>
                </Form.Item>

                {/* FILE ĐÍNH KÈM */}
                <Form.Item label="Hình ảnh / Tệp đính kèm (tối đa 3)">
                    <Upload {...uploadProps}>
                        {fileList.length >= 3 ? null : (
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Tải lên</div>
                            </div>
                        )}
                    </Upload>
                    <Modal
                        open={previewOpen}
                        title={previewTitle}
                        footer={null}
                        onCancel={() => setPreviewOpen(false)}
                    >
                        <Image alt="preview" src={previewImage} width="100%" />
                    </Modal>
                </Form.Item>

                {/* NÚT GỬI */}
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isPending}
                        className="w-full"
                    >
                        {isPending ? "Đang gửi..." : "Gửi yêu cầu bảo trì"}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default CreateMaintenanceRequestClientPage;