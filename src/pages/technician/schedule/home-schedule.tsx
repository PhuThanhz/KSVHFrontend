import React, { useMemo, useState } from "react";
import {
    Card,
    Row,
    Col,
    Typography,
    Badge,
    Space,
    Empty,
    Modal,
    Tag,
    Button,
} from "antd";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
} from "@ant-design/icons";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useMyTechnicianAvailabilitiesQuery } from "@/hooks/useTechnicianAvailability";
import type { ITechnicianAvailability } from "@/types/backend";

dayjs.locale("vi");
const { Text, Title } = Typography;

const colorMap: Record<string, string> = {
    AVAILABLE: "green",
    BUSY: "orange",
    OFFLINE: "volcano",
    ON_LEAVE: "red",
};

const HomeSchedulePage: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);

    const query = "page=1&pageSize=200";
    const { data, isFetching } = useMyTechnicianAvailabilitiesQuery(query);

    /** Chuyển đổi dữ liệu sang event cho FullCalendar */
    const events = useMemo(() => {
        if (!data?.result) return [];
        return data.result.map((item: ITechnicianAvailability) => ({
            id: item.id,
            title: item.shiftTemplate?.name || "Ca làm việc",
            start: `${item.workDate}T${item.startTime}`,
            end: `${item.workDate}T${item.endTime}`,
            backgroundColor: colorMap[item.status || "AVAILABLE"] || "#1890ff",
            borderColor: colorMap[item.status || "AVAILABLE"] || "#1890ff",
            textColor: "#fff",
            extendedProps: item,
        }));
    }, [data]);

    /** Lấy ca hôm nay */
    const todayEvents = useMemo(() => {
        const today = dayjs().format("YYYY-MM-DD");
        return data?.result?.filter((i) => i.workDate === today) || [];
    }, [data]);

    const handleDateClick = (arg: any) => {
        setSelectedDate(arg.dateStr);
        setOpenModal(true);
    };

    const eventsOfSelectedDate = useMemo(() => {
        if (!selectedDate) return [];
        return data?.result?.filter((i) => i.workDate === selectedDate) || [];
    }, [data, selectedDate]);

    return (
        <div style={{ padding: 20, background: "#f0f2f5", minHeight: "100vh" }}>
            <Row gutter={[16, 16]}>
                {/* Header */}
                <Col span={24}>
                    <Card>
                        <Title level={3}>
                            <CalendarOutlined style={{ marginRight: 8 }} />
                            Lịch làm việc của tôi
                        </Title>
                        <Text type="secondary">
                            Tổng số ca: <strong>{data?.meta?.total || 0}</strong> | Hôm nay:{" "}
                            <strong>{todayEvents.length}</strong>
                        </Text>
                    </Card>
                </Col>

                {/* Lịch chính */}
                <Col xs={24} lg={17}>
                    <Card bodyStyle={{ padding: "16px" }} loading={isFetching}>
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                left: "prev,next today",
                                center: "title",
                                right: "dayGridMonth,timeGridWeek,timeGridDay",
                            }}
                            locale="vi"
                            buttonText={{
                                today: "Hôm nay",
                                month: "Tháng",
                                week: "Tuần",
                                day: "Ngày",
                            }}
                            height="auto"
                            nowIndicator
                            events={events}
                            dateClick={handleDateClick}
                            eventDisplay="block"
                            eventTimeFormat={{
                                hour: "2-digit",
                                minute: "2-digit",
                                meridiem: false,
                            }}
                            eventContent={(info) => (
                                <div
                                    style={{
                                        fontSize: "12px",
                                        padding: "3px 4px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    <div>{info.event.title}</div>
                                    <div style={{ fontSize: 11, opacity: 0.9 }}>
                                        {dayjs(info.event.start).format("HH:mm")} -{" "}
                                        {dayjs(info.event.end).format("HH:mm")}
                                    </div>
                                </div>
                            )}
                        />
                    </Card>
                </Col>

                {/* Ca hôm nay */}
                <Col xs={24} lg={7}>
                    <Card
                        title={
                            <Space>
                                <ClockCircleOutlined />
                                <Text strong>Ca làm việc hôm nay</Text>
                            </Space>
                        }
                        extra={<Badge count={todayEvents.length} />}
                    >
                        <Text type="secondary" style={{ display: "block", marginBottom: 10 }}>
                            {dayjs().format("dddd, DD/MM/YYYY")}
                        </Text>
                        {todayEvents.length === 0 ? (
                            <Empty description="Không có ca hôm nay" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        ) : (
                            todayEvents.map((item) => (
                                <Card
                                    key={item.id}
                                    size="small"
                                    style={{
                                        marginBottom: 10,
                                        borderLeft: `4px solid ${colorMap[item.status || "AVAILABLE"]}`,
                                    }}
                                >
                                    <Text strong>{item.shiftTemplate?.name || "Ca làm việc"}</Text>
                                    <br />
                                    <Text>
                                        🕒 {dayjs(item.startTime, "HH:mm:ss").format("HH:mm")} -{" "}
                                        {dayjs(item.endTime, "HH:mm:ss").format("HH:mm")}
                                    </Text>
                                    {item.note && (
                                        <Text type="secondary" style={{ display: "block" }}>
                                            <EnvironmentOutlined /> {item.note}
                                        </Text>
                                    )}
                                    <Tag color={colorMap[item.status || "AVAILABLE"]}>
                                        {item.status === "AVAILABLE"
                                            ? "Đang rảnh"
                                            : item.status === "BUSY"
                                                ? "Đang bận"
                                                : item.status === "ON_LEAVE"
                                                    ? "Nghỉ phép"
                                                    : "Ngoại tuyến"}
                                    </Tag>
                                </Card>
                            ))
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Modal xem ca trong ngày */}
            <Modal
                open={openModal}
                onCancel={() => setOpenModal(false)}
                width={700}
                title={
                    <Space>
                        <CalendarOutlined />
                        <Title level={4} style={{ margin: 0 }}>
                            Ca làm việc ngày{" "}
                            {selectedDate ? dayjs(selectedDate).format("DD/MM/YYYY") : ""}
                        </Title>
                    </Space>
                }
                footer={<Button onClick={() => setOpenModal(false)}>Đóng</Button>}
            >
                {eventsOfSelectedDate.length === 0 ? (
                    <Empty
                        description="Không có ca nào trong ngày này"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                ) : (
                    eventsOfSelectedDate.map((item) => (
                        <Card
                            key={item.id}
                            size="small"
                            style={{
                                marginBottom: 10,
                                borderLeft: `4px solid ${colorMap[item.status || "AVAILABLE"]}`,
                            }}
                        >
                            <Space direction="vertical" size={4}>
                                <Text strong>{item.shiftTemplate?.name || "Ca làm việc"}</Text>
                                <Text>
                                    🕒 {dayjs(item.startTime, "HH:mm:ss").format("HH:mm")} -{" "}
                                    {dayjs(item.endTime, "HH:mm:ss").format("HH:mm")}
                                </Text>
                                {item.note && (
                                    <Text type="secondary">
                                        <EnvironmentOutlined /> {item.note}
                                    </Text>
                                )}
                                <Tag color={colorMap[item.status || "AVAILABLE"]}>
                                    {item.status === "AVAILABLE"
                                        ? "Đang rảnh"
                                        : item.status === "BUSY"
                                            ? "Đang bận"
                                            : item.status === "ON_LEAVE"
                                                ? "Nghỉ phép"
                                                : "Ngoại tuyến"}
                                </Tag>
                            </Space>
                        </Card>
                    ))
                )}
            </Modal>

            <style>
                {`
          .fc {
            font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          }
          .fc .fc-toolbar-title {
            font-size: 1.3em;
            color: #1890ff;
            font-weight: 600;
          }
          .fc .fc-button {
            background-color: #1890ff;
            border-color: #1890ff;
          }
          .fc .fc-button:hover {
            background-color: #40a9ff;
            border-color: #40a9ff;
          }
          .fc .fc-day-today {
            background-color: #e6f7ff !important;
          }
        `}
            </style>
        </div>
    );
};

export default HomeSchedulePage;
