import {
    ModalForm,
    ProFormDatePicker,
    ProFormSelect,
    ProFormSwitch,
    ProFormTextArea,
    ProFormTimePicker,
} from "@ant-design/pro-components";
import { Col, Form, Row, Alert, Switch, Space } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import type {
    ITechnicianAvailability,
    IReqTechnicianAvailability,
} from "@/types/backend";
import {
    useCreateTechnicianAvailabilityMutation,
    useUpdateTechnicianAvailabilityMutation,
} from "@/hooks/useTechnicianAvailability";
import { useTechniciansQuery } from "@/hooks/user/useTechnicians";
import { useShiftTemplatesQuery } from "@/hooks/useShiftTemplate";
import { notify } from "@/components/common/notify";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: ITechnicianAvailability | null;
    setDataInit: (v: any) => void;
}

/**
 * Modal quản lý ca làm việc kỹ thuật viên
 * - Hỗ trợ tạo 1 ngày hoặc nhiều ngày liên tiếp
 * - Cho phép chọn ca mẫu để tự động fill giờ làm việc
 */
const ModalTechnicianAvailability = ({
    openModal,
    setOpenModal,
    dataInit,
    setDataInit,
}: IProps) => {
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

    const [isUsingTemplate, setIsUsingTemplate] = useState(false);
    const [isMultipleDays, setIsMultipleDays] = useState(false);
    const [workingDays, setWorkingDays] = useState<
        ("MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY")[]
    >([
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
    ]);

    const { mutate: createAvailability, isPending: isCreating } =
        useCreateTechnicianAvailabilityMutation();
    const { mutate: updateAvailability, isPending: isUpdating } =
        useUpdateTechnicianAvailabilityMutation();

    const { data: technicians } = useTechniciansQuery("page=1&pageSize=100");
    const { data: shiftTemplates } = useShiftTemplatesQuery("page=1&pageSize=100");

    /** ========================= Fill dữ liệu khi Edit ========================= */
    useEffect(() => {
        if (dataInit?.id) {
            form.setFieldsValue({
                technicianId: dataInit.technician?.id,
                shiftTemplateId: dataInit.shiftTemplate?.id,
                workDate: dataInit.workDate ? dayjs(dataInit.workDate) : undefined,
                startTime: dataInit.startTime
                    ? dayjs(dataInit.startTime, "HH:mm:ss")
                    : undefined,
                endTime: dataInit.endTime
                    ? dayjs(dataInit.endTime, "HH:mm:ss")
                    : undefined,
                status: dataInit.status,
                special: dataInit.special ?? false,
                note: dataInit.note,
            });
            setIsUsingTemplate(Boolean(dataInit.shiftTemplate));
            setIsMultipleDays(false);
        } else {
            form.resetFields();
            setIsUsingTemplate(false);
            setIsMultipleDays(false);
        }
    }, [dataInit, form]);

    /** ========================= Reset & Đóng Modal ========================= */
    const handleReset = () => {
        form.resetFields();
        setDataInit(null);
        setIsUsingTemplate(false);
        setIsMultipleDays(false);
        setWorkingDays(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]);
        setOpenModal(false);
    };

    const submitAvailability = async (valuesForm: any) => {
        const start =
            valuesForm.startTime &&
            (dayjs.isDayjs(valuesForm.startTime)
                ? valuesForm.startTime
                : dayjs(valuesForm.startTime, "HH:mm"));

        const end =
            valuesForm.endTime &&
            (dayjs.isDayjs(valuesForm.endTime)
                ? valuesForm.endTime
                : dayjs(valuesForm.endTime, "HH:mm"));

        if (!valuesForm.shiftTemplateId && (!start || !end || !start.isValid() || !end.isValid())) {
            notify.error("Giờ bắt đầu và kết thúc không được để trống");
            return Promise.reject();
        }

        const payload: IReqTechnicianAvailability = {
            technicianId: valuesForm.technicianId,
            shiftTemplateId: valuesForm.shiftTemplateId || null,
            workDate: dayjs(valuesForm.workDate).format("YYYY-MM-DD"),
            endDate:
                isMultipleDays && valuesForm.endDate
                    ? dayjs(valuesForm.endDate).format("YYYY-MM-DD")
                    : undefined,
            startTime: start ? start.format("HH:mm:ss") : undefined,
            endTime: end ? end.format("HH:mm:ss") : undefined,
            status: isEdit ? valuesForm.status : "AVAILABLE",
            special: valuesForm.isSpecial ?? false,
            note: valuesForm.note ?? null,
            ...(isMultipleDays ? { workingDays } : {}),

        };

        if (isEdit && dataInit?.id) {
            updateAvailability(
                { id: String(dataInit.id), data: payload },
                {
                    onSuccess: () => handleReset(),
                }
            );
        } else {
            createAvailability(payload, {
                onSuccess: () => handleReset(),
            });
        }
    };


    /** ========================= Khi chọn ca mẫu → tự động fill giờ ========================= */
    const handleSelectShiftTemplate = (id: string | undefined) => {
        if (!id) {
            form.setFieldsValue({ startTime: undefined, endTime: undefined });
            setIsUsingTemplate(false);
            return;
        }

        const selected = shiftTemplates?.result?.find((s) => s.id === id);
        if (selected && selected.startTime && selected.endTime) {
            form.setFieldsValue({
                startTime: dayjs(selected.startTime, "HH:mm:ss").isValid()
                    ? dayjs(selected.startTime, "HH:mm:ss")
                    : undefined,
                endTime: dayjs(selected.endTime, "HH:mm:ss").isValid()
                    ? dayjs(selected.endTime, "HH:mm:ss")
                    : undefined,
            });
            setIsUsingTemplate(true);
        } else {
            setIsUsingTemplate(false);
        }
    };

    return (
        <ModalForm
            title={
                isEdit
                    ? "Cập nhật ca làm việc kỹ thuật viên"
                    : "Tạo mới ca làm việc kỹ thuật viên"
            }
            open={openModal}
            modalProps={{
                onCancel: () => handleReset(),
                afterClose: handleReset,
                destroyOnClose: true,
                width: isMobile ? "100%" : 820,
                keyboard: false,
                maskClosable: false,
                okText: isEdit ? "Cập nhật" : "Tạo mới",
                cancelText: "Hủy",
                confirmLoading: isCreating || isUpdating,
            }}
            form={form}
            onFinish={submitAvailability}
        >
            {/* ========================= Thông báo + switch bật nhiều ngày ========================= */}
            {!isEdit && (
                <Alert
                    type="info"
                    message={
                        <Space>
                            <Switch
                                checked={isMultipleDays}
                                onChange={(v) => setIsMultipleDays(v)}
                                size="small"
                            />
                            <span>
                                {" "}
                                Bật để tạo nhiều ca liên tiếp (chọn ngày bắt đầu và ngày kết
                                thúc)
                            </span>
                        </Space>
                    }
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            <Row gutter={16}>
                {/* ================= Kỹ thuật viên ================= */}
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormSelect
                        label="Kỹ thuật viên"
                        name="technicianId"
                        rules={[{ required: true, message: "Vui lòng chọn kỹ thuật viên" }]}
                        placeholder="Chọn kỹ thuật viên"
                        options={
                            technicians?.result?.map((t) => ({
                                label: t.fullName,
                                value: t.id,
                            })) ?? []
                        }
                        disabled={isEdit}
                    />
                </Col>

                {/* ================= Ca mẫu ================= */}
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormSelect
                        label="Ca mẫu"
                        name="shiftTemplateId"
                        allowClear
                        placeholder="Chọn ca mẫu (nếu có)"
                        options={
                            shiftTemplates?.result?.map((s) => ({
                                label: s.name,
                                value: s.id,
                            })) ?? []
                        }
                        fieldProps={{
                            onChange: (val) => handleSelectShiftTemplate(val as string),
                        }}
                    />
                </Col>

                {/* ================= Ngày làm việc ================= */}
                {!isEdit ? (
                    <>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProFormDatePicker
                                label={isMultipleDays ? "Ngày bắt đầu" : "Ngày làm việc"}
                                name="workDate"
                                rules={[
                                    { required: true, message: "Vui lòng chọn ngày làm việc" },
                                ]}
                                fieldProps={{ format: "YYYY-MM-DD" }}
                            />
                        </Col>

                        {isMultipleDays && (
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProFormDatePicker
                                    label="Ngày kết thúc"
                                    name="endDate"
                                    fieldProps={{ format: "YYYY-MM-DD" }}
                                    tooltip="Nếu bỏ trống, hệ thống mặc định tạo 1 ngày duy nhất"
                                />
                            </Col>
                        )}
                        {!isEdit && isMultipleDays && (
                            <Col span={24}>
                                <Form.Item label="Chọn ngày trong tuần">
                                    <Space wrap>
                                        {[
                                            { label: "Thứ 2", value: "MONDAY" },
                                            { label: "Thứ 3", value: "TUESDAY" },
                                            { label: "Thứ 4", value: "WEDNESDAY" },
                                            { label: "Thứ 5", value: "THURSDAY" },
                                            { label: "Thứ 6", value: "FRIDAY" },
                                            { label: "Thứ 7", value: "SATURDAY" },
                                            { label: "Chủ nhật", value: "SUNDAY" },
                                        ].map((day) => (
                                            <Switch
                                                key={day.value}
                                                size="small"
                                                checked={workingDays.includes(day.value as typeof workingDays[number])}
                                                onChange={(checked) => {
                                                    const value = day.value as typeof workingDays[number];
                                                    if (checked) setWorkingDays([...workingDays, value]);
                                                    else setWorkingDays(workingDays.filter((v) => v !== value));
                                                }}
                                                checkedChildren={day.label}
                                                unCheckedChildren={day.label}
                                            />
                                        ))}
                                    </Space>
                                </Form.Item>
                            </Col>
                        )}

                    </>
                ) : (
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormDatePicker
                            label="Ngày làm việc"
                            name="workDate"
                            disabled
                            fieldProps={{ format: "YYYY-MM-DD" }}
                        />
                    </Col>
                )}

                {/* ================= Giờ làm việc ================= */}
                <Col lg={6} md={6} sm={12} xs={24}>
                    <ProFormTimePicker
                        label="Giờ bắt đầu"
                        name="startTime"
                        fieldProps={{
                            format: "HH:mm",
                            placeholder: "Chọn giờ bắt đầu",
                        }}
                        disabled={isUsingTemplate}
                    />
                </Col>

                <Col lg={6} md={6} sm={12} xs={24}>
                    <ProFormTimePicker
                        label="Giờ kết thúc"
                        name="endTime"
                        fieldProps={{
                            format: "HH:mm",
                            placeholder: "Chọn giờ kết thúc",
                        }}
                        disabled={isUsingTemplate}
                    />
                </Col>

                {/* ================= Trạng thái & ca đặc biệt ================= */}
                {isEdit && (
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormSelect
                            label="Trạng thái"
                            name="status"
                            options={[
                                { label: "Đang rảnh (AVAILABLE)", value: "AVAILABLE" },
                                { label: "Đang bận (BUSY)", value: "BUSY" },
                                { label: "Ngoại tuyến (OFFLINE)", value: "OFFLINE" },
                                { label: "Nghỉ phép (ON_LEAVE)", value: "ON_LEAVE" },
                            ]}
                            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                            placeholder="Chọn trạng thái"
                        />
                    </Col>
                )}


                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormSwitch label="Ca đặc biệt" name="isSpecial" />
                </Col>

                {/* ================= Ghi chú ================= */}
                <Col span={24}>
                    <ProFormTextArea
                        label="Ghi chú"
                        name="note"
                        placeholder="Ghi chú thêm (nếu có)"
                        fieldProps={{
                            autoSize: { minRows: 2, maxRows: 5 },
                        }}
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalTechnicianAvailability;
