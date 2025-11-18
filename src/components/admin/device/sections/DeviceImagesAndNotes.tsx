import { Card, Form, Upload, Modal, Col, Row, Select, Typography } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { ProFormTextArea, ProFormDigit, ProForm, ProFormSelect } from "@ant-design/pro-components";
import type { DeviceStatus } from "@/types/backend";

const { Text } = Typography;

interface DeviceImagesAndNotesProps {
    isEdit: boolean;
    fileList: UploadFile[];
    loadingUpload: boolean;
    previewOpen: boolean;
    previewImage: string;
    previewTitle: string;
    uploadProps: UploadProps;
    handleCancelPreview: () => void;
}

const STATUS_OPTIONS: { label: string; value: DeviceStatus }[] = [
    { label: "Mới tạo", value: "NEW" },
    { label: "Đang sử dụng", value: "IN_USE" },
    { label: "Lưu kho", value: "IN_STORAGE" },
    { label: "Không sử dụng", value: "NOT_IN_USE" },
    { label: "Thanh lý", value: "LIQUIDATED" },
];

const DeviceImagesAndNotes = ({
    isEdit,
    fileList,
    loadingUpload,
    previewOpen,
    previewImage,
    previewTitle,
    uploadProps,
    handleCancelPreview,
}: DeviceImagesAndNotesProps) => (
    <>
        {/* ================== GIÁ TRỊ & TRẠNG THÁI ================== */}
        <Card
            size="small"
            title="Giá trị & Trạng thái"
            bordered={false}
            style={{ background: '#fafafa' }}
        >
            <Row gutter={[16, 8]}>

                {/* UNIT PRICE */}
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormDigit
                        label="Đơn giá (VNĐ)"
                        name="unitPrice"
                        min={0}
                        placeholder="Nhập đơn giá"
                        fieldProps={{
                            precision: 0,
                            formatter: (value?: number) =>
                                value
                                    ? `${Number(value).toLocaleString("vi-VN")} VNĐ`
                                    : "",
                            parser: (value?: string) =>
                                value ? Number(value.replace(/\s?VNĐ|(,*)/g, "")) : 0,
                        }}
                        rules={[{ required: true, message: "Vui lòng nhập đơn giá" }]}
                    />
                </Col>

                {/* STATUS */}
                <Col lg={12} md={12} sm={24} xs={24}>
                    {isEdit ? (
                        <ProFormSelect
                            name="status"
                            label="Trạng thái"
                            options={STATUS_OPTIONS}
                            placeholder="Chọn trạng thái"
                        />
                    ) : (
                        <ProForm.Item label="Trạng thái">
                            <Text strong>Mới tạo (NEW)</Text>
                        </ProForm.Item>
                    )}
                </Col>

            </Row>
        </Card>

        {/* ================== HÌNH ẢNH ================== */}
        <Card
            size="small"
            title="Hình ảnh thiết bị (tối đa 3 ảnh)"
            bordered={false}
            style={{ background: '#fafafa' }}
        >
            <Form.Item
                name="images"
                rules={[
                    {
                        validator: () =>
                            fileList.length > 0
                                ? Promise.resolve()
                                : Promise.reject("Vui lòng upload ít nhất 1 hình ảnh"),
                    },
                ]}
            >
                <Upload {...uploadProps}>
                    {fileList.length >= 3 ? null : (
                        <div>
                            {loadingUpload ? "Đang tải..." : "+"}
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    )}
                </Upload>
            </Form.Item>

            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancelPreview}
            >
                <img alt="preview" style={{ width: "100%" }} src={previewImage} />
            </Modal>
        </Card>

        {/* ================== GHI CHÚ ================== */}
        <Card
            size="small"
            title="Ghi chú"
            bordered={false}
            style={{ background: '#fafafa' }}
        >
            <ProFormTextArea
                name="note"
                placeholder="Nhập ghi chú bổ sung (nếu có)"
                fieldProps={{
                    autoSize: { minRows: 3, maxRows: 5 },
                    maxLength: 500,
                    showCount: true,
                }}
            />
        </Card>
    </>
);

export default DeviceImagesAndNotes;
