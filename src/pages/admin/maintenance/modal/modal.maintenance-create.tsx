import { useEffect, useState } from "react";
import {
    Form,
    Input,
    Select,
    Button,
    Modal,
    message,
    Card,
    Typography,
    Row,
    Col,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

import { callFetchDevice, callFetchIssue } from "@/config/api";
import { useCreateInternalMaintenanceRequestMutation } from "@/hooks/maintenance/useMaintenanceRequests";
import type {
    IReqMaintenanceRequestInternalDTO,
    PriorityLevel,
    MaintenanceType,
    IDeviceList,
} from "@/types/backend";

import FileUploader from "@/components/ui/FileUploader";

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
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<IDeviceList | null>(null);

    const account = useSelector((state: RootState) => state.account);
    const employee = account.employee;

    const { mutateAsync: createRequest, isPending } =
        useCreateInternalMaintenanceRequestMutation();

    /** =============== FETCH API =============== */
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

    /** =============== PREFILL FORM =============== */
    useEffect(() => {
        if (open) {
            const defaults =
                employee
                    ? {
                        fullName: employee.fullName,
                        employeeCode: employee.employeeCode,
                        phone: employee.phone,
                        positionName: employee.positionName,
                    }
                    : account.user
                        ? {
                            fullName: account.user.name,
                            employeeCode: "Không áp dụng",
                            phone: "Chưa cập nhật",
                            positionName: "Khách hàng",
                        }
                        : {};

            form.setFieldsValue(defaults);
        } else {
            form.resetFields();
            setUploadedFiles([]);
            setSelectedDevice(null);
        }
    }, [open, employee, account.user, form]);

    /** =============== HANDLE DEVICE CHANGE =============== */
    const handleDeviceChange = (deviceCode: string) => {
        const device = devices?.find(
            (d: any) => d.deviceCode === deviceCode
        ) as IDeviceList | undefined;

        if (device) {
            setSelectedDevice(device);
            form.setFieldsValue({
                companyName: device.companyName || "Không xác định",
                departmentName: device.departmentName || "Không xác định",
            });
        } else {
            setSelectedDevice(null);
            form.setFieldsValue({
                companyName: undefined,
                departmentName: undefined,
            });
        }
    };

    /** =============== HANDLE SUBMIT =============== */
    const handleSubmit = async (values: IReqMaintenanceRequestInternalDTO) => {
        if (uploadedFiles.length === 0) {
            message.warning("Vui lòng tải lên ít nhất 1 tệp (ảnh hoặc video)!");
            return;
        }

        const attachments = uploadedFiles.map((f) => f.name || "").slice(0, 3);
        const [attachment1, attachment2, attachment3] = attachments;

        const payload: IReqMaintenanceRequestInternalDTO = {
            ...values,
            attachment1,
            attachment2,
            attachment3,
        };

        try {
            await createRequest(payload);
            message.success("Tạo phiếu bảo trì nội bộ thành công");
            onSuccess?.();
            form.resetFields();
            setUploadedFiles([]);
            setSelectedDevice(null);
            onClose();
        } catch (err: any) {
            message.error(err?.message || "Không thể tạo phiếu bảo trì");
        }
    };

    /** =============== RENDER =============== */
    return (
        <Modal
            open={open}
            title={<Title level={4} className="!mb-0">Tạo Phiếu Bảo Trì</Title>}
            onCancel={onClose}
            footer={null}
            centered
            destroyOnClose
            width={900}
            bodyStyle={{
                maxHeight: "calc(100vh - 120px)",
                overflowY: "auto",
                padding: 12,
            }}
        >
            <Card bordered={false} className="shadow-none">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        priorityLevel: "TRUNG_BINH" as PriorityLevel,
                        maintenanceType: "DOT_XUAT" as MaintenanceType,
                    }}
                    style={{ marginTop: -8 }}
                >
                    {/* ===== Thông tin nhân viên ===== */}
                    <Title
                        level={5}
                        style={{ marginBottom: 8, marginTop: 0, fontSize: 15 }}
                    >
                        Thông tin nhân viên
                    </Title>
                    <Row gutter={[8, 4]}>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Họ và tên" name="fullName" style={{ marginBottom: 6 }}>
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Mã nhân viên" name="employeeCode" style={{ marginBottom: 6 }}>
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Chức vụ" name="positionName" style={{ marginBottom: 6 }}>
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Số điện thoại" name="phone" style={{ marginBottom: 6 }}>
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* ===== Thông tin phiếu ===== */}
                    <Title
                        level={5}
                        style={{ marginTop: 8, marginBottom: 8, fontSize: 15 }}
                    >
                        Thông tin phiếu bảo trì
                    </Title>

                    <Row gutter={[8, 4]}>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item
                                label="Thiết bị"
                                name="deviceCode"
                                rules={[{ required: true, message: "Vui lòng chọn thiết bị" }]}
                                style={{ marginBottom: 6 }}
                            >
                                <Select
                                    placeholder="Chọn thiết bị"
                                    showSearch
                                    optionFilterProp="children"
                                    onChange={handleDeviceChange}
                                    loading={!devices}
                                >
                                    {devices?.map((item: any) => (
                                        <Option key={item.deviceCode} value={item.deviceCode}>
                                            {item.deviceName} ({item.deviceCode})
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Công ty" name="companyName" style={{ marginBottom: 6 }}>
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label="Phòng ban" name="departmentName" style={{ marginBottom: 6 }}>
                                <Input disabled />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8}>
                            <Form.Item
                                label="Sự cố"
                                name="issueId"
                                rules={[{ required: true, message: "Vui lòng chọn sự cố" }]}
                                style={{ marginBottom: 6 }}
                            >
                                <Select placeholder="Chọn sự cố" loading={!issues}>
                                    {issues?.map((item: any) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.issueName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8}>
                            <Form.Item
                                label="Mức độ ưu tiên"
                                name="priorityLevel"
                                rules={[{ required: true, message: "Chọn mức độ ưu tiên" }]}
                                style={{ marginBottom: 6 }}
                            >
                                <Select>
                                    <Option value="KHAN_CAP">Khẩn cấp</Option>
                                    <Option value="CAO">Cao</Option>
                                    <Option value="TRUNG_BINH">Trung bình</Option>
                                    <Option value="THAP">Thấp</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={8}>
                            <Form.Item
                                label="Loại bảo trì"
                                name="maintenanceType"
                                rules={[{ required: true, message: "Chọn loại bảo trì" }]}
                                style={{ marginBottom: 6 }}
                            >
                                <Select>
                                    <Option value="DOT_XUAT">Đột xuất</Option>
                                    <Option value="DINH_KY">Định kỳ</Option>
                                    <Option value="SUA_CHUA">Sửa chữa</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item label="Địa điểm cụ thể" name="locationDetail" style={{ marginBottom: 6 }}>
                                <TextArea rows={2} placeholder="Nhập địa điểm cụ thể của thiết bị" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Ghi chú" name="note" style={{ marginBottom: 6 }}>
                                <TextArea rows={2} placeholder="Nhập ghi chú (nếu có)" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* ===== Upload ===== */}
                    <Form.Item
                        label="Ảnh / Video đính kèm (tối đa 3 tệp)"
                        required
                        style={{ marginBottom: 8 }}
                    >
                        <FileUploader
                            folder="maintenance_request"
                            maxFiles={3}
                            onChange={(files) => setUploadedFiles(files)}
                        />
                    </Form.Item>

                    {/* ===== Submit ===== */}
                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="middle"
                            loading={isPending}
                            style={{ height: 36 }}
                        >
                            {isPending ? "Đang tạo..." : "Tạo phiếu"}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Modal>
    );
};

export default ModalCreateMaintenance;
