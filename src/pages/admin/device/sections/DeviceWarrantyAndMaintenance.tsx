import { Col, Row, Card, Radio, Select } from "antd";
import { ProFormDatePicker, ProFormDigit, ProForm } from "@ant-design/pro-components";
import type { TimeUnitType } from "@/types/backend";

interface DeviceWarrantyAndMaintenanceProps {
    isEdit: boolean;
    freqUnit: TimeUnitType;
    setFreqUnit: (v: TimeUnitType) => void;
}

const DEPRE_UNITS: TimeUnitType[] = ["MONTH", "QUARTER", "YEAR"];
const FREQ_UNITS: TimeUnitType[] = ["DAY", "WEEK", "MONTH", "YEAR"];

const DeviceWarrantyAndMaintenance = ({
    isEdit,
    freqUnit,
    setFreqUnit,
}: DeviceWarrantyAndMaintenanceProps) => {

    const disabled = isEdit === true;

    return (
        <>
            {/* ================== BẢO HÀNH ================== */}
            <Card size="small" title="Thời gian & Bảo hành" bordered={false} style={{ background: "#fafafa" }}>
                <Row gutter={[16, 8]}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormDatePicker
                            label="Ngày đưa vào sử dụng"
                            name="startDate"
                            rules={[{ required: true, message: "Chọn ngày đưa vào sử dụng" }]}
                            placeholder="Chọn ngày"
                            fieldProps={{
                                style: { width: "100%" },
                                disabled,
                            }}
                        />
                    </Col>

                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormDatePicker
                            label="Ngày hết hạn bảo hành"
                            name="warrantyExpiryDate"
                            rules={[{ required: true, message: "Chọn ngày hết hạn bảo hành" }]}
                            placeholder="Chọn ngày"
                            fieldProps={{
                                style: { width: "100%" },
                                disabled,
                            }}
                        />
                    </Col>
                </Row>
            </Card>

            {/* ================== KHẤU HAO ================== */}
            <Card size="small" title="Thời gian khấu hao" bordered={false} style={{ background: "#fafafa" }}>
                <Row gutter={[16, 8]}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormDigit
                            label="Số kỳ khấu hao"
                            name="depreciationPeriodValue"
                            min={1}
                            placeholder="Nhập số kỳ"
                            rules={[{ required: true, message: "Nhập số kỳ khấu hao" }]}
                            fieldProps={{ disabled }}
                        />
                    </Col>

                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProForm.Item
                            name="depreciationPeriodUnit"
                            label="Đơn vị thời gian"
                            rules={[{ required: true, message: "Chọn đơn vị khấu hao" }]}
                        >
                            <Select
                                disabled={disabled}
                                options={DEPRE_UNITS.map((u) => ({
                                    label:
                                        u === "MONTH"
                                            ? "Tháng"
                                            : u === "QUARTER"
                                                ? "Quý"
                                                : "Năm",
                                    value: u,
                                }))}
                                placeholder="Chọn đơn vị"
                            />
                        </ProForm.Item>
                    </Col>
                </Row>
            </Card>

            {/* ================== BẢO DƯỠNG ================== */}
            <Card size="small" title="Tần suất bảo dưỡng" bordered={false} style={{ background: "#fafafa" }}>
                <Row gutter={[16, 8]}>
                    <Col lg={8} md={12} sm={24} xs={24}>
                        <ProFormDigit
                            label="Tần suất (số lần)"
                            name="maintenanceFrequencyValue"
                            min={1}
                            placeholder="Nhập số lần"
                            rules={[{ required: true, message: "Nhập tần suất bảo dưỡng" }]}
                            fieldProps={{ disabled }}
                        />
                    </Col>

                    <Col lg={16} md={12} sm={24} xs={24}>
                        <ProForm.Item
                            name="maintenanceFrequencyUnit"
                            label="Đơn vị thời gian"
                            rules={[{ required: true, message: "Chọn đơn vị bảo dưỡng" }]}
                        >
                            <Radio.Group
                                optionType="button"
                                buttonStyle="solid"
                                disabled={disabled}
                                onChange={(e) => {
                                    if (!disabled) setFreqUnit(e.target.value);
                                }}
                            >
                                {FREQ_UNITS.map((u) => (
                                    <Radio.Button key={u} value={u}>
                                        {u === "DAY"
                                            ? "Ngày"
                                            : u === "WEEK"
                                                ? "Tuần"
                                                : u === "MONTH"
                                                    ? "Tháng"
                                                    : "Năm"}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </ProForm.Item>
                    </Col>
                </Row>
            </Card>
        </>
    );
};

export default DeviceWarrantyAndMaintenance;
