import { Modal } from "antd";
import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader, } from "@zxing/browser";
import { useNavigate } from "react-router-dom";

interface IProps {
    open: boolean;
    onClose: () => void;
}

const ScannerModal: React.FC<IProps> = ({ open, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const readerRef = useRef<BrowserMultiFormatReader | null>(null);
    const scanningRef = useRef(false);

    const navigate = useNavigate();

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        scanningRef.current = false;
    };

    useEffect(() => {
        if (!open) {
            stopCamera();
            return;
        }

        const startScanner = async () => {
            try {
                // Tạo reader không cần DecodeHintType
                readerRef.current = new BrowserMultiFormatReader();

                // Mở camera
                streamRef.current = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = streamRef.current;
                    await videoRef.current.play();
                }

                scanningRef.current = true;

                readerRef.current.decodeFromVideoElement(videoRef.current!, (result, err) => {
                    if (!scanningRef.current) return;

                    if (result) {
                        scanningRef.current = false;
                        stopCamera();

                        const code = result.getText().trim();

                        onClose();
                        navigate(`/scan-result/${code}`);
                    }
                });

            } catch (err) {
                console.error("Camera error:", err);
            }
        };

        startScanner();

        return () => stopCamera();
    }, [open]);

    return (
        <Modal
            title="Quét mã thiết bị"
            open={open}
            onCancel={() => {
                stopCamera();
                onClose();
            }}
            width={420}
            footer={null}
        >
            <video
                ref={videoRef}
                style={{
                    width: "100%",
                    borderRadius: 8,
                    background: "#000",
                    border: "1px solid #ccc",
                }}
            />
        </Modal>
    );
};

export default ScannerModal;
