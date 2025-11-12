import {
    ModalForm,
    ProFormSelect,
    ProFormTextArea,
    ProFormText,
    ProFormItem,
} from "@ant-design/pro-components";
import { Form, Upload, Spin, message, Modal, Image } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { isMobile } from "react-device-detect";

import {
    callFetchIssue,
    callFetchMaintenanceSurveyById,
    callFetchMaintenanceCause,
    callUploadMultipleFiles,
} from "@/config/api";
import { useCreateMaintenanceSurveyMutation } from "@/hooks/maintenance/useMaintenanceSurveys";
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
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [loading, setLoading] = useState(false);

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

    /** =================== Fetch dữ liệu phiếu khảo sát =================== */
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

    /** =================== Upload ảnh/video (chung) =================== */
    const uploadProps: UploadProps = {
        listType: "picture-card",
        multiple: true,
        fileList,
        maxCount: 3,
        accept: ".jpg,.jpeg,.png,.gif,.webp,.mp4,.mov,.avi,.mkv,.webm",
        customRequest: async ({ file, onSuccess, onError }: any) => {
            try {
                setLoadingUpload(true);
                const res = await callUploadMultipleFiles([file as File], "survey_attachment");
                if (res?.data && Array.isArray(res.data)) {
                    const newFiles: UploadFile[] = res.data.map((f) => ({
                        uid: uuidv4(),
                        name: f.fileName,
                        status: "done",
                        url: `${backendURL}/storage/survey_attachment/${f.fileName}`,
                    }));
                    setFileList((prev) => [...prev, ...newFiles].slice(0, 3));
                    onSuccess?.("ok");
                } else throw new Error("Upload thất bại");
            } catch (err: any) {
                message.error(err?.message || "Không thể upload file");
                onError?.(err);
            } finally {
                setLoadingUpload(false);
            }
        },
        onRemove: (file) => setFileList((prev) => prev.filter((f) => f.uid !== file.uid)),
        onPreview: async (file) => {
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
        },
    };

    /** =================== Submit =================== */
    const handleSubmit = async (values: IReqMaintenanceSurveyDTO) => {
        if (!maintenanceRequestId) return;

        const files = fileList.map((f) => f.name || "").slice(0, 3);
        const [attachment1, attachment2, attachment3] = files;

        const payload: IReqMaintenanceSurveyDTO = {
            ...values,
            maintenanceRequestId,
            attachment1,
            attachment2,
            attachment3,
        };

        createSurvey(payload, {
            onSuccess: () => {
                message.success("Tạo khảo sát bảo trì thành công");
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
                confirmLoading: isPending || loadingUpload,
                onCancel: () => setOpenModal(false),
                okText: "Lưu khảo sát",
                cancelText: "Hủy",
            }}
        >
            <Spin spinning={loading}>
                <div className="grid grid-cols-2 gap-4">
                    <ProFormText name="requestCode" label="Mã phiếu yêu cầu" readonly />
                    <ProFormText name="deviceName" label="Tên thiết bị" readonly />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <ProFormSelect
                        name="issueId"
                        label="Mô tả tình trạng/vấn đề/sự cố thực tế"
                        showSearch
                        debounceTime={400}
                        request={async ({ keyWords }) => await fetchIssues(keyWords)}
                        options={issueOptions}
                        rules={[{ required: true, message: "Vui lòng chọn vấn đề thực tế" }]}
                    />

                    <ProFormSelect
                        name="damageLevel"
                        label="Mức độ hư hỏng"
                        options={damageLevelOptions}
                        rules={[{ required: true, message: "Vui lòng chọn mức độ hư hỏng" }]}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <ProFormSelect
                        name="causeId"
                        label="Nguyên nhân hư hỏng (nếu có)"
                        showSearch
                        debounceTime={400}
                        request={async ({ keyWords }) => await fetchCauses(keyWords)}
                        options={causeOptions}
                    />

                    <ProFormSelect
                        name="maintenanceTypeActual"
                        label="Loại bảo trì thực tế"
                        options={maintenanceTypeOptions}
                    />
                </div>

                <ProFormItem label="Ảnh/Video hiện trường (tối đa 3)">
                    <Upload {...uploadProps}>
                        {fileList.length >= 3 ? null : (
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Tải lên</div>
                            </div>
                        )}
                    </Upload>
                    {fileList.map(
                        (file) =>
                            file.url &&
                            file.name.match(/\.(mp4|mov|avi|mkv|webm)$/i) && (
                                <video
                                    key={file.uid}
                                    src={file.url}
                                    style={{ width: "100%", marginTop: 8, borderRadius: 6 }}
                                    controls
                                />
                            )
                    )}
                </ProFormItem>

                <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={() => setPreviewOpen(false)}
                >
                    <Image alt="preview" src={previewImage} width="100%" />
                </Modal>

                <ProFormTextArea
                    name="note"
                    label="Ghi chú (nếu có)"
                    placeholder="Nhập mô tả hoặc ghi chú chi tiết"
                    fieldProps={{ rows: 4 }}
                />
            </Spin>
        </ModalForm>
    );
};

export default ModalCreateSurvey;
