import { Modal } from "antd";
import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
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

    /** Dừng camera */
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        scanningRef.current = false;
    };

    /** Khởi động camera và quét mã */
    useEffect(() => {
        if (!open) {
            stopCamera();
            return;
        }

        const startScanner = async () => {
            try {
                readerRef.current = new BrowserMultiFormatReader();
                streamRef.current = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = streamRef.current;
                    await videoRef.current.play();
                }

                scanningRef.current = true;

                readerRef.current.decodeFromVideoElement(videoRef.current!, (result) => {
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
            footer={null}
            centered
            width={400}
            bodyStyle={{ padding: 0, borderRadius: 12, overflow: "hidden" }}
        >
            <div className="relative w-full h-[320px] bg-black overflow-hidden rounded-md">
                {/* Luồng camera */}
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover rounded-md opacity-90"
                    playsInline
                />

                {/* Viền khung quét */}
                <div className="absolute inset-6 border-2 border-gray-300 rounded-md shadow-[0_0_10px_rgba(255,255,255,0.2)]" />

                {/* Thanh quét đen mờ */}
                <div className="absolute left-6 right-6 h-[3px] bg-gradient-to-r from-black/60 via-black to-black/60 animate-scan" />
            </div>

            <style>{`
                @keyframes scanLine {
                    0% { top: 6px; opacity: 0.6; }
                    50% { top: calc(100% - 6px); opacity: 0.9; }
                    100% { top: 6px; opacity: 0.6; }
                }
                .animate-scan {
                    position: absolute;
                    animation: scanLine 2.8s ease-in-out infinite;
                }
            `}</style>
        </Modal>
    );
};

export default ScannerModal;
