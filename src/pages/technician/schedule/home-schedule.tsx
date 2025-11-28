import React, { useMemo, useState } from "react";
import {
    Card,
    Typography,
    Space,
    Tag,
    Button,
    Modal,
    Empty,
    Pagination,
    Spin,
    Segmented,
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
import Breadcrumb from "@/components/Breadcrumb";

dayjs.locale("vi");
const { Text, Title } = Typography;

const colorMap: Record<string, string> = {
    AVAILABLE: "#52c41a",
    BUSY: "#faad14",
    OFFLINE: "#ff4d4f",
    ON_LEAVE: "#f5222d",
};

const HomeSchedulePage: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [viewMode, setViewMode] = useState<"month" | "week">("month");
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 100;

    const query = `page=${page}&pageSize=${pageSize}`;
    const { data, isFetching } = useMyTechnicianAvailabilitiesQuery(query);

    const totalShifts = data?.meta?.total || 0;
    const todayStr = dayjs().format("YYYY-MM-DD");
    const todayEvents = useMemo(
        () => data?.result?.filter((i) => i.workDate === todayStr) || [],
        [data]
    );

    /** ==============================
     * Tính toán danh sách ngày theo chế độ (tuần hoặc tháng)
     * ============================== */
    const daysToShow = useMemo(() => {
        const start =
            viewMode === "week"
                ? currentDate.startOf("week")
                : currentDate.startOf("month").startOf("week");
        const end =
            viewMode === "week"
                ? currentDate.endOf("week")
                : currentDate.endOf("month").endOf("week");
        const days: dayjs.Dayjs[] = [];
        for (let d = start; d <= end; d = d.add(1, "day")) days.push(d);
        return days;
    }, [currentDate, viewMode]);

    const getShiftsByDate = (dateStr: string) =>
        data?.result?.filter((i) => i.workDate === dateStr) || [];

    const eventsOfSelectedDate = useMemo(
        () => (selectedDate ? getShiftsByDate(selectedDate) : []),
        [data, selectedDate]
    );

    const handlePrev = () =>
        setCurrentDate(
            viewMode === "week"
                ? currentDate.subtract(1, "week")
                : currentDate.subtract(1, "month")
        );
    const handleNext = () =>
        setCurrentDate(
            viewMode === "week"
                ? currentDate.add(1, "week")
                : currentDate.add(1, "month")
        );
    const goToToday = () => setCurrentDate(dayjs());
    const openDayModal = (date: string) => {
        setSelectedDate(date);
        setOpenModal(true);
    };

    return (
        <div className="p-6 min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Breadcrumb />

            {/* Header */}
            <div className="mb-6">
                <Space direction="vertical" size={2}>
                    <Space>
                        <CalendarOutlined />
                        <Title level={4} style={{ margin: 0 }}>
                            Lịch làm việc của tôi
                        </Title>
                    </Space>
                    <Text type="secondary">
                        Tổng số ca: <strong>{totalShifts}</strong> | Hôm nay:{" "}
                        <strong>{todayEvents.length}</strong>
                    </Text>
                </Space>
            </div>

            {/* SECTION 1: Ca hôm nay */}
            <Card className="mb-8">
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                    <Space>
                        <ClockCircleOutlined />
                        <Text strong>Ca làm việc hôm nay</Text>
                    </Space>
                    <Text type="secondary">{dayjs().format("dddd, DD/MM/YYYY")}</Text>

                    {isFetching ? (
                        <div className="flex justify-center py-8">
                            <Spin />
                        </div>
                    ) : todayEvents.length === 0 ? (
                        <Empty description="Không có ca hôm nay" />
                    ) : (
                        todayEvents.map((item) => (
                            <div
                                key={item.id}
                                className="p-3 rounded-lg border-l-4 shadow-sm"
                                style={{ borderLeftColor: colorMap[item.status || "AVAILABLE"] }}
                            >
                                <Text strong>
                                    {item.shiftTemplate?.name || "Ca làm việc"}
                                </Text>
                                <br />
                                <Text type="secondary">
                                    {dayjs(item.startTime, "HH:mm:ss").format("HH:mm")} -{" "}
                                    {dayjs(item.endTime, "HH:mm:ss").format("HH:mm")}
                                </Text>
                                {item.note && (
                                    <div>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {item.note}
                                        </Text>
                                    </div>
                                )}
                                <Tag
                                    color={colorMap[item.status || "AVAILABLE"]}
                                    style={{ marginTop: 4 }}
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
                        ))
                    )}
                </Space>
            </Card>

            {/* SECTION 2: Lịch làm việc */}
            <Card>
                <Space
                    align="center"
                    className="flex justify-between mb-4"
                    style={{ width: "100%" }}
                >
                    <Space>
                        <Button
                            icon={<LeftOutlined />}
                            size="small"
                            onClick={handlePrev}
                            type="primary"
                            shape="circle"
                        />
                        <Button
                            icon={<RightOutlined />}
                            size="small"
                            onClick={handleNext}
                            type="primary"
                            shape="circle"
                        />
                    </Space>
                    <Space>
                        <Segmented
                            options={[
                                { label: "Tháng", value: "month" },
                                { label: "Tuần", value: "week" },
                            ]}
                            value={viewMode}
                            onChange={(val) => setViewMode(val as "month" | "week")}
                        />
                        <Button type="link" onClick={goToToday}>
                            Hôm nay
                        </Button>
                    </Space>
                </Space>

                {isFetching ? (
                    <div className="flex justify-center py-8">
                        <Spin />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-7 text-center font-medium text-gray-600 mb-2">
                            {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((d) => (
                                <div key={d}>{d}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 text-center text-sm">
                            {daysToShow.map((day, idx) => {
                                const dateStr = day.format("YYYY-MM-DD");
                                const isCurrentMonth = day.month() === currentDate.month();
                                const isToday = dateStr === todayStr;
                                const shifts = getShiftsByDate(dateStr);

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => shifts.length > 0 && openDayModal(dateStr)}
                                        className={`p-1 border border-gray-100 min-h-16 flex flex-col items-center ${isCurrentMonth ? "" : "opacity-40"
                                            } ${isToday ? "bg-blue-50 rounded-md" : ""} ${shifts.length > 0 ? "cursor-pointer hover:bg-gray-50" : ""
                                            }`}
                                    >
                                        <Text
                                            className={`text-xs ${isToday ? "text-blue-600 font-semibold" : ""
                                                }`}
                                        >
                                            {day.date()}
                                        </Text>
                                        {shifts.length > 0 && (
                                            <div className="w-full px-1 mt-1 space-y-0.5">
                                                {shifts.slice(0, 2).map((shift, i) => (
                                                    <div
                                                        key={i}
                                                        className="text-[10px] text-white rounded px-1 truncate"
                                                        style={{
                                                            backgroundColor:
                                                                colorMap[shift.status || "AVAILABLE"],
                                                        }}
                                                    >
                                                        {shift.shiftTemplate?.name || "Ca"}{" "}
                                                        {shift.startTime?.slice(0, 5)}
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

                        {/* Pagination */}
                        {totalShifts > pageSize && (
                            <div className="mt-4 flex justify-center">
                                <Pagination
                                    current={page}
                                    pageSize={pageSize}
                                    total={totalShifts}
                                    onChange={(p) => setPage(p)}
                                    showSizeChanger={false}
                                />
                            </div>
                        )}
                    </>
                )}
            </Card>

            {/* Modal xem chi tiết ngày */}
            <Modal
                open={openModal}
                onCancel={() => setOpenModal(false)}
                footer={null}
                title={
                    <Space>
                        <CalendarOutlined />
                        <Text strong>
                            Ca ngày{" "}
                            {selectedDate ? dayjs(selectedDate).format("DD/MM/YYYY") : ""}
                        </Text>
                    </Space>
                }
            >
                {eventsOfSelectedDate.length === 0 ? (
                    <Empty description="Không có ca nào" />
                ) : (
                    eventsOfSelectedDate.map((item) => (
                        <div
                            key={item.id}
                            className="p-3 rounded-lg border-l-4 mb-2"
                            style={{ borderLeftColor: colorMap[item.status || "AVAILABLE"] }}
                        >
                            <Text strong>{item.shiftTemplate?.name}</Text>
                            <br />
                            <Text type="secondary">
                                {dayjs(item.startTime, "HH:mm:ss").format("HH:mm")} -{" "}
                                {dayjs(item.endTime, "HH:mm:ss").format("HH:mm")}
                            </Text>
                            {item.note && (
                                <div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {item.note}
                                    </Text>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </Modal>
        </div>
    );
};

export default HomeSchedulePage;
