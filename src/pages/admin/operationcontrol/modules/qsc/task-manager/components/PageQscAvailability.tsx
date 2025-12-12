import React, { useState, useMemo, useCallback } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Tag,
  Typography,
  Badge,
  message,
  Empty,
  Avatar,
  Divider,
  Modal,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  ArrowLeftOutlined,
  TeamOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");
const { Text, Title } = Typography;

interface Props {
  inspection: any;
  qscStaff: any[];
  onCancel: () => void;
  onAssign: (updatedInspection: any) => void;
}

const colorPalette = [
  "#1890ff", "#52c41a", "#fa8c16", "#722ed1", "#eb2f96",
  "#13c2c2", "#faad14", "#f5222d", "#2f54eb", "#a0d911"
];

const getColorByQsc = (id?: string) => {
  if (!id) return "#8c8c8c";
  const hash = String(id).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorPalette[hash % colorPalette.length];
};

// Fake schedule data - mỗi QSC có các ngày khả dụng khác nhau
const generateSchedule = (qscStaff: any[]) => {
  const schedule: any = {};
  const today = new Date();
  
  // Safety check
  if (!qscStaff || !Array.isArray(qscStaff)) {
    return schedule;
  }
  
  qscStaff.forEach((qsc, idx) => {
    const availableDays: string[] = [];
    // Mỗi QSC khả dụng vào các ngày khác nhau trong tháng
    for (let i = 0; i < 30; i++) {
      // Random pattern để tạo lịch realistic
      if ((i + idx) % 3 === 0 || (i + idx) % 5 === 0) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        availableDays.push(date.toISOString().split('T')[0]);
      }
    }
    schedule[qsc.id] = availableDays;
  });
  
  return schedule;
};

const PageQscAvailability: React.FC<Props> = ({
  inspection,
  qscStaff,
  onCancel,
  onAssign,
}) => {
  const [selectedQsc, setSelectedQsc] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarRange, setCalendarRange] = useState<{ start: string; end: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const qscSchedule = useMemo(() => generateSchedule(qscStaff), [qscStaff]);

  // Tạo events cho FullCalendar
  const events = useMemo(() => {
    const evs: any[] = [];
    
    // Safety check
    if (!qscStaff || !Array.isArray(qscStaff) || qscStaff.length === 0) {
      return evs;
    }
    
    qscStaff.forEach((qsc) => {
      const days = qscSchedule[qsc.id] || [];
      days.forEach((d: string) => {
        evs.push({
          id: `${qsc.id}-${d}`,
          title: qsc.name,
          start: d,
          allDay: true,
          backgroundColor: getColorByQsc(qsc.id),
          borderColor: getColorByQsc(qsc.id),
          textColor: "#ffffff",
          extendedProps: {
            qsc: qsc,
            workDate: d,
            qscName: qsc.name,
            color: getColorByQsc(qsc.id),
          },
        });
      });
    });
    return evs;
  }, [qscStaff, qscSchedule]);

  // Ca hôm nay
  const todayEvents = useMemo(() => {
    const today = dayjs().format("YYYY-MM-DD");
    return events.filter((ev) => ev.extendedProps.workDate === today);
  }, [events]);

  // Thống kê QSC
  const qscStats = useMemo(() => {
    const stats = new Map();
    events.forEach((ev) => {
      const qscId = ev.extendedProps.qsc?.id;
      const qscName = ev.extendedProps.qsc?.name || "Unknown";
      if (qscId) {
        if (!stats.has(qscId)) {
          stats.set(qscId, {
            name: qscName,
            color: getColorByQsc(qscId),
            count: 0,
            activeTask: ev.extendedProps.qsc.activeTask || 0,
            completedTask: ev.extendedProps.qsc.completedTask || 0,
          });
        }
        stats.get(qscId).count++;
      }
    });
    return Array.from(stats.values()).sort((a, b) => b.count - a.count);
  }, [events]);

  // Lấy QSC khả dụng theo ngày
  const getAvailableQscForDate = useCallback((dateStr: string) => {
  if (!qscStaff || !Array.isArray(qscStaff)) return [];

  // Lấy danh sách ID của những QSC ĐÃ CÓ LỊCH vào ngày dateStr
  const busyQscIds = events
    .filter(ev => ev.start === dateStr)
    .map(ev => ev.extendedProps.qsc.id);

  // Trả về những QSC KHÔNG nằm trong danh sách bận
  return qscStaff.filter(qsc => !busyQscIds.includes(qsc.id));
}, [qscStaff, events]);

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
    setSelectedQsc(null);
    message.info(`Chọn ngày ${dayjs(arg.dateStr).format("DD/MM/YYYY")}`);
  };

  const handleEventClick = (info: any) => {
    const { qsc, workDate } = info.event.extendedProps;
    setSelectedQsc(qsc);
    setSelectedDate(workDate);
  };

  const handleQscSelect = (qsc: any) => {
    setSelectedQsc(qsc);
  };

  const handleAssign = () => {
    if (!selectedQsc || !selectedDate) {
      return message.error("Vui lòng chọn QSC và ngày làm việc");
    }
    setShowConfirmModal(true);
  };

  const confirmAssign = () => {
  const updated = {
    ...inspection,
    qscId: selectedQsc.id,
    qscName: selectedQsc.name,
    dueDate: selectedDate,
    status: "Đã phân công",  // ← THÊM DÒNG NÀY LÀ XONG 100%!
  };
  onAssign(updated);
  setShowConfirmModal(false);
  setShowSuccessModal(true);
};

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    message.success(`✅ Đã phân công ${selectedQsc.name} cho phiếu ${inspection.code}`);
  };

  const availableQscForSelectedDate = selectedDate ? getAvailableQscForDate(selectedDate) : [];

  const renderEventContent = (eventInfo: any) => {
    const { qscName } = eventInfo.event.extendedProps;
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
        <div style={{ fontWeight: 600 }}>{qscName}</div>
      </div>
    );
  };

  return (
    <div style={{ marginTop: 24 }}>
      <style>
        {`
          /* Custom FullCalendar styles */
          .fc {
            font-size: 14px;
          }
          
          .fc .fc-toolbar {
            flex-wrap: wrap;
            gap: 8px;
            padding: 8px 0;
          }
          
          .fc .fc-toolbar-title {
            font-size: 18px !important;
            font-weight: 600;
            margin: 0 8px;
          }
          
          .fc .fc-button {
            padding: 6px 12px !important;
            font-size: 13px !important;
            height: auto !important;
            border-radius: 6px !important;
          }
          
          .fc .fc-button-group {
            display: flex;
            gap: 4px;
          }
          
          .fc-toolbar-chunk {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
          }
          
          .qsc-card-item {
            padding: 12px;
            border-radius: 8px;
            border: 2px solid transparent;
            cursor: pointer;
            transition: all 0.3s;
            background: #fafafa;
            margin-bottom: 12px;
          }
          
          .qsc-card-item:hover {
            border-color: #1890ff;
            background: #e6f7ff;
            transform: translateX(4px);
          }
          
          .qsc-card-item.selected {
            border-color: #1890ff;
            background: #e6f7ff;
            box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
          }
          
          /* Mobile styles */
          @media (max-width: 768px) {
            .fc .fc-toolbar {
              flex-direction: column;
              align-items: stretch;
            }
            
            .fc-toolbar-chunk {
              justify-content: center;
              width: 100%;
            }
            
            .fc .fc-toolbar-title {
              font-size: 16px !important;
              text-align: center;
              width: 100%;
            }
            
            .fc .fc-button {
              padding: 8px 10px !important;
              font-size: 12px !important;
              flex: 1;
              min-width: 0;
            }
            
            .fc .fc-button-group {
              width: 100%;
              display: flex;
            }
            
            .fc .fc-button-group .fc-button {
              flex: 1;
            }
            
            .fc-daygrid-day-number {
              font-size: 12px;
              padding: 4px;
            }
            
            .fc-col-header-cell-cushion {
              padding: 4px 2px;
              font-size: 12px;
            }
            
            .fc-event {
              font-size: 11px !important;
            }
          }
          
          @media (max-width: 576px) {
            .fc .fc-toolbar-title {
              font-size: 14px !important;
            }
            
            .fc .fc-button {
              padding: 6px 8px !important;
              font-size: 11px !important;
            }
            
            .fc-daygrid-day-number {
              font-size: 11px;
            }
            
            .fc-col-header-cell-cushion {
              font-size: 11px;
            }
          }
        `}
      </style>

      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <ArrowLeftOutlined onClick={onCancel} style={{ cursor: "pointer", fontSize: 18 }} />
            <CalendarOutlined style={{ fontSize: 20, color: "#1890ff" }} />
            <Title level={4} style={{ margin: 0 }}>
              Phân công QSC cho phiếu {inspection.code}
            </Title>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Header */}
        <Col span={24}>
          <Card bodyStyle={{ padding: "12px 16px" }}>
            <Row gutter={[8, 8]} align="middle">
              <Col xs={24} sm={24} md={12} lg={14}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Tổng số ca: <strong>{events.length}</strong>
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Hôm nay: <strong>{todayEvents.length} ca</strong>
                  </Text>
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={10}>
                <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={handleAssign}
                    disabled={!selectedQsc || !selectedDate}
                  >
                    Xác nhận phân công
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Lịch chính */}
        <Col xs={24} lg={17}>
          <Card
            bodyStyle={{ padding: "12px" }}
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
          >
            <FullCalendar
              plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek",
              }}
              locale="vi"
              buttonText={{
                today: "Hôm nay",
                month: "Tháng",
                week: "Tuần",
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
              dayMaxEvents={3}
              moreLinkText={(num) => `+${num}`}
              datesSet={(info) => {
                const start = dayjs(info.start).format("YYYY-MM-DD");
                const end = dayjs(info.end).format("YYYY-MM-DD");
                setCalendarRange({ start, end });
              }}
              contentHeight="auto"
              aspectRatio={1.5}
            />
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={7}>
          <Space direction="vertical" style={{ width: "100%" }} size={16}>
            {/* QSC khả dụng cho ngày được chọn */}
            {selectedDate && (
              <Card
                title={
                  <Space>
                    <TeamOutlined />
                    <Text strong>QSC còn trống</Text>
                    
                  </Space>
                }
                extra={<Badge count={availableQscForSelectedDate.length} />}
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                bodyStyle={{ padding: "12px" }}
              >
                <Text type="secondary" style={{ display: "block", marginBottom: 12, fontSize: 13 }}>
                  {dayjs(selectedDate).format("dddd, DD/MM/YYYY")}
                </Text>
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {availableQscForSelectedDate.length === 0 ? (
                    <Empty
  description={
    <div style={{ textAlign: "center" }}>
      <Text strong>Không có QSC nào còn trống</Text>
      <br />
      <Text type="secondary" style={{ fontSize: 13 }}>
        Tất cả QSC đã có lịch vào ngày này
      </Text>
    </div>
  }
  image={Empty.PRESENTED_IMAGE_SIMPLE}
/>
                  ) : (
                    availableQscForSelectedDate.map((qsc) => (
                      <div
                        key={qsc.id}
                        className={`qsc-card-item ${selectedQsc?.id === qsc.id ? 'selected' : ''}`}
                        onClick={() => handleQscSelect(qsc)}
                      >
                        <Space direction="vertical" size={4} style={{ width: "100%" }}>
                          <Space>
                            <Avatar
                              style={{
                                backgroundColor: getColorByQsc(qsc.id),
                                verticalAlign: 'middle'
                              }}
                              size={40}
                            >
                              {qsc.name.charAt(0)}
                            </Avatar>
                            <div>
                              <Text strong style={{ fontSize: 14 }}>
                                {qsc.name}
                              </Text>
                              <br />
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {qsc.email || "qsc@example.com"}
                              </Text>
                            </div>
                          </Space>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            <UserOutlined /> {qsc.email || "qsc@example.com"}
                          </Text>
                        </Space>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            )}

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
              bodyStyle={{ padding: "12px" }}
            >
              <Text type="secondary" style={{ display: "block", marginBottom: 12, fontSize: 13 }}>
                {dayjs().format("dddd, DD/MM/YYYY")}
              </Text>
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
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
                          setSelectedQsc(item.qsc);
                          setSelectedDate(item.workDate);
                        }}
                        bodyStyle={{ padding: "10px 12px" }}
                      >
                        <Space direction="vertical" size={4} style={{ width: "100%" }}>
                          <Text strong style={{ fontSize: 14 }}>
                            {item.qsc?.name || "QSC"}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {item.qsc?.email || "qsc@example.com"}
                          </Text>
                        </Space>
                      </Card>
                    );
                  })
                )}
              </div>
            </Card>

            {/* Danh sách QSC */}
            <Card
              title={
                <Space>
                  <UserOutlined />
                  <Text strong>Danh sách QSC</Text>
                </Space>
              }
              bodyStyle={{ padding: "12px" }}
            >
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {qscStats.length === 0 ? (
                  <Empty
                    description="Chưa có QSC"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ) : (
                  qscStats.map((qsc) => (
                    <div
                      key={qsc.name}
                      style={{
                        padding: "8px 12px",
                        marginBottom: 8,
                        background: "#fafafa",
                        borderRadius: 6,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderLeft: `3px solid ${qsc.color}`,
                      }}
                    >
                      <Space>
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: qsc.color,
                          }}
                        />
                        <Text style={{ fontSize: 13 }}>{qsc.name}</Text>
                      </Space>
                      <Badge
                        count={qsc.count}
                        style={{ backgroundColor: qsc.color }}
                        overflowCount={999}
                      />
                    </div>
                  ))
                )}
              </div>
            </Card>
          </Space>
        </Col>
      </Row>

      {/* Modal xác nhận phân công */}
      <Modal
        title={
          <Space>
            <CheckOutlined style={{ color: "#52c41a" }} />
            <span>Xác nhận phân công</span>
          </Space>
        }
        open={showConfirmModal}
        onOk={confirmAssign}
        onCancel={() => setShowConfirmModal(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        okButtonProps={{ type: "primary", size: "large" }}
        cancelButtonProps={{ size: "large" }}
        width={500}
      >
        <Divider style={{ margin: "16px 0" }} />
        
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <div style={{ padding: 16, background: "#f0f2f5", borderRadius: 8 }}>
            <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 4 }}>
              Phiếu kiểm tra
            </Text>
            <Text strong style={{ fontSize: 16 }}>
              {inspection.code}
            </Text>
          </div>

          <div style={{ padding: 16, background: "#e6f7ff", borderRadius: 8, border: "1px solid #91d5ff" }}>
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <div>
                <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 4 }}>
                  <CalendarOutlined /> Ngày phân công
                </Text>
                <Text strong style={{ fontSize: 15 }}>
                  {selectedDate ? dayjs(selectedDate).format("dddd, DD/MM/YYYY") : "—"}
                </Text>
              </div>

              <Divider style={{ margin: "8px 0" }} />

              <div>
                <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
                  <UserOutlined /> QSC được phân công
                </Text>
                <Space>
                  <Avatar
                    style={{
                      backgroundColor: getColorByQsc(selectedQsc?.id),
                      verticalAlign: 'middle'
                    }}
                    size={45}
                  >
                    {selectedQsc?.name?.charAt(0)}
                  </Avatar>
                  <div>
                    <Text strong style={{ fontSize: 15, display: "block" }}>
                      {selectedQsc?.name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {selectedQsc?.email || "qsc@example.com"}
                    </Text>
                  </div>
                </Space>
              </div>
            </Space>
          </div>

          <Text type="secondary" style={{ fontSize: 13, fontStyle: "italic" }}>
            💡 QSC sẽ được thông báo về phiếu kiểm tra này
          </Text>
        </Space>
      </Modal>

      {/* Modal phân công thành công */}
      <Modal
        title={null}
        open={showSuccessModal}
        onOk={handleSuccessClose}
        onCancel={handleSuccessClose}
        footer={[
          <Button key="close" type="primary" size="large" onClick={handleSuccessClose} block>
            Đóng
          </Button>
        ]}
        width={450}
        centered
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ 
            width: 80, 
            height: 80, 
            borderRadius: "50%", 
            background: "#f6ffed",
            border: "4px solid #52c41a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px"
          }}>
            <CheckOutlined style={{ fontSize: 40, color: "#52c41a" }} />
          </div>

          <Title level={3} style={{ marginBottom: 8, color: "#52c41a" }}>
            Phân công thành công!
          </Title>
          
          <Text type="secondary" style={{ fontSize: 14 }}>
            QSC đã được phân công cho phiếu kiểm tra
          </Text>

          <Divider style={{ margin: "20px 0" }} />

          <Space direction="vertical" size={12} style={{ width: "100%", textAlign: "left" }}>
            <div style={{ padding: 12, background: "#fafafa", borderRadius: 8 }}>
              <Text type="secondary" style={{ fontSize: 13 }}>Phiếu kiểm tra</Text>
              <br />
              <Text strong style={{ fontSize: 15 }}>{inspection.code}</Text>
            </div>

            <div style={{ padding: 12, background: "#fafafa", borderRadius: 8 }}>
              <Text type="secondary" style={{ fontSize: 13 }}>Ngày phân công</Text>
              <br />
              <Text strong style={{ fontSize: 15 }}>
                {selectedDate ? dayjs(selectedDate).format("DD/MM/YYYY") : "—"}
              </Text>
            </div>

            <div style={{ padding: 12, background: "#e6f7ff", borderRadius: 8, border: "1px solid #91d5ff" }}>
              <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
                QSC phụ trách
              </Text>
              <Space>
                <Avatar
                  style={{
                    backgroundColor: getColorByQsc(selectedQsc?.id),
                    verticalAlign: 'middle'
                  }}
                  size={40}
                >
                  {selectedQsc?.name?.charAt(0)}
                </Avatar>
                <div>
                  <Text strong style={{ fontSize: 15, display: "block" }}>
                    {selectedQsc?.name}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {selectedQsc?.email}
                  </Text>
                </div>
              </Space>
            </div>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default PageQscAvailability;