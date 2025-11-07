import { Col, Row, Card } from "antd";
import { ProFormList, ProFormGroup, ProFormText, ProFormDigit } from "@ant-design/pro-components";

const DevicePartsSection = () => {
    return (
        <Card
            size="small"
            title="Linh kiện / Vật tư"
            bordered={false}
            style={{ background: "#fafafa" }}
        >
            <ProFormList
                name="parts"
                alwaysShowItemLabel
                creatorButtonProps={{
                    position: "bottom",
                    creatorButtonText: "Thêm linh kiện",
                    type: "dashed",
                }}
                copyIconProps={false}
                deleteIconProps={{ tooltipText: "Xóa dòng này" }}
            >
                <ProFormGroup>
                    <Row gutter={[16, 8]} style={{ width: "100%" }}>
                        <Col lg={10} md={10} sm={24} xs={24}>
                            <ProFormText
                                name="partCode"
                                label="Mã linh kiện"
                                placeholder="Nhập mã linh kiện"
                                rules={[{ required: true, message: "Nhập mã linh kiện" }]}
                            />
                        </Col>
                        <Col lg={10} md={10} sm={24} xs={24}>
                            <ProFormText
                                name="partName"
                                label="Tên linh kiện"
                                placeholder="Nhập tên linh kiện"
                                rules={[{ required: true, message: "Nhập tên linh kiện" }]}
                            />
                        </Col>
                        <Col lg={4} md={4} sm={24} xs={24}>
                            <ProFormDigit
                                name="quantity"
                                label="Số lượng"
                                min={1}
                                placeholder="SL"
                                fieldProps={{ precision: 0 }}
                                rules={[{ required: true, message: "Nhập số lượng" }]}
                            />
                        </Col>
                        {/* Thêm ẩn trạng thái mặc định */}
                        <ProFormText name="status" hidden initialValue="WORKING" />
                    </Row>
                </ProFormGroup>
            </ProFormList>
        </Card>
    );
};

export default DevicePartsSection;
