import { Col, Row, Radio, Card } from "antd";
import { ProFormText, ProForm } from "@ant-design/pro-components";
import { DebounceSelect } from "@/components/admin/debouce.select";
import type { ISelectItem } from "./types";
import type { DeviceOwnershipType } from "@/types/backend";
import { useEffect, useState } from "react";
import type { FormInstance } from "antd";

interface DeviceBasicInfoProps {
    isEdit: boolean;
    disabledFields: Record<string, boolean | undefined>;
    selectedDeviceType: ISelectItem | null;
    setSelectedDeviceType: (v: ISelectItem | null) => void;
    selectedUnit: ISelectItem | null;
    setSelectedUnit: (v: ISelectItem | null) => void;
    fetchDeviceTypeList: (name: string) => Promise<ISelectItem[]>;
    fetchUnitList: (name: string) => Promise<ISelectItem[]>;
    fetchCustomerList: (name: string) => Promise<ISelectItem[]>;
    form: FormInstance<any>;
}

const OWNERSHIP_OPTIONS: { label: string; value: DeviceOwnershipType }[] = [
    { label: "Nội bộ", value: "INTERNAL" },
    { label: "Khách hàng", value: "CUSTOMER" },
];

const DeviceBasicInfo = ({
    isEdit,
    disabledFields,
    form,
    selectedDeviceType,
    setSelectedDeviceType,
    selectedUnit,
    setSelectedUnit,
    fetchDeviceTypeList,
    fetchUnitList,
    fetchCustomerList,
}: DeviceBasicInfoProps) => {

    const [ownershipType, setOwnershipType] = useState<DeviceOwnershipType>("INTERNAL");
    const [selectedCustomer, setSelectedCustomer] = useState<ISelectItem | null>(null);

    // load ownership + customer khi update
    useEffect(() => {
        const o = form.getFieldValue("ownershipType");
        const c = form.getFieldValue("customer");

        if (o) setOwnershipType(o);
        if (c) {
            setSelectedCustomer(c);
        } else {
            setSelectedCustomer(null);
        }
    }, [form]);

    return (
        <Card
            size="small"
            title="Thông tin cơ bản"
            bordered={false}
            style={{ background: "#fafafa" }}
        >
            <Row gutter={[16, 8]}>

                {/* Mã thiết bị */}
                <Col lg={8} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Mã thiết bị"
                        name="deviceCode"
                        placeholder="Nhập mã thiết bị"
                        disabled={disabledFields.deviceCode}
                        rules={[{ required: true, message: "Vui lòng nhập mã thiết bị" }]}
                    />
                </Col>

                {/* Mã kế toán */}
                <Col lg={8} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Mã kế toán"
                        name="accountingCode"
                        placeholder="Nhập mã kế toán"
                        disabled={disabledFields.accountingCode}
                    />
                </Col>

                {/* Ownership Type */}
                <Col lg={8} md={12} sm={24} xs={24}>
                    <ProForm.Item
                        name="ownershipType"
                        label="Loại sở hữu"
                        rules={[{ required: true, message: "Vui lòng chọn loại sở hữu" }]}
                    >
                        <Radio.Group
                            optionType="button"
                            buttonStyle="solid"
                            disabled={disabledFields.ownershipType}
                            value={ownershipType}
                            onChange={(e) => {
                                setOwnershipType(e.target.value);
                                if (e.target.value === "INTERNAL") {
                                    setSelectedCustomer(null);
                                    form.setFieldValue("customer", null);
                                }
                            }}
                        >
                            {OWNERSHIP_OPTIONS.map((o) => (
                                <Radio.Button key={o.value} value={o.value}>
                                    {o.label}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </ProForm.Item>
                </Col>

                {/* CUSTOMER field */}
                {ownershipType === "CUSTOMER" && (
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProForm.Item
                            name="customer"
                            label="Khách hàng"
                            rules={[{ required: true, message: "Vui lòng chọn khách hàng" }]}
                        >
                            <DebounceSelect
                                allowClear
                                showSearch
                                placeholder="Chọn khách hàng"
                                fetchOptions={fetchCustomerList}
                                value={selectedCustomer}
                                onChange={(v: any) => setSelectedCustomer(v as ISelectItem)}
                                disabled={disabledFields.customer}
                                style={{ width: "100%" }}
                            />
                        </ProForm.Item>
                    </Col>
                )}

                {/* Tên thiết bị */}
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Tên thiết bị"
                        name="deviceName"
                        placeholder="Nhập tên thiết bị"
                        disabled={disabledFields.deviceName}
                        rules={[{ required: true, message: "Vui lòng nhập tên thiết bị" }]}
                    />
                </Col>

                {/* Loại thiết bị */}
                <Col lg={6} md={12} sm={24} xs={24}>
                    <ProForm.Item
                        name="deviceType"
                        label="Loại thiết bị"
                        rules={[{ required: true, message: "Vui lòng chọn loại" }]}
                    >
                        <DebounceSelect
                            allowClear
                            showSearch
                            placeholder="Chọn loại thiết bị"
                            fetchOptions={fetchDeviceTypeList}
                            value={selectedDeviceType}
                            onChange={(v: any) => setSelectedDeviceType(v as ISelectItem)}
                            style={{ width: "100%" }}
                            disabled={disabledFields.deviceType}
                        />
                    </ProForm.Item>
                </Col>

                {/* Đơn vị */}
                <Col lg={6} md={12} sm={24} xs={24}>
                    <ProForm.Item
                        name="unit"
                        label="Đơn vị"
                        rules={[{ required: true, message: "Vui lòng chọn đơn vị" }]}
                    >
                        <DebounceSelect
                            allowClear
                            showSearch
                            placeholder="Chọn đơn vị"
                            fetchOptions={fetchUnitList}
                            value={selectedUnit}
                            onChange={(v: any) => setSelectedUnit(v as ISelectItem)}
                            disabled={disabledFields.unit}
                            style={{ width: "100%" }}
                        />
                    </ProForm.Item>
                </Col>

            </Row>
        </Card>
    );
};

export default DeviceBasicInfo;
