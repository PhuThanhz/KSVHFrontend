import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    callFetchMyNotifications,
    callMarkNotificationAsRead,
} from "@/config/api";
import type { INotification, IModelPaginate } from "@/types/backend";

interface IProps {
    onClose: () => void;
}

const NotificationPanel: React.FC<IProps> = ({ onClose }) => {
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    /** Gọi API danh sách thông báo */
    const fetchNotifications = async (nextPage = 0) => {
        try {
            setLoading(true);
            const res = await callFetchMyNotifications(
                `page=${nextPage}&size=10&sort=createdAt,desc`
            );
            const data = res.data as IModelPaginate<INotification>;

            if (data) {
                if (nextPage === 0) {
                    setNotifications(data.result);
                } else {
                    setNotifications((prev) => [...prev, ...data.result]);
                }
                setPage(data.meta.page - 1);
                setTotalPages(data.meta.pages);
            }
        } catch (err) {
            console.error("Lỗi khi tải thông báo:", err);
        } finally {
            setLoading(false);
        }
    };

    /** Khi click thông báo */
    const handleNotificationClick = async (item: INotification) => {
        try {
            // Đánh dấu đã đọc
            if (!item.read) {
                await callMarkNotificationAsRead(item.id);
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.id === item.id ? { ...n, read: true } : n
                    )
                );
            }

            // ✅ Tất cả loại thông báo đều điều hướng đến trang thực hiện
            navigate("/technician/execution");
            onClose();
        } catch (err) {
            console.error("Lỗi khi đánh dấu đã đọc:", err);
        }
    };

    useEffect(() => {
        fetchNotifications(0);
    }, []);

    /** Màu sắc theo loại thông báo */
    const getTypeColor = (type?: string) => {
        switch (type) {
            case "REQUEST_ASSIGNED":
                return "bg-orange-100 text-orange-700";
            case "PLAN_APPROVED":
                return "bg-green-100 text-green-700";
            case "PLAN_REJECTED":
                return "bg-red-100 text-red-700";
            case "ACCEPTANCE_APPROVED":
                return "bg-teal-100 text-teal-700";
            case "ACCEPTANCE_REJECTED":
                return "bg-pink-100 text-pink-700";
            default:
                return "bg-blue-100 text-blue-700";
        }
    };

    /** Nhãn hiển thị cho loại thông báo */
    const getTypeLabel = (type?: string) => {
        switch (type) {
            case "REQUEST_ASSIGNED":
                return "Phân công";
            case "PLAN_APPROVED":
                return "Phê duyệt kế hoạch";
            case "PLAN_REJECTED":
                return "Từ chối kế hoạch";
            case "ACCEPTANCE_APPROVED":
                return "Đã nghiệm thu";
            case "ACCEPTANCE_REJECTED":
                return "Từ chối nghiệm thu";
            default:
                return "Khác";
        }
    };

    /** Định dạng thời gian hiển thị */
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${hours}:${minutes}, ${day}/${month}/${year}`;
    };

    return (
        <div className="fixed top-20 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white shadow-xl rounded-lg border border-gray-200 z-50 overflow-hidden sm:w-80 md:w-96">
            {/* Header */}
            <div className="flex justify-between items-center px-3 sm:px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-white">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    Thông báo
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                >
                    Đóng
                </button>
            </div>

            {/* Content */}
            <div className="max-h-96 sm:max-h-80 md:max-h-96 overflow-y-auto">
                {loading && notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 sm:py-12">
                        <p className="text-gray-400 text-sm">Đang tải...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 sm:py-12">
                        <p className="text-gray-400 text-sm">
                            Không có thông báo
                        </p>
                    </div>
                ) : (
                    <div>
                        {notifications.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => handleNotificationClick(item)}
                                className={`px-3 sm:px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${!item.read ? "bg-orange-50" : "bg-white"
                                    }`}
                            >
                                <div className="flex justify-between items-start gap-2 mb-1">
                                    <h4 className="font-medium text-gray-800 text-sm sm:text-base flex-1">
                                        {item.title}
                                    </h4>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${getTypeColor(
                                            item.type
                                        )}`}
                                    >
                                        {getTypeLabel(item.type)}
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                                    {item.message}
                                </p>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-gray-400">
                                        {formatTime(item.createdAt)}
                                    </p>
                                    <span
                                        className={`text-[11px] font-medium ${item.read
                                            ? "text-green-600"
                                            : "text-red-500"
                                            }`}
                                    >
                                        {item.read ? "Đã xem" : "Chưa xem"}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Nút xem thêm */}
                        {page + 1 < totalPages && (
                            <div className="flex justify-center py-3">
                                <button
                                    onClick={() => fetchNotifications(page + 1)}
                                    className="text-blue-600 text-sm font-medium hover:underline disabled:text-gray-400"
                                    disabled={loading}
                                >
                                    {loading ? "Đang tải..." : "Xem thêm"}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;
