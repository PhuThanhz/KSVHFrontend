import { useState } from "react";
import { Modal, Card } from "antd";
import { PlayCircleOutlined, CloseOutlined } from "@ant-design/icons";

interface VideoPopupProps {
    videoUrl: string;
    thumbnail?: string;
    width?: number;
    height?: number;
}


const VideoPopup = ({
    videoUrl,
    thumbnail,
    width = 260,
    height = 160,
}: VideoPopupProps) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Card
                hoverable
                style={{
                    width,
                    borderRadius: 8,
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    padding: 0,
                }}
                bodyStyle={{ padding: 0 }}
                onClick={() => setOpen(true)}
                cover={
                    <div style={{ position: "relative" }}>
                        <img
                            src={
                                thumbnail ||
                                "https://cdn-icons-png.flaticon.com/512/709/709579.png"
                            }
                            alt="Video thumbnail"
                            style={{
                                width: "100%",
                                height,
                                objectFit: "cover",
                                display: "block",
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                background: "rgba(0, 0, 0, 0.55)",
                                borderRadius: "50%",
                                width: 60,
                                height: 60,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                transition: "all 0.3s ease",
                            }}
                        >
                            <PlayCircleOutlined style={{ fontSize: 36, color: "#fff" }} />
                        </div>
                    </div>
                }
            />

            {/* Popup xem video */}
            <Modal
                open={open}
                footer={null}
                centered
                closable={false}
                onCancel={() => setOpen(false)}
                width={900}
                bodyStyle={{
                    padding: 0,
                    background: "#000",
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                }}
            >
                {/* Nút X tùy chỉnh */}
                <div
                    onClick={() => setOpen(false)}
                    style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        zIndex: 20,
                        background: "rgba(255,255,255,0.85)",
                        borderRadius: "50%",
                        width: 36,
                        height: 36,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                        transition: "all 0.2s",
                    }}
                >
                    <CloseOutlined style={{ fontSize: 18, color: "#000" }} />
                </div>

                <video
                    src={videoUrl}
                    controls
                    autoPlay
                    style={{
                        width: "100%",
                        maxHeight: "80vh",
                        borderRadius: 8,
                        background: "#000",
                        display: "block",
                    }}
                />
            </Modal>
        </>
    );
};

export default VideoPopup;
