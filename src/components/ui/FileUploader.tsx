import { useState } from "react";
import { Upload, Modal, Image, Typography, message } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { PlusOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { callUploadMultipleFiles } from "@/config/api";

const { Text } = Typography;

/** ================== CẤU HÌNH ================== */
const UPLOAD_CONFIG = {
    MAX_FILES: 4,
    MAX_IMAGE_SIZE_MB: 10,
    MAX_VIDEO_SIZE_MB: 100,
    ACCEPTED_FORMATS: [
        ".jpg", ".jpeg", ".png", ".gif", ".webp",
        ".mp4", ".mov", ".avi", ".mkv", ".webm",
    ],
    TITLE: "Tải ảnh / video",
};

const getBase64 = (file: File | Blob): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

interface FileUploaderProps {
    folder: string;
    maxFiles?: number;
    onChange?: (files: UploadFile[]) => void;
    title?: string;
}

/** ================== COMPONENT ================== */
const FileUploader = ({
    folder,
    maxFiles = UPLOAD_CONFIG.MAX_FILES,
    onChange,
    title = UPLOAD_CONFIG.TITLE,
}: FileUploaderProps) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewSrc, setPreviewSrc] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");

    /** ================== Preview ================== */
    const handlePreview = async (file: UploadFile) => {
        const src =
            file.url ||
            file.preview ||
            (file.originFileObj ? await getBase64(file.originFileObj) : "");
        setPreviewSrc(src);
        setPreviewTitle(file.name);
        setPreviewOpen(true);
    };

    /** ================== Remove ================== */
    const handleRemove = (file: UploadFile) => {
        setFileList((prev) => {
            const updated = prev.filter((f) => f.uid !== file.uid);
            onChange?.(updated);
            return updated;
        });
        message.info("Đã xóa tệp này.");
    };

    /** ================== Upload Props ================== */
    const uploadProps: UploadProps = {
        listType: "picture-card",
        multiple: true,
        fileList,
        maxCount: maxFiles,
        accept: UPLOAD_CONFIG.ACCEPTED_FORMATS.join(","),

        /** ---- Kiểm tra trước khi upload ---- */
        beforeUpload: (file) => {
            const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(file.name);
            const maxSize = isVideo
                ? UPLOAD_CONFIG.MAX_VIDEO_SIZE_MB
                : UPLOAD_CONFIG.MAX_IMAGE_SIZE_MB;
            const isLtSize = file.size / 1024 / 1024 < maxSize;

            if (!isLtSize) {
                message.error(
                    `Tệp quá lớn! ${isVideo ? "Video" : "Ảnh"} phải nhỏ hơn ${maxSize}MB.`
                );
                return Upload.LIST_IGNORE;
            }

            const ext = file.name.split(".").pop()?.toLowerCase();
            if (!UPLOAD_CONFIG.ACCEPTED_FORMATS.some((f) => f.includes(ext || ""))) {
                message.error("Định dạng tệp không được hỗ trợ!");
                return Upload.LIST_IGNORE;
            }

            return true;
        },

        /** ---- Upload thực tế ---- */
        customRequest: async ({ file, onSuccess, onError }) => {
            try {
                const res = await callUploadMultipleFiles([file as File], folder);
                if (!Array.isArray(res?.data) || res.data.length === 0)
                    throw new Error("Upload thất bại");

                const uploaded = res.data[0].fileName;
                const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(uploaded);

                const newFile: UploadFile = {
                    uid: uuidv4(),
                    name: uploaded,
                    status: "done",
                    url: `${backendURL}/storage/${folder}/${uploaded}`,
                    type: isVideo ? "video" : "image",
                    originFileObj: file as any,
                };

                setFileList((prev) => {
                    const newList = [...prev, newFile].slice(0, maxFiles);
                    onChange?.(newList);
                    return newList;
                });

                onSuccess?.("ok");
                message.success("Tải tệp thành công!");
            } catch (err: any) {
                message.error(err?.message || "Không thể upload tệp");
                onError?.(err);
            }
        },

        onRemove: handleRemove,
        onPreview: handlePreview,
    };

    return (
        <div>
            <div style={{ marginBottom: 8 }}>
                <Text strong>{title}</Text>
            </div>

            <Upload {...uploadProps}>
                {fileList.length >= maxFiles ? null : (
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                )}
            </Upload>

            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
                width={700}
            >
                {/\.(mp4|mov|avi|mkv|webm)$/i.test(previewSrc) ? (
                    <video src={previewSrc} width="100%" controls />
                ) : (
                    <Image alt="preview" src={previewSrc} width="100%" />
                )}
            </Modal>
        </div>
    );
};

export default FileUploader;
