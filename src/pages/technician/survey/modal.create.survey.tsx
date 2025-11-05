import {
    ModalForm,
    ProFormSelect,
    ProFormTextArea,
    ProFormText,
    ProForm,
} from "@ant-design/pro-components";
import { Form, Upload, Spin } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";

import {
    callFetchIssue,
    callFetchMaintenanceSurveyById,
    callFetchMaintenanceCause,
} from "@/config/api";
import { useCreateMaintenanceSurveyMutation } from "@/hooks/useMaintenanceSurveys";
import type { IReqMaintenanceSurveyDTO } from "@/types/backend";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    maintenanceRequestId?: string | null;
}

/** ===================== Modal Tạo Khảo Sát Bảo Trì ===================== */
const ModalCreateSurvey = ({
    openModal,
    setOpenModal,
    maintenanceRequestId,
}: IProps) => {
    const [form] = Form.useForm();
    const { mutate: createSurvey, isPending } = useCreateMaintenanceSurveyMutation();

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [issueOptions, setIssueOptions] = useState<{ label: string; value: string }[]>([]);
    const [causeOptions, setCauseOptions] = useState<{ label: string; value: string }[]>([]);

    const [damageLevelOptions] = useState([
        { label: "Nhẹ", value: "NHE" },
        { label: "Trung bình", value: "TRUNG_BINH" },
        { label: "Nặng", value: "NANG" },
        { label: "Rất nặng", value: "RAT_NANG" },
    ]);

    const [maintenanceTypeOptions] = useState([
        { label: "Đột xuất", value: "DOT_XUAT" },
        { label: "Định kỳ", value: "DINH_KY" },
        { label: "Sửa chữa", value: "SUA_CHUA" },
    ]);

    const [loading, setLoading] = useState(false);

    /** =================== Fetch dữ liệu phiếu khảo sát (chứa thông tin thiết bị + mã phiếu) =================== */
    useEffect(() => {
        const fetchSurveyDetail = async () => {
            if (!maintenanceRequestId || !openModal) return;
            try {
                setLoading(true);
                const res = await callFetchMaintenanceSurveyById(maintenanceRequestId);
                const info = res?.data?.requestInfo;
                if (info) {
                    form.setFieldsValue({
                        requestCode: info.requestCode,
                        deviceName: info.device?.deviceName,
                    });
                }
            } catch (err) {
                console.error("Không thể tải thông tin khảo sát", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSurveyDetail();
    }, [maintenanceRequestId, openModal, form]);

    /** =================== Fetch danh sách vấn đề =================== */
    const fetchIssues = async (search?: string) => {
        try {
            const query = `page=1&size=50${search ? `&filter=issueName~'${search}'` : ""}`;
            const res = await callFetchIssue(query);
            if (res?.data?.result) {
                const options = res.data.result.map((item: any) => ({
                    label: item.issueName,
                    value: item.id,
                }));
                setIssueOptions(options);
                return options;
            }
            return [];
        } catch {
            console.error("Không thể tải danh sách vấn đề");
            return [];
        }
    };

    /** =================== Fetch danh sách nguyên nhân =================== */
    const fetchCauses = async (search?: string) => {
        try {
            const query = `page=1&size=50${search ? `&filter=causeName~'${search}'` : ""}`;
            const res = await callFetchMaintenanceCause(query);
            if (res?.data?.result) {
                const options = res.data.result.map((item: any) => ({
                    label: item.causeName,
                    value: item.id,
                }));
                setCauseOptions(options);
                return options;
            }
            return [];
        } catch {
            console.error("Không thể tải danh sách nguyên nhân");
            return [];
        }
    };

    /** =================== Xử lý Submit =================== */
    const handleSubmit = async (values: IReqMaintenanceSurveyDTO) => {
        if (!maintenanceRequestId) return;

        const files = fileList.map((f) => f.name);
        const payload: IReqMaintenanceSurveyDTO = {
            ...values,
            maintenanceRequestId,
            attachment1: files[0],
            attachment2: files[1],
            attachment3: files[2],
        };

        console.log("Payload gửi:", payload);

        createSurvey(payload, {
            onSuccess: () => {
                form.resetFields();
                setFileList([]);
                setOpenModal(false);
            },
        });
    };

    return (
        <ModalForm<IReqMaintenanceSurveyDTO>
            key={maintenanceRequestId}
            title="Form thông tin khảo sát"
            form={form}
            open={openModal}
            layout="vertical"
            onFinish={handleSubmit}
            modalProps={{
                destroyOnClose: true,
                maskClosable: false,
                width: isMobile ? "100%" : 900,
                confirmLoading: isPending,
                onCancel: () => setOpenModal(false),
                okText: "Lưu khảo sát",
                cancelText: "Hủy",
            }}
        >
            <Spin spinning={loading}>
                {/* ==== Mã phiếu yêu cầu & Tên thiết bị ==== */}
                <div className="grid grid-cols-2 gap-4">
                    <ProFormText
                        name="requestCode"
                        label="Mã phiếu yêu cầu"
                        readonly
                    />
                    <ProFormText
                        name="deviceName"
                        label="Tên thiết bị"
                        readonly
                    />
                </div>

                {/* ==== Vấn đề thực tế & Mức độ hư hỏng ==== */}
                <div className="grid grid-cols-2 gap-4">
                    <ProFormSelect
                        name="issueId"
                        label="Mô tả tình trạng/vấn đề/sự cố thực tế"
                        placeholder="Chọn tình trạng/vấn đề/sự cố"
                        showSearch
                        debounceTime={400}
                        request={async ({ keyWords }) => await fetchIssues(keyWords)}
                        options={issueOptions}
                        rules={[{ required: true, message: "Vui lòng chọn vấn đề thực tế" }]}
                    />

                    <ProFormSelect
                        name="damageLevel"
                        label="Mức độ hư hỏng"
                        placeholder="Chọn mức độ hư hỏng"
                        options={damageLevelOptions}
                        rules={[{ required: true, message: "Vui lòng chọn mức độ hư hỏng" }]}
                    />
                </div>

                {/* ==== Nguyên nhân hư hỏng & Loại bảo trì ==== */}
                <div className="grid grid-cols-2 gap-4">
                    <ProFormSelect
                        name="causeId"
                        label="Nguyên nhân hư hỏng (nếu có)"
                        placeholder="Chọn nguyên nhân hư hỏng"
                        showSearch
                        debounceTime={400}
                        request={async ({ keyWords }) => await fetchCauses(keyWords)}
                        options={causeOptions}
                    />

                    <ProFormSelect
                        name="maintenanceTypeActual"
                        label="Loại bảo trì thực tế"
                        placeholder="Chọn loại bảo trì thực tế"
                        options={maintenanceTypeOptions}
                    />
                </div>

                {/* ==== Upload ảnh minh chứng ==== */}
                <ProForm.Item
                    name="attachments"
                    label="Ảnh/Video hiện trường"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e?.fileList}
                >
                    <Upload
                        listType="picture-card"
                        multiple
                        fileList={fileList}
                        onChange={({ fileList: newList }) => setFileList(newList)}
                        beforeUpload={() => false}
                    >
                        {fileList.length >= 3 ? null : (
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Tải ảnh</div>
                            </div>
                        )}
                    </Upload>
                </ProForm.Item>

                {/* ==== Ghi chú ==== */}
                <ProFormTextArea
                    name="note"
                    label="Ghi chú (nếu có)"
                    placeholder="Nhập nội dung ghi chú hoặc mô tả chi tiết tình trạng"
                    fieldProps={{ rows: 4 }}
                />
            </Spin>
        </ModalForm>
    );
};

export default ModalCreateSurvey;
