import React, { useState, useMemo } from "react";
import {
    Button,
    Card,
    Col,
    Row,
    Space,
    Tag,
    Typography,
    Divider,
    Empty,
    Modal,
    Badge,
} from "antd";
import {
    PlusOutlined,
    ReloadOutlined,
    CalendarOutlined,
    UserOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";

import ModalTechnicianAvailability from "@/components/admin/technician-availability/modal.technician-availability";
import ViewDetailTechnicianAvailability from "@/components/admin/technician-availability/view.technician-availability";
import { useTechnicianAvailabilitiesQuery } from "@/hooks/useTechnicianAvailability";
import type { ITechnicianAvailability } from "@/types/backend";

dayjs.locale("vi");
const { Text, Title } = Typography;

const colorPalette = [
    "#1890ff", "#52c41a", "#fa8c16", "#722ed1", "#eb2f96",
    "#13c2c2", "#faad14", "#f5222d", "#2f54eb", "#52c41a"
];

const getColorByTechnician = (id?: string) => {
    if (!id) return "#8c8c8c";
    const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colorPalette[hash % colorPalette.length];
};

const PageTechnicianAvailability = () => {
    const [openModal, setOpenModal] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openDayModal, setOpenDayModal] = useState(false);
    const [selectedId, setSelectedId] = useState<string | number | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [dataInit, setDataInit] = useState<ITechnicianAvailability | null>(null);
    const [calendarRange, setCalendarRange] = useState<{ start: string; end: string } | null>(null);

    const query = calendarRange
        ? `startDate=${calendarRange.start}&endDate=${calendarRange.end}&page=1&pageSize=100`
        : "";

    const { data, isFetching, refetch } = useTechnicianAvailabilitiesQuery(query);

    const events = useMemo(() => {
        if (!data?.result) return [];
        return data.result.map((item) => {
            const techName = item.technician?.fullName || "Kỹ thuật viên";
            const shiftName = item.shiftTemplate?.name || "Ca làm việc";
            const color = getColorByTechnician(item.technician?.id);
            const location = item.note || "";

            return {
                id: item.id,
                title: `${techName} - ${shiftName}`,
                start: `${item.workDate}T${item.startTime}`,
                end: `${item.workDate}T${item.endTime}`,
                backgroundColor: color,
                borderColor: color,
                textColor: "#ffffff",
                extendedProps: {
                    ...item,
                    techName,
                    shiftName,
                    location,
                    color,
                },
            };
        });
    }, [data]);

    const todayEvents = useMemo(() => {
        const today = dayjs().format("YYYY-MM-DD");
        return events.filter((ev) => ev.extendedProps.workDate === today);
    }, [events]);

    const technicianStats = useMemo(() => {
        const stats = new Map();
        events.forEach((ev) => {
            const techId = ev.extendedProps.technician?.id;
            const techName = ev.extendedProps.technician?.fullName || "Unknown";
            if (techId) {
                if (!stats.has(techId)) {
                    stats.set(techId, {
                        name: techName,
                        color: getColorByTechnician(techId),
                        count: 0,
                    });
                }
                stats.get(techId).count++;
            }
        });
        return Array.from(stats.values()).sort((a, b) => b.count - a.count);
    }, [events]);

    const handleEventClick = (info: any) => {
        setSelectedId(info.event.id);
        setOpenView(true);
    };

    const handleDateClick = (arg: any) => {
        setSelectedDate(arg.dateStr);
        setOpenDayModal(true);
    };

    const eventsOfSelectedDate = useMemo(() => {
        if (!selectedDate) return [];
        return events.filter((ev) => ev.extendedProps.workDate === selectedDate);
    }, [events, selectedDate]);

    const renderEventContent = (eventInfo: any) => {
        const { techName, shiftName, special } = eventInfo.event.extendedProps;
        return (
            <div
                style={{
                    padding: "4px 6px",
                    fontSize: "12px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{techName}</div>
                <div style={{ fontSize: "11px", opacity: 0.95 }}>{shiftName}</div>
                {special && (
                    <Tag
                        color="gold"
                        style={{
                            fontSize: "10px",
                            marginTop: 2,
                            borderRadius: 4,
                            lineHeight: "14px",
                        }}
                    >
                        ĐẶC BIỆT
                    </Tag>
                )}
            </div>
        );
    };

    return (
        <div style={{ padding: "20px", background: "#f0f2f5", minHeight: "100vh" }}>
            <Row gutter={[16, 16]}>
                {/* Header */}
                <Col span={24}>
                    <Card>
                        <Row gutter={16} align="middle">
                            <Col flex="auto">
                                <Title level={3} style={{ margin: 0 }}>
                                    <CalendarOutlined style={{ marginRight: 8 }} />
                                    Quản lý lịch làm việc kỹ thuật viên
                                </Title>
                                <Text type="secondary">
                                    Tổng số ca làm việc: <strong>{events.length}</strong> | Hôm nay:{" "}
                                    <strong>{todayEvents.length} ca</strong>
                                </Text>
                            </Col>
                            <Col>
                                <Space>
                                    <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
                                        Làm mới
                                    </Button>
                                    <Access
                                        permission={ALL_PERMISSIONS.TECHNICIAN_AVAILABILITY.CREATE}
                                        hideChildren
                                    >
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={() => setOpenModal(true)}
                                            size="large"
                                        >
                                            Thêm ca mới
                                        </Button>
                                    </Access>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Lịch chính */}
                <Col xs={24} lg={17}>
                    <Card
                        bodyStyle={{ padding: "16px" }}
                        loading={isFetching}
                        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                    >
                        <FullCalendar
                            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
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
                            nowIndicator
                            editable={false}
                            selectable
                            height="auto"
                            events={events}
                            dateClick={handleDateClick}
                            eventClick={handleEventClick}
                            eventContent={renderEventContent}
                            eventDisplay="block"
                            displayEventTime={true}
                            dayMaxEvents={3}
                            moreLinkText={(num) => `+${num} ca khác`}
                            eventTimeFormat={{
                                hour: "2-digit",
                                minute: "2-digit",
                                meridiem: false,
                            }}
                            datesSet={(info) => {
                                const start = dayjs(info.start).format("YYYY-MM-DD");
                                const end = dayjs(info.end).format("YYYY-MM-DD");
                                setCalendarRange({ start, end });
                            }}
                        />
                    </Card>
                </Col>

                {/* Sidebar */}
                <Col xs={24} lg={7}>
                    <Space direction="vertical" style={{ width: "100%" }} size={16}>
                        {/* Ca hôm nay */}
                        <Card
                            title={
                                <Space>
                                    <ClockCircleOutlined />
                                    <Text strong>Ca làm việc hôm nay</Text>
                                </Space>
                            }
                            extra={<Badge count={todayEvents.length} />}
                            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                        >
                            <Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
                                {dayjs().format("dddd, DD/MM/YYYY")}
                            </Text>
                            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                                {todayEvents.length === 0 ? (
                                    <Empty
                                        description="Không có ca nào hôm nay"
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    />
                                ) : (
                                    todayEvents.map((ev) => {
                                        const item = ev.extendedProps;
                                        return (
                                            <Card
                                                key={ev.id}
                                                size="small"
                                                style={{
                                                    marginBottom: 12,
                                                    borderLeft: `4px solid ${ev.backgroundColor}`,
                                                    cursor: "pointer",
                                                    transition: "all 0.3s",
                                                }}
                                                hoverable
                                                onClick={() => {
                                                    setSelectedId(String(ev.id));
                                                    setOpenView(true);
                                                }}
                                            >
                                                <Space direction="vertical" size={4}>
                                                    <Text strong style={{ fontSize: 14 }}>
                                                        {item.technician?.fullName || "Kỹ thuật viên"}
                                                    </Text>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        {item.shiftTemplate?.name || "Ca làm việc"}
                                                    </Text>
                                                    <Text>
                                                        🕒 {dayjs(item.startTime, "HH:mm:ss").format("HH:mm")} -{" "}
                                                        {dayjs(item.endTime, "HH:mm:ss").format("HH:mm")}
                                                    </Text>
                                                    {item.note && (
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            <EnvironmentOutlined /> {item.note}
                                                        </Text>
                                                    )}
                                                    <div>
                                                        <Tag
                                                            color={
                                                                item.status === "AVAILABLE"
                                                                    ? "green"
                                                                    : item.status === "BUSY"
                                                                        ? "orange"
                                                                        : item.status === "ON_LEAVE"
                                                                            ? "red"
                                                                            : "default"
                                                            }
                                                        >
                                                            {item.status === "AVAILABLE"
                                                                ? "Đang rảnh"
                                                                : item.status === "BUSY"
                                                                    ? "Đang bận"
                                                                    : item.status === "ON_LEAVE"
                                                                        ? "Nghỉ phép"
                                                                        : "Ngoại tuyến"}
                                                        </Tag>
                                                        {item.special && <Tag color="gold">Đặc biệt</Tag>}
                                                    </div>
                                                </Space>
                                            </Card>
                                        );
                                    })
                                )}
                            </div>
                        </Card>

                        {/* Danh sách kỹ thuật viên */}
                        <Card
                            title={
                                <Space>
                                    <UserOutlined />
                                    <Text strong>Kỹ thuật viên</Text>
                                </Space>
                            }
                        >
                            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                                {technicianStats.map((tech) => (
                                    <div
                                        key={tech.name}
                                        style={{
                                            padding: "8px 12px",
                                            marginBottom: 8,
                                            background: "#fafafa",
                                            borderRadius: 6,
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            borderLeft: `3px solid ${tech.color}`,
                                        }}
                                    >
                                        <Space>
                                            <div
                                                style={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: "50%",
                                                    background: tech.color,
                                                }}
                                            />
                                            <Text>{tech.name}</Text>
                                        </Space>
                                        <Badge count={tech.count} style={{ backgroundColor: tech.color }} />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </Space>
                </Col>
            </Row>

            {/* Modal tạo/sửa */}
            {openModal && (
                <ModalTechnicianAvailability
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    dataInit={dataInit}
                    setDataInit={setDataInit}
                />
            )}

            {/* Drawer xem chi tiết */}
            {openView && (
                <ViewDetailTechnicianAvailability
                    open={openView}
                    onClose={setOpenView}
                    technicianAvailabilityId={selectedId}
                    onEdit={(data) => {
                        setDataInit(data);
                        setOpenView(false);
                        setOpenModal(true);
                    }}
                />
            )}
        </div>
    );
};

export default PageTechnicianAvailability;
