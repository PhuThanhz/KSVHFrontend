// src/pages/technician/HomeTechnicianLayout.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/constants/paths";
import {
    CheckCircleOutlined,
    FormOutlined,
    FileTextOutlined,
    FileDoneOutlined
} from "@ant-design/icons";
import { Badge, Typography } from "antd";

import { useTechnicianAssignmentsQuery, } from "@/hooks/maintenance/useTechnicianAssignments";
import { useMaintenanceSurveysInProgressQuery, } from "@/hooks/maintenance/useMaintenanceSurveys";
import { useSurveyedRequestsQuery, } from "@/hooks/maintenance/useMaintenancePlans";

const { Text } = Typography;

const HomeTechnicianLayout: React.FC = () => {
    const navigate = useNavigate();

    // Lấy số lượng công việc (chỉ cần meta.total)
    const { data: assignData } = useTechnicianAssignmentsQuery("page=1&pageSize=1");
    const { data: surveyData } = useMaintenanceSurveysInProgressQuery("page=1&pageSize=1");
    const { data: planData } = useSurveyedRequestsQuery("page=1&pageSize=1");

    const counts = {
        assignment: assignData?.meta?.total || 0,
        survey: surveyData?.meta?.total || 0,
        plan: planData?.meta?.total || 0,
        // progress: 0, // ← Không có hook → để 0
    };

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
            label: "Cập Nhật Tiến Độ",
            icon: <FileDoneOutlined className="text-4xl" />,
            bg: "bg-gradient-to-br from-amber-50 to-amber-100",
            border: "border-l-4 border-amber-500",
            path: PATHS.TECHNICIAN.PROGRESS,
            count: 0,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pb-24">


            {/* Main content */}
            <div className="px-5 pt-10">
                <div className="grid grid-cols-2 gap-4">
                    {categories.map((cat) => (
                        <div
                            key={cat.key}
                            onClick={() => navigate(cat.path)}
                            className={`
                                ${cat.bg} ${cat.border}
                                rounded-2xl p-5 text-center cursor-pointer 
                                transform transition-all duration-200 active:scale-95
                                shadow-md hover:shadow-lg flex flex-col items-center justify-center
                                h-36 relative overflow-hidden
                            `}
                        >
                            {/* Badge số lượng */}
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

                            {/* Icon */}
                            <div className="mb-2 text-gray-700">{cat.icon}</div>

                            {/* Label */}
                            <Text strong className="text-sm text-gray-800 leading-tight px-2">
                                {cat.label}
                            </Text>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeTechnicianLayout;