import React, { useState } from "react";
import {
    Drawer,
    Tag,
    Spin,
    Space,
    Typography,
    DatePicker,
    Input,
    Button,
} from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useTechnicianAvailabilityByTechnicianIdQuery } from "@/hooks/useTechnicianAvailability";

const { Text, Title } = Typography;

interface ScheduleDrawerProps {
    open: boolean;
    onClose: () => void;
    technician: any;
}

/* ========================= Drawer xem lịch làm việc của KTV ========================= */
const ScheduleDrawer = ({ open, onClose, technician }: ScheduleDrawerProps) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [keyword, setKeyword] = useState("");
    const { data, isFetching } = useTechnicianAvailabilityByTechnicianIdQuery({
        technicianId: technician.id,
        page: 1,
        pageSize: 50,
    });

    const statusColor = {
        AVAILABLE: "green",
        BUSY: "orange",
        ON_LEAVE: "red",
        OFFLINE: "gray",
    } as Record<string, string>;

    // Lọc lịch làm việc theo ngày + từ khóa
    const filteredData = data?.result?.filter((a: any) => {
        const matchesDate = selectedDate
            ? a.workDate === dayjs(selectedDate).format("YYYY-MM-DD")
            : true;
        const matchesKeyword =
            keyword.trim() === "" ||
            a.note?.toLowerCase().includes(keyword.toLowerCase()) ||
            a.status?.toLowerCase().includes(keyword.toLowerCase());
        return matchesDate && matchesKeyword;
    });

    return (
        <Drawer
            title={
                <Space>
                    <EyeOutlined />
                    <Title level={4} style={{ margin: 0 }}>
                        Lịch làm việc: {technician.fullName}
                    </Title>
                </Space>
            }
            width={520}
            onClose={onClose}
            open={open}
        >
            {/* Bộ lọc tìm kiếm */}
            <Space style={{ marginBottom: 16 }} wrap>
                <DatePicker
                    placeholder="Chọn ngày"
                    onChange={(date) => setSelectedDate(date ? date.toISOString() : null)}
                    allowClear
                    format="DD/MM/YYYY"
                />
                <Input
                    placeholder="Tìm theo trạng thái hoặc ghi chú"
                    prefix={<SearchOutlined />}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    allowClear
                    style={{ width: 240 }}
                />
                <Button
                    onClick={() => {
                        setSelectedDate(null);
                        setKeyword("");
                    }}
                >
                    Xóa lọc
                </Button>
            </Space>

            {/* Nội dung lịch */}
            {isFetching ? (
                <div className="flex justify-center py-8">
                    <Spin />
                </div>
            ) : filteredData && filteredData.length > 0 ? (
                <div className="space-y-3">
                    {filteredData.map((a: any) => (
                        <div
                            key={a.id}
                            style={{
                                padding: "10px 14px",
                                background: "#fafafa",
                                borderRadius: 8,
                                borderLeft: `4px solid ${statusColor[a.status] || "#ccc"}`,
                            }}
                        >
                            <Space direction="vertical" size={2} style={{ width: "100%" }}>
                                <Text strong>{a.workDate}</Text>
                                <Text>
                                    🕒 {a.startTime} - {a.endTime}
                                </Text>
                                <Tag color={statusColor[a.status] || "default"}>{a.status}</Tag>
                                {a.note && (
                                    <Text type="secondary" style={{ display: "block" }}>
                                        Ghi chú: {a.note}
                                    </Text>
                                )}
                            </Space>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <Text type="secondary">
                        {selectedDate
                            ? "Không có ca làm trong ngày được chọn"
                            : "Không có lịch làm việc nào"}
                    </Text>
                </div>
            )}
        </Drawer>
    );
};

export default ScheduleDrawer;
