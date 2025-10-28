import { Col, Row, Card, Radio, Select, Space, Typography, Form } from "antd";
import { ProFormDatePicker, ProFormDigit, ProForm } from "@ant-design/pro-components";
import type { TimeUnitType } from "@/types/backend";

const { Text } = Typography;

interface DeviceWarrantyAndMaintenanceProps {
    freqUnit: TimeUnitType;
    setFreqUnit: (v: TimeUnitType) => void;
    freqModeYear: "anyday" | "weekday";
    setFreqModeYear: (v: "anyday" | "weekday") => void;
}

const DEPRE_UNITS: TimeUnitType[] = ["MONTH", "QUARTER", "YEAR"];
const FREQ_UNITS: TimeUnitType[] = ["DAY", "WEEK", "MONTH", "YEAR"];

const WEEK_DAYS = [
    { label: "Thứ 2", value: 1 },
    { label: "Thứ 3", value: 2 },
    { label: "Thứ 4", value: 3 },
    { label: "Thứ 5", value: 4 },
    { label: "Thứ 6", value: 5 },
    { label: "Thứ 7", value: 6 },
    { label: "Chủ nhật", value: 7 },
];

const WEEK_ORDERS = [
    { label: "Tuần 1", value: 1 },
    { label: "Tuần 2", value: 2 },
    { label: "Tuần 3", value: 3 },
    { label: "Tuần 4", value: 4 },
    { label: "Tuần 5", value: 5 },
];

const MONTHS = Array.from({ length: 12 }, (_, i) => ({ label: `Tháng ${i + 1}`, value: i + 1 }));

const DeviceWarrantyAndMaintenance = ({
    freqUnit,
    setFreqUnit,
    freqModeYear,
    setFreqModeYear,
}: DeviceWarrantyAndMaintenanceProps) => {
    const showWeekFields = freqUnit === "WEEK";
    const showMonthFields = freqUnit === "MONTH";
    const showYearFields = freqUnit === "YEAR";

    return (
        <>
            {/* Thời gian & Bảo hành */}
            <Card size="small" title=" Thời gian & Bảo hành" bordered={false} style={{ background: '#fafafa' }}>
                <Row gutter={[16, 8]}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormDatePicker
                            label="Ngày đưa vào sử dụng"
                            name="startDate"
                            rules={[{ required: true, message: "Chọn ngày đưa vào sử dụng" }]}
                            placeholder="Chọn ngày"
                            fieldProps={{ style: { width: '100%' } }}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormDatePicker
                            label="Ngày hết hạn bảo hành"
                            name="warrantyExpiryDate"
                            rules={[{ required: true, message: "Chọn ngày hết bảo hành" }]}
                            placeholder="Chọn ngày"
                            fieldProps={{ style: { width: '100%' } }}
                        />
                    </Col>
                </Row>
            </Card>

            {/* Khấu hao */}
            <Card size="small" title=" Thời gian khấu hao" bordered={false} style={{ background: '#fafafa' }}>
                <Row gutter={[16, 8]}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormDigit
                            label="Số kỳ khấu hao"
                            name="depreciationPeriodValue"
                            min={1}
                            placeholder="Nhập số kỳ"
                            rules={[{ required: true, message: "Nhập số kỳ khấu hao" }]}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProForm.Item
                            name="depreciationPeriodUnit"
                            label="Đơn vị thời gian"
                            rules={[{ required: true, message: "Chọn đơn vị" }]}
                        >
                            <Select
                                options={DEPRE_UNITS.map((u) => ({
                                    label: u === "MONTH" ? "Tháng" : u === "QUARTER" ? "Quý" : "Năm",
                                    value: u
                                }))}
                                placeholder="Chọn đơn vị"
                            />
                        </ProForm.Item>
                    </Col>
                </Row>
            </Card>

            {/* Bảo dưỡng */}
            <Card size="small" title=" Tần suất bảo dưỡng" bordered={false} style={{ background: '#fafafa' }}>
                <Row gutter={[16, 8]}>
                    <Col lg={8} md={12} sm={24} xs={24}>
                        <ProFormDigit
                            label="Tần suất (số lần)"
                            name="maintenanceFrequencyValue"
                            min={1}
                            placeholder="Nhập số lần"
                            rules={[{ required: true, message: "Nhập số lần" }]}
                        />
                    </Col>
                    <Col lg={16} md={12} sm={24} xs={24}>
                        <ProForm.Item
                            name="maintenanceFrequencyUnit"
                            label="Đơn vị thời gian"
                            rules={[{ required: true, message: "Chọn đơn vị" }]}
                        >
                            <Radio.Group
                                optionType="button"
                                buttonStyle="solid"
                                onChange={(e) => setFreqUnit(e.target.value)}
                            >
                                {FREQ_UNITS.map((u) => (
                                    <Radio.Button key={u} value={u}>
                                        {u === "DAY" ? "Ngày" : u === "WEEK" ? "Tuần" : u === "MONTH" ? "Tháng" : "Năm"}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </ProForm.Item>
                    </Col>

                    {/* WEEK fields */}
                    {showWeekFields && (
                        <>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProForm.Item
                                    name="maintenanceDayOfWeek"
                                    label="Vào thứ"
                                    rules={[{ required: true, message: "Chọn thứ" }]}
                                >
                                    <Select options={WEEK_DAYS} placeholder="Chọn thứ" />
                                </ProForm.Item>
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProForm.Item
                                    name="maintenanceWeekOrder"
                                    label="Thuộc tuần"
                                    rules={[{ required: true, message: "Chọn thứ tự tuần" }]}
                                >
                                    <Select options={WEEK_ORDERS} placeholder="Chọn thứ tự tuần" />
                                </ProForm.Item>
                            </Col>
                        </>
                    )}

                    {/* MONTH fields */}
                    {showMonthFields && (
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProFormDigit
                                label="Ngày trong tháng"
                                name="maintenanceDayOfMonth"
                                min={1}
                                max={31}
                                placeholder="Nhập ngày (1-31)"
                                rules={[{ required: true, message: "Nhập ngày trong tháng" }]}
                            />
                        </Col>
                    )}

                    {/* YEAR fields */}
                    {showYearFields && (
                        <Col span={24}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Space align="center">
                                    <Radio
                                        checked={freqModeYear === "anyday"}
                                        onChange={() => setFreqModeYear("anyday")}
                                    />
                                    <Text>Vào ngày bất kỳ trong tháng</Text>
                                    <Form.Item
                                        name="maintenanceMonth"
                                        style={{ margin: 0 }}
                                        rules={[
                                            {
                                                required: freqModeYear === "anyday",
                                                message: "Chọn tháng"
                                            }
                                        ]}
                                    >
                                        <Select
                                            disabled={freqModeYear !== "anyday"}
                                            placeholder="Chọn tháng"
                                            options={MONTHS}
                                            style={{ width: 180 }}
                                        />
                                    </Form.Item>
                                </Space>

                                <Space align="center" wrap>
                                    <Radio
                                        checked={freqModeYear === "weekday"}
                                        onChange={() => setFreqModeYear("weekday")}
                                    />
                                    <Text>Vào thứ</Text>
                                    <Form.Item
                                        name="maintenanceDayOfWeek"
                                        style={{ margin: 0 }}
                                        rules={[
                                            {
                                                required: freqModeYear === "weekday",
                                                message: "Chọn thứ"
                                            }
                                        ]}
                                    >
                                        <Select
                                            disabled={freqModeYear !== "weekday"}
                                            placeholder="Chọn thứ"
                                            options={WEEK_DAYS}
                                            style={{ width: 140 }}
                                        />
                                    </Form.Item>
                                    <Text>Thuộc tuần</Text>
                                    <Form.Item
                                        name="maintenanceWeekOrder"
                                        style={{ margin: 0 }}
                                        rules={[
                                            {
                                                required: freqModeYear === "weekday",
                                                message: "Chọn tuần"
                                            }
                                        ]}
                                    >
                                        <Select
                                            disabled={freqModeYear !== "weekday"}
                                            placeholder="Chọn tuần"
                                            options={WEEK_ORDERS}
                                            style={{ width: 140 }}
                                        />
                                    </Form.Item>
                                    <Text>Thuộc tháng</Text>
                                    <Form.Item
                                        name="maintenanceMonth"
                                        style={{ margin: 0 }}
                                        rules={[
                                            {
                                                required: freqModeYear === "weekday",
                                                message: "Chọn tháng"
                                            }
                                        ]}
                                    >
                                        <Select
                                            disabled={freqModeYear !== "weekday"}
                                            placeholder="Chọn tháng"
                                            options={MONTHS}
                                            style={{ width: 140 }}
                                        />
                                    </Form.Item>
                                </Space>
                            </Space>
                        </Col>
                    )}
                </Row>
            </Card>
        </>
    );
};

export default DeviceWarrantyAndMaintenance;