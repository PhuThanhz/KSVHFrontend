import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/constants/paths";
import {
    CheckCircleOutlined,
    FormOutlined,
    FileTextOutlined,
    FileDoneOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import {
    Badge,
    Typography,
    Card,
    Space,
    Empty,
    Spin,
    Tag,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useMyTechnicianAvailabilitiesQuery } from "@/hooks/useTechnicianAvailability";
import { useTechnicianAssignmentsQuery } from "@/hooks/maintenance/useTechnicianAssignments";
import { useMaintenanceSurveysInProgressQuery } from "@/hooks/maintenance/useMaintenanceSurveys";
import { useSurveyedRequestsQuery } from "@/hooks/maintenance/useMaintenancePlans";
import { useApprovedExecutionsQuery } from "@/hooks/maintenance/useMaintenanceExecutions";

dayjs.locale("vi");

const { Text, Title } = Typography;

// ==================== Màu trạng thái ====================
const colorMap = {
    AVAILABLE: "#52c41a",
    BUSY: "#faad14",
    OFFLINE: "#ff4d4f",
    ON_LEAVE: "#f5222d",
};

const HomeTechnicianLayout = () => {
    const navigate = useNavigate();

    // ==================== Dữ liệu ca làm việc ====================
    const { data, isFetching } = useMyTechnicianAvailabilitiesQuery("page=1&pageSize=100");
    const todayStr = dayjs().format("YYYY-MM-DD");
    const totalShifts = data?.meta?.total || 0;

    const todayEvents = useMemo(
        () => data?.result?.filter((i) => i.workDate === todayStr) || [],
        [data]
    );

    // ==================== Dữ liệu công việc ====================
    const { data: assignData } = useTechnicianAssignmentsQuery("page=1&pageSize=1");
    const { data: surveyData } = useMaintenanceSurveysInProgressQuery("page=1&pageSize=1");
    const { data: planData } = useSurveyedRequestsQuery("page=1&pageSize=1");
    const { data: executionData } = useApprovedExecutionsQuery("page=1&pageSize=1");

    const counts = {
        assignment: assignData?.meta?.total || 0,
        survey: surveyData?.meta?.total || 0,
        plan: planData?.meta?.total || 0,
        progress: executionData?.meta?.total || 0,
    };

    // ==================== Danh mục chính ====================
    const categories = [
        {
            key: "assignment",
            label: "Xác Nhận Phân Công",
            icon: <CheckCircleOutlined className="text-4xl" />,
            bg: "bg-gradient-to-br from-blue-50 to-blue-100",
            border: "border-l-4 border-blue-500",
            path: PATHS.TECHNICIAN.ASSIGNMENT,
            count: counts.assignment,
        },
        {
            key: "survey",
            label: "Khảo Sát Thiết Bị",
            icon: <FormOutlined className="text-4xl" />,
            bg: "bg-gradient-to-br from-orange-50 to-orange-100",
            border: "border-l-4 border-orange-500",
            path: PATHS.TECHNICIAN.SURVEY,
            count: counts.survey,
        },
        {
            key: "plan",
            label: "Lập Kế Hoạch Bảo Trì",
            icon: <FileTextOutlined className="text-4xl" />,
            bg: "bg-gradient-to-br from-teal-50 to-teal-100",
            border: "border-l-4 border-teal-500",
            path: PATHS.TECHNICIAN.PLAN,
            count: counts.plan,
        },
        {
            key: "progress",
            label: "Thi Công & Cập Nhật Tiến Độ",
            icon: <FileDoneOutlined className="text-4xl" />,
            bg: "bg-gradient-to-br from-amber-50 to-amber-100",
            border: "border-l-4 border-amber-500",
            path: PATHS.TECHNICIAN.EXECUTION,
            count: counts.progress,
        },
    ];

    // ==================== Render giao diện ====================
    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pb-24">
            <div className="px-5 pt-10 space-y-10">
                {/* ======= LỊCH LÀM VIỆC HÔM NAY ======= */}
                <section>
                    <Card className="rounded-2xl shadow-sm border border-gray-100">
                        <Space direction="vertical" size={10} style={{ width: "100%" }}>
                            <Space align="center">
                                <CalendarOutlined />
                                <Title level={5} style={{ margin: 0 }}>
                                    Lịch làm việc của tôi
                                </Title>
                            </Space>

                            <Text type="secondary">
                                Tổng số ca: <strong>{totalShifts}</strong> | Hôm nay:{" "}
                                <strong>{todayEvents.length}</strong>
                            </Text>

                            <div className="border-t pt-4">
                                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                                    <Space align="center">
                                        <ClockCircleOutlined />
                                        <Text strong>Ca làm việc hôm nay</Text>
                                    </Space>
                                    <Text type="secondary">{dayjs().format("dddd, DD/MM/YYYY")}</Text>

                                    {isFetching ? (
                                        <div className="flex justify-center py-10">
                                            <Spin />
                                        </div>
                                    ) : todayEvents.length === 0 ? (
                                        <Empty description="Không có ca hôm nay" />
                                    ) : (
                                        todayEvents.map((item) => (
                                            <div
                                                key={item.id}
                                                className="p-4 rounded-lg border-l-4 shadow-sm bg-white"
                                                style={{
                                                    borderLeftColor: colorMap[item.status || "AVAILABLE"],
                                                }}
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
                                                    <div className="mt-1">
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
                            </div>
                        </Space>
                    </Card>
                </section>

                {/* ======= DANH MỤC CHÍNH ======= */}
                <section>
                    <div className="grid grid-cols-2 gap-6">
                        {categories.map((cat) => (
                            <div
                                key={cat.key}
                                onClick={() => navigate(cat.path)}
                                className={`
                  ${cat.bg} ${cat.border}
                  rounded-2xl p-6 text-center cursor-pointer
                  transform transition-all duration-200 active:scale-95
                  shadow-sm hover:shadow-md flex flex-col items-center justify-center
                  h-36 relative overflow-hidden
                `}
                            >
                                {cat.count > 0 && (
                                    <Badge
                                        count={cat.count}
                                        className="absolute top-2 right-2"
                                        style={{
                                            backgroundColor: "#ef4444",
                                            color: "white",
                                            fontWeight: "bold",
                                            fontSize: "10px",
                                            borderRadius: "12px",
                                            padding: "0 6px",
                                        }}
                                    />
                                )}

                                <div className="mb-2 text-gray-700">{cat.icon}</div>
                                <Text strong className="text-sm text-gray-800 leading-tight px-2">
                                    {cat.label}
                                </Text>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomeTechnicianLayout;
