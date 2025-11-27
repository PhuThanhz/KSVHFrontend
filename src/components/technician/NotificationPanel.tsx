import React from "react";

interface Notification {
    id: number;
    title: string;
    content: string;
    time: string;
    type?: "system" | "maintenance" | "reminder";
    read?: boolean;
}

interface IProps {
    onClose: () => void;
}

const NotificationPanel: React.FC<IProps> = ({ onClose }) => {
    const notifications: Notification[] = [
        {
            id: 1,
            title: "Công việc mới được giao",
            content: "Bạn vừa được giao nhiệm vụ khảo sát thiết bị KHU CN A2.",
            time: "2025-11-27T09:30:00",
            type: "maintenance",
        },
        {
            id: 2,
            title: "Cập nhật tiến độ",
            content: "Báo cáo tiến độ thi công dự án B đã được duyệt.",
            time: "2025-11-27T08:10:00",
            type: "system",
        },
        {
            id: 3,
            title: "Nhắc lịch ca làm việc",
            content: "Bạn có ca làm việc chiều nay từ 13:00 đến 17:00.",
            time: "2025-11-27T07:00:00",
            type: "reminder",
        },
    ];

    const getTypeColor = (type?: string) => {
        switch (type) {
            case "system":
                return "bg-blue-100 text-blue-700";
            case "maintenance":
                return "bg-orange-100 text-orange-700";
            case "reminder":
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getTypeLabel = (type?: string) => {
        switch (type) {
            case "system":
                return "Hệ thống";
            case "maintenance":
                return "Bảo trì";
            case "reminder":
                return "Lịch làm việc";
            default:
                return "Khác";
        }
    };

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
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Thông báo</h3>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                >
                    Đóng
                </button>
            </div>

            {/* Content */}
            <div className="max-h-96 sm:max-h-80 md:max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 sm:py-12">
                        <p className="text-gray-400 text-sm">Không có thông báo</p>
                    </div>
                ) : (
                    <div>
                        {notifications.map((item) => (
                            <div
                                key={item.id}
                                className="px-3 sm:px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
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
                                <p className="text-xs sm:text-sm text-gray-600 mb-1">{item.content}</p>
                                <p className="text-xs text-gray-400">
                                    {formatTime(item.time)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;