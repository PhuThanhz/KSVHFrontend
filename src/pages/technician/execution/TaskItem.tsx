import { useState, useEffect } from "react";
import {
    Card,
    Checkbox,
    Input,
    Upload,
    Row,
    Col,
    Button,
    message,
    Image,
    Modal,
    Divider,
    Tag,
    Space
} from "antd";

import { PlusOutlined, UploadOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";

import type { IResExecutionTaskDTO, IReqUpdateTaskDTO } from "@/types/backend";
import { callUploadMultipleFiles } from "@/config/api";
import { useUpdateExecutionTaskMutation } from "@/hooks/maintenance/useMaintenanceExecutions";

interface Props {
    task: IResExecutionTaskDTO;
    onUpdated: () => void;
}

const TaskItem = ({ task, onUpdated }: Props) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const [note, setNote] = useState("");
    const [done, setDone] = useState(false);

    const [imageList, setImageList] = useState<UploadFile[]>([]);
    const [videoList, setVideoList] = useState<UploadFile[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");

    const { mutate: updateTask, isPending } = useUpdateExecutionTaskMutation();

    // ============================================================
    // PREFILL TASK DATA MỖI KHI BACKEND TRẢ VỀ DỮ LIỆU MỚI
    // ============================================================
    useEffect(() => {
        setNote(task.note || "");
        setDone(task.done || false);

        const imgs = [task.image1, task.image2, task.image3].filter(Boolean);

        setImageList(
            imgs.map((img) => ({
                uid: uuidv4(),
                name: img!,
                status: "done",
                url: `${backendURL}/storage/execution_task/${img}`
            }))
        );

        if (task.video) {
            setVideoList([
                {
                    uid: uuidv4(),
                    name: task.video,
                    status: "done",
                    url: `${backendURL}/storage/execution_task/${task.video}`
                }
            ]);
        } else {
            setVideoList([]);
        }
    }, [task]);

    // ============================================================
    // PREVIEW
    // ============================================================
    const handlePreview = async (file: UploadFile) => {
        setPreviewImage(file.url || (file.preview as string));
        setPreviewTitle(file.name);
        setPreviewOpen(true);
    };

    // ============================================================
    // UPLOAD IMAGE
    // ============================================================
    const uploadImageProps: UploadProps = {
        listType: "picture-card",
        fileList: imageList,
        maxCount: 3,
        accept: ".jpg,.jpeg,.png,.webp,.gif",
        onPreview: handlePreview,

        customRequest: async ({ file, onSuccess, onError }: any) => {
            try {
                const res = await callUploadMultipleFiles([file as File], "execution_task");
                if (!res?.data) throw new Error("Upload thất bại");

                const f = res.data[0];
                const newFile: UploadFile = {
                    uid: uuidv4(),
                    name: f.fileName,
                    status: "done",
                    url: `${backendURL}/storage/execution_task/${f.fileName}`
                };

                setImageList((prev) => [...prev, newFile].slice(0, 3));
                onSuccess("ok");
            } catch (err) {
                message.error("Upload ảnh thất bại");
                onError(err);
            }
        },

        onRemove: (file) => {
            setImageList((prev) => prev.filter((f) => f.uid !== file.uid));
        }
    };

    // ============================================================
    // UPLOAD VIDEO
    // ============================================================
    const uploadVideoProps: UploadProps = {
        listType: "text",
        maxCount: 1,
        fileList: videoList,
        accept: ".mp4,.mov,.avi,.mkv,.webm",

        customRequest: async ({ file, onSuccess, onError }: any) => {
            try {
                const res = await callUploadMultipleFiles([file as File], "execution_task");
                if (!res?.data) throw new Error("Upload thất bại");

                const f = res.data[0];

                const newVideo: UploadFile = {
                    uid: uuidv4(),
                    name: f.fileName,
                    status: "done",
                    url: `${backendURL}/storage/execution_task/${f.fileName}`
                };

                setVideoList([newVideo]);
                onSuccess("ok");
            } catch (err) {
                message.error("Upload video thất bại");
                onError(err);
            }
        },

        onRemove: () => {
            setVideoList([]);
        }
    };

    // ============================================================
    // SAVE TASK
    // ============================================================
    const handleSave = () => {
        const images = imageList.map((f) => f.name);

        const payload: IReqUpdateTaskDTO = {
            done,
            note,
            image1: images[0] || null,
            image2: images[1] || null,
            image3: images[2] || null,
            video: videoList[0]?.name || null
        };

        updateTask(
            { taskId: task.id, payload },
            {
                onSuccess: () => {
                    message.success("Đã lưu task");
                    onUpdated();
                }
            }
        );
    };

    // ============================================================
    return (
        <Card style={{ marginBottom: 14, borderRadius: 10, background: "#f8f8f8" }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
                <Row align="middle">
                    <Checkbox checked={done} onChange={(e) => setDone(e.target.checked)} />
                    <span style={{ marginLeft: 10, fontWeight: 600 }}>{task.content}</span>
                </Row>

                <Space>
                    {done && (
                        <Tag
                            icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                            color="success"
                        >
                            Hoàn thành
                        </Tag>
                    )}
                    {note.trim() && <Tag color="blue">Đã ghi chú</Tag>}
                    {imageList.length > 0 && <Tag color="purple">Có ảnh</Tag>}
                    {videoList.length > 0 && <Tag color="orange">Có video</Tag>}
                </Space>
            </Row>

            <Input.TextArea
                rows={2}
                placeholder="Ghi chú công việc..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />

            <Divider />

            <Row gutter={16}>
                <Col span={16}>
                    <Upload {...uploadImageProps}>
                        {imageList.length >= 3 ? null : (
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Tải ảnh</div>
                            </div>
                        )}
                    </Upload>
                </Col>

                <Col span={8}>
                    <Upload {...uploadVideoProps}>
                        {videoList.length >= 1 ? null : (
                            <Button icon={<UploadOutlined />}>Tải video</Button>
                        )}
                    </Upload>

                    {videoList.length > 0 && (
                        <video
                            style={{ width: "100%", marginTop: 10, borderRadius: 6 }}
                            src={videoList[0].url}
                            controls
                        />
                    )}
                </Col>
            </Row>

            <Button
                type="primary"
                block
                style={{ marginTop: 10 }}
                loading={isPending}
                onClick={handleSave}
            >
                Lưu cập nhật
            </Button>

            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
            >
                <Image src={previewImage} width="100%" />
            </Modal>
        </Card>
    );
};

export default TaskItem;
