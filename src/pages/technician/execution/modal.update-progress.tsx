import {
    ModalForm,
    ProFormSlider,
    ProFormTextArea,
    ProFormItem,
} from "@ant-design/pro-components";
import { Form, Spin, Row, Col, Upload, message, Modal, Image } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useExecutionDetailQuery, useUpdateExecutionProgressMutation } from "@/hooks/maintenance/useMaintenanceExecutions";
import { callUploadMultipleFiles } from "@/config/api";
import { v4 as uuidv4 } from "uuid";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import type { IReqUpdateProgressDTO } from "@/types/backend";

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
    requestId?: string | null;
}

/** ===================== Modal Cập Nhật Tiến Độ Thi Công ===================== */
const ModalUpdateProgress = ({ open, onClose, requestId }: IProps) => {
    const [form] = Form.useForm<IReqUpdateProgressDTO>();
    const { data, isFetching } = useExecutionDetailQuery(requestId || undefined);
    const { mutate: updateProgress, isPending } = useUpdateExecutionProgressMutation();

    const [imageList, setImageList] = useState<UploadFile[]>([]);
    const [videoList, setVideoList] = useState<UploadFile[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [loadingUpload, setLoadingUpload] = useState(false);

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    /** Prefill dữ liệu */
    useEffect(() => {
        if (data?.progress) {
            form.setFieldsValue({
                progressPercent: data.progress.progressPercent ?? 0,
                note: data.progress.currentNote ?? "",
            });
        }
    }, [data]);

    /** Preview ảnh */
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

    /** Upload ảnh */
    const uploadImageProps: UploadProps = {
        listType: "picture-card",
        multiple: true,
        fileList: imageList,
        maxCount: 3,
        accept: ".jpg,.jpeg,.png,.gif,.webp",
        customRequest: async ({ file, onSuccess, onError }: any) => {
            try {
                setLoadingUpload(true);
                const res = await callUploadMultipleFiles([file as File], "execution_progress");
                if (res?.data && Array.isArray(res.data)) {
                    const newFiles: UploadFile[] = res.data.map((f) => ({
                        uid: uuidv4(),
                        name: f.fileName,
                        status: "done",
                        url: `${backendURL}/storage/execution_progress/${f.fileName}`,
                    }));
                    setImageList((prev) => [...prev, ...newFiles].slice(0, 3));
                    onSuccess?.("ok");
                } else throw new Error("Upload thất bại");
            } catch (err: any) {
                message.error(err?.message || "Không thể upload ảnh");
                onError?.(err);
            } finally {
                setLoadingUpload(false);
            }
        },
        onRemove: (file) => setImageList((prev) => prev.filter((f) => f.uid !== file.uid)),
        onPreview: handlePreview,
    };

    /** Upload video */
    const uploadVideoProps: UploadProps = {
        listType: "text", // kiểu hiển thị gọn hơn
        fileList: videoList,
        maxCount: 1,
        accept: ".mp4,.mov,.avi,.mkv,.webm",
        customRequest: async ({ file, onSuccess, onError }: any) => {
            try {
                setLoadingUpload(true);
                const res = await callUploadMultipleFiles([file as File], "execution_progress");
                if (res?.data && Array.isArray(res.data)) {
                    const newFile = res.data[0];
                    const newVideo: UploadFile = {
                        uid: uuidv4(),
                        name: newFile.fileName,
                        status: "done",
                        url: `${backendURL}/storage/execution_progress/${newFile.fileName}`,
                    };
                    setVideoList([newVideo]);
                    onSuccess?.("ok");
                } else throw new Error("Upload thất bại");
            } catch (err: any) {
                message.error(err?.message || "Không thể upload video");
                onError?.(err);
            } finally {
                setLoadingUpload(false);
            }
        },
        onRemove: () => setVideoList([]),
    };

    /** Submit handler */
    const handleSubmit = async (values: IReqUpdateProgressDTO) => {
        if (!requestId) return;

        const images = imageList.map((f) => f.name || "").slice(0, 3);
        const [image1, image2, image3] = images;
        const video = videoList[0]?.name || null;

        const payload: IReqUpdateProgressDTO = {
            ...values,
            image1,
            image2,
            image3,
            video,
        };

        updateProgress(
            { id: requestId, payload },
            {
                onSuccess: () => {
                    message.success("Cập nhật tiến độ thành công");
                    form.resetFields();
                    setImageList([]);
                    setVideoList([]);
                    onClose(false);
                },
            }
        );
    };

    return (
        <ModalForm<IReqUpdateProgressDTO>
            open={open}
            form={form}
            title="Cập nhật tiến độ thi công"
            onFinish={handleSubmit}
            layout="vertical"
            modalProps={{
                destroyOnClose: true,
                maskClosable: false,
                confirmLoading: isPending || loadingUpload,
                onCancel: () => onClose(false),
                okText: "Lưu cập nhật",
                cancelText: "Hủy",
            }}
        >
            <Spin spinning={isFetching}>
                <ProFormSlider
                    name="progressPercent"
                    label="Tiến độ (%)"
                    min={0}
                    max={100}
                    rules={[{ required: true, message: "Vui lòng chọn phần trăm tiến độ" }]}
                />

                <ProFormTextArea
                    name="note"
                    label="Ghi chú"
                    placeholder="Nhập mô tả hoặc tình trạng công việc"
                    fieldProps={{ rows: 3 }}
                />

                <Row gutter={16}>
                    <Col span={16}>
                        <ProFormItem label="Ảnh (tối đa 3)">
                            <Upload {...uploadImageProps}>
                                {imageList.length >= 3 ? null : (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Tải ảnh</div>
                                    </div>
                                )}
                            </Upload>
                        </ProFormItem>
                    </Col>

                    <Col span={8}>
                        <ProFormItem label="Video (1)">
                            <Upload {...uploadVideoProps}>
                                {videoList.length >= 1 ? null : (
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>Tải video</div>
                                    </div>
                                )}
                            </Upload>
                            {videoList.length > 0 && (
                                <video
                                    src={videoList[0].url}
                                    style={{ width: "100%", marginTop: 8, borderRadius: 6 }}
                                    controls
                                />
                            )}
                        </ProFormItem>
                    </Col>
                </Row>

                <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={() => setPreviewOpen(false)}
                >
                    <Image alt="preview" src={previewImage} width="100%" />
                </Modal>
            </Spin>
        </ModalForm>
    );
};

export default ModalUpdateProgress;
