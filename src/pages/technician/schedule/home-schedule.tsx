// src/pages/technician/HomeSchedulePage.tsx
import React, { useMemo, useState } from "react";
import {
    Card,
    Typography,
    Space,
    Tag,
    Button,
    Modal,
    Empty,
} from "antd";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    LeftOutlined,
    RightOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useMyTechnicianAvailabilitiesQuery } from "@/hooks/useTechnicianAvailability";
import type { ITechnicianAvailability } from "@/types/backend";

dayjs.locale("vi");
const { Text, Title } = Typography;

const colorMap: Record<string, string> = {
    AVAILABLE: "#52c41a",
    BUSY: "#faad14",
    OFFLINE: "#ff4d4f",
    ON_LEAVE: "#f5222d",
};

const HomeSchedulePage: React.FC = () => {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);

    const query = "page=1&pageSize=200";
    const { data, isFetching } = useMyTechnicianAvailabilitiesQuery(query);

    // Tổng ca + ca hôm nay
    const totalShifts = data?.meta?.total || 0;
    const todayStr = dayjs().format("YYYY-MM-DD");
    const todayEvents = useMemo(() => {
        return data?.result?.filter((i) => i.workDate === todayStr) || [];
    }, [data]);

    // Tạo danh sách ngày trong tháng (6 tuần)
    const daysInMonth = useMemo(() => {
        const start = currentMonth.startOf("month").startOf("week");
        const end = currentMonth.endOf("month").endOf("week");
        const days: dayjs.Dayjs[] = [];
        let day = start;
        while (day <= end) {
            days.push(day);
            day = day.add(1, "day");
        }
        return days;
    }, [currentMonth]);

    // Lấy ca theo ngày
    const getShiftsByDate = (dateStr: string) => {
        return data?.result?.filter((i) => i.workDate === dateStr) || [];
    };

    const eventsOfSelectedDate = useMemo(() => {
        if (!selectedDate) return [];
        return getShiftsByDate(selectedDate);
    }, [data, selectedDate]);

    const handlePrev = () => setCurrentMonth(currentMonth.subtract(1, "month"));
    const handleNext = () => setCurrentMonth(currentMonth.add(1, "month"));
    const goToToday = () => setCurrentMonth(dayjs());

    const openDayModal = (date: string) => {
        setSelectedDate(date);
        setOpenModal(true);
    };

    return (
        <div className="px-4 py-5 pb-24 bg-gradient-to-b from-pink-50 to-white min-h-screen sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                    <CalendarOutlined className="text-lg sm:text-xl" />
                    <Title level={4} className="m-0 text-lg sm:text-xl font-bold">Lịch làm việc của tôi</Title>
                </div>
                <Text type="secondary" className="text-xs sm:text-sm">
                    Tổng số ca: <strong>{totalShifts}</strong> | Hôm nay: <strong>{todayEvents.length}</strong>
                </Text>
            </div>

            {/* ==================== SECTION 1: CA HÔM NAY ==================== */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-3 text-gray-700">
                    <ClockCircleOutlined className="text-base sm:text-lg text-blue-600" />
                    <Title level={5} className="m-0 text-base sm:text-lg font-semibold">
                        Ca làm việc hôm nay
                    </Title>
                </div>

                <Card className="shadow-sm rounded-2xl">
                    <Text type="secondary" className="block mb-3 text-xs sm:text-sm text-gray-600">
                        {dayjs().format("dddd, DD/MM/YYYY")}
                    </Text>

                    {todayEvents.length === 0 ? (
                        <Empty
                            description="Không có ca hôm nay"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            className="py-6"
                        />
                    ) : (
                        <div className="space-y-3">
                            {todayEvents.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border-l-4 shadow-sm"
                                    style={{ borderLeftColor: colorMap[item.status || "AVAILABLE"] }}
                                >
                                    <Text strong className="block text-sm sm:text-base">
                                        {item.shiftTemplate?.name || "Ca làm việc"}
                                    </Text>
                                    <Text className="text-xs sm:text-sm text-gray-600">
                                        {dayjs(item.startTime, "HH:mm:ss").format("HH:mm")} -{" "}
                                        {dayjs(item.endTime, "HH:mm:ss").format("HH:mm")}
                                    </Text>
                                    {item.note && (
                                        <Text className="block text-xs text-gray-500 mt-1">
                                            {item.note}
                                        </Text>
                                    )}
                                    <Tag
                                        color={colorMap[item.status || "AVAILABLE"]}
                                        className="mt-2 text-xs"
                                    >
                                        {item.status === "AVAILABLE"
                                            ? "Rảnh"
                                            : item.status === "BUSY"
                                                ? "Bận"
                                                : item.status === "ON_LEAVE"
                                                    ? "Nghỉ"
                                                    : "Ngoại tuyến"}
                                    </Tag>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            {/* ==================== SECTION 2: LỊCH LÀM VIỆC ==================== */}
            <div>
                <div className="flex items-center gap-2 mb-3 text-gray-700">
                    <CalendarOutlined className="text-base sm:text-lg text-indigo-600" />
                    <Title level={5} className="m-0 text-base sm:text-lg font-semibold">
                        Lịch làm việc tháng {currentMonth.format("MM/YYYY")}
                    </Title>
                </div>

                <Card className="shadow-sm rounded-2xl overflow-hidden">
                    <div className="p-3 sm:p-4">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex gap-2">
                                <Button
                                    size="small"
                                    icon={<LeftOutlined />}
                                    onClick={handlePrev}
                                    className="w-9 h-9 rounded-full bg-blue-500 text-white border-0 shadow-md flex items-center justify-center"
                                />
                                <Button
                                    size="small"
                                    icon={<RightOutlined />}
                                    onClick={handleNext}
                                    className="w-9 h-9 rounded-full bg-blue-500 text-white border-0 shadow-md flex items-center justify-center"
                                />
                            </div>

                            <Button
                                type="link"
                                size="small"
                                onClick={goToToday}
                                className="text-blue-500 font-medium text-sm px-3 py-1 bg-blue-50 rounded-full"
                            >
                                Hôm nay
                            </Button>
                        </div>

                        {/* Calendar Grid */}
                        <div className="overflow-x-auto scrollbar-hide">
                            <div className="min-w-[320px] sm:min-w-[360px]">
                                {/* Header: CN, T2... */}
                                <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-600 mb-2">
                                    {["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"].map((d) => (
                                        <div key={d} className="py-2">
                                            {d}
                                        </div>
                                    ))}
                                </div>

                                {/* Days */}
                                <div className="grid grid-cols-7 text-center text-sm">
                                    {daysInMonth.map((day, idx) => {
                                        const dateStr = day.format("YYYY-MM-DD");
                                        const isCurrentMonth = day.month() === currentMonth.month();
                                        const isToday = dateStr === todayStr;
                                        const shifts = getShiftsByDate(dateStr);

                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => shifts.length > 0 && openDayModal(dateStr)}
                                                className={`
                                                    min-h-12 p-1 border border-gray-100 
                                                    flex flex-col items-center justify-start transition-all
                                                    ${isCurrentMonth ? "" : "opacity-30"}
                                                    ${isToday ? "bg-blue-50 rounded-lg" : ""}
                                                    ${shifts.length > 0 ? "cursor-pointer hover:bg-gray-50" : ""}
                                                `}
                                            >
                                                <Text
                                                    className={`
                                                        text-xs font-medium
                                                        ${isToday ? "text-blue-600 font-bold" : "text-gray-700"}
                                                    `}
                                                >
                                                    {day.date()}
                                                </Text>
                                                {shifts.length > 0 && (
                                                    <div className="mt-1 space-y-0.5 w-full px-1">
                                                        {shifts.slice(0, 2).map((shift, i) => (
                                                            <div
                                                                key={i}
                                                                className="text-[10px] text-white rounded px-1 truncate font-medium leading-tight"
                                                                style={{
                                                                    backgroundColor: colorMap[shift.status || "AVAILABLE"],
                                                                }}
                                                            >
                                                                {shift.shiftTemplate?.name || "Ca"} {shift.startTime?.slice(0, 5)}
                                                            </div>
                                                        ))}
                                                        {shifts.length > 2 && (
                                                            <Text className="text-[9px] text-gray-500">
                                                                +{shifts.length - 2}
                                                            </Text>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Modal */}
            <Modal
                open={openModal}
                onCancel={() => setOpenModal(false)}
                footer={null}
                title={
                    <Space>
                        <CalendarOutlined />
                        <Text strong className="text-base">
                            Ca ngày {selectedDate ? dayjs(selectedDate).format("DD/MM/YYYY") : ""}
                        </Text>
                    </Space>
                }
                width={360}
            >
                {eventsOfSelectedDate.length === 0 ? (
                    <Empty description="Không có ca nào" />
                ) : (
                    <div className="space-y-3">
                        {eventsOfSelectedDate.map((item) => (
                            <div
                                key={item.id}
                                className="bg-gray-50 rounded-xl p-3 border-l-4"
                                style={{ borderLeftColor: colorMap[item.status || "AVAILABLE"] }}
                            >
                                <Text strong className="block text-sm">
                                    {item.shiftTemplate?.name}
                                </Text>
                                <Text className="text-sm text-gray-600">
                                    {dayjs(item.startTime, "HH:mm:ss").format("HH:mm")} -{" "}
                                    {dayjs(item.endTime, "HH:mm:ss").format("HH:mm")}
                                </Text>
                                {item.note && (
                                    <Text className="block text-xs text-gray-500 mt-1">
                                        {item.note}
                                    </Text>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </Modal>

            {/* CSS Scoped */}
            <div
                dangerouslySetInnerHTML={{
                    __html: `
                        <style>
                            .scrollbar-hide {
                                -ms-overflow-style: none;
                                scrollbar-width: none;
                            }
                            .scrollbar-hide::-webkit-scrollbar {
                                display: none;
                            }
                        </style>
                    `,
                }}
            />
        </div>
    );
};

export default HomeSchedulePage;