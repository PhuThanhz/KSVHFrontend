import React, { useState } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Select,
  Row,
  Col,
  Statistic,
  Space,
} from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  PlusOutlined,
  EyeOutlined,
  FormOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import CreateInspectionSimple from "../components/CreateInspectionSimple";
import PageQscAvailability from "../components/PageQscAvailability";

const { Option } = Select;

// ---------------- Mock Data ----------------
const stores = [
  { id: 1, name: "Yoshinoya – Parkson Hùng Vương", brand: "Yoshinoya", area: "HCM", district: "Q1", status: "active" },
  { id: 2, name: "Yoshinoya – Lotte Mart Q7", brand: "Yoshinoya", area: "HCM", district: "Q7", status: "active" },
  { id: 3, name: "Marukame Udon – Bến Thành", brand: "Marukame", area: "HCM", district: "Q1", status: "active" },
  { id: 4, name: "Marukame Udon – Aeon Tân Phú", brand: "Marukame", area: "HCM", district: "Tân Phú", status: "active" },
  { id: 5, name: "Coco Ichibanya – Vincom Đồng Khởi", brand: "Coco", area: "HCM", district: "Q1", status: "active" },
  { id: 6, name: "Coco Ichibanya – Aeon Bình Tân", brand: "Coco", area: "HCM", district: "Bình Tân", status: "maintenance" },
  { id: 7, name: "Pepper Lunch – Crescent Mall", brand: "Pepper Lunch", area: "HCM", district: "Q7", status: "active" },
  { id: 8, name: "Tokyo Deli – Saigon Center", brand: "Tokyo Deli", area: "HCM", district: "Q1", status: "active" },
];

const qscStaff = [
  { id: 1, name: "Nguyễn Văn A", code: "QSC001", activeTask: 3, completedTask: 45, phone: "0901234567" },
  { id: 2, name: "Trần Thị B", code: "QSC002", activeTask: 2, completedTask: 52, phone: "0907654321" },
  { id: 3, name: "Lê Minh C", code: "QSC003", activeTask: 4, completedTask: 38, phone: "0912345678" },
  { id: 4, name: "Phạm Thu D", code: "QSC004", activeTask: 1, completedTask: 48, phone: "0909876543" },
];

const checklistTemplates = [
  { id: 1, code: "QSC1", name: "Kiểm tra toàn diện", category: "Định kỳ", items: 45, estimateTime: "2-3 giờ", description: "Kiểm tra tất cả các tiêu chí QSC" },
  { id: 2, code: "QSC2", name: "Kiểm tra nhanh", category: "Định kỳ", items: 20, estimateTime: "1 giờ", description: "Kiểm tra các tiêu chí cơ bản" },
  { id: 3, code: "QSC3", name: "Follow-up khắc phục", category: "Đột xuất", items: 15, estimateTime: "45 phút", description: "Kiểm tra lại các vấn đề đã phát hiện" },
  { id: 4, code: "MS", name: "Mystery Shopper", category: "Đặc biệt", items: 30, estimateTime: "1.5 giờ", description: "Đánh giá trải nghiệm khách hàng" },
  { id: 5, code: "FOOD", name: "An toàn thực phẩm", category: "Chuyên sâu", items: 35, estimateTime: "2 giờ", description: "Kiểm tra vệ sinh ATTP" },
  { id: 6, code: "SERVICE", name: "Chất lượng phục vụ", category: "Chuyên sâu", items: 25, estimateTime: "1.5 giờ", description: "Đánh giá kỹ năng phục vụ" },
];

const initialInspections = [
  {
    id: 1,
    code: "PKT-001",
    storeId: 1,
    storeName: "Yoshinoya – Parkson Hùng Vương",
    brand: "Yoshinoya",
    checklistCode: "QSC1",
    checklistName: "Kiểm tra toàn diện",
    qscId: null,
    qscName: null,
    status: "Chờ phân công",
    createdDate: "2025-12-08",
    dueDate: null,
    completedDate: null,
    score: null,
  },
  {
    id: 2,
    code: "PKT-002",
    storeId: 3,
    storeName: "Marukame Udon – Bến Thành",
    brand: "Marukame",
    checklistCode: "QSC2",
    checklistName: "Kiểm tra nhanh",
    qscId: 1,
    qscName: "Nguyễn Văn A",
    status: "Đang kiểm tra",
    createdDate: "2025-12-09",
    dueDate: "2025-12-14",
    completedDate: null,
    score: null,
  },
  {
    id: 3,
    code: "PKT-003",
    storeId: 5,
    storeName: "Coco Ichibanya – Vincom Đồng Khởi",
    brand: "Coco",
    checklistCode: "MS",
    checklistName: "Mystery Shopper",
    qscId: 2,
    qscName: "Trần Thị B",
    status: "Hoàn thành",
    createdDate: "2025-12-05",
    dueDate: "2025-12-10",
    completedDate: "2025-12-09",
    score: 92,
  },
];

// --------------------------------------------

const TaskManager: React.FC = () => {
  const [inspections, setInspections] = useState(initialInspections);
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [assignTarget, setAssignTarget] = useState<any | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterBrand, setFilterBrand] = useState<string | null>(null);

  // ---------------- Thống kê ----------------
  const totalInspections = inspections.length;
  const pendingAssignment = inspections.filter(i => i.status === "Chờ phân công").length;
  const inProgress = inspections.filter(i => i.status === "Đang kiểm tra").length;
  const completedInspections = inspections.filter(i => i.score !== null);
  const avgScore =
    completedInspections.length > 0
      ? Math.round(
          completedInspections.reduce((sum, i) => sum + (i.score || 0), 0) /
            completedInspections.length
        )
      : 0;

  // ---------------- Bộ lọc ----------------
  const filteredInspections = inspections.filter((inspection) => {
    if (filterStatus && inspection.status !== filterStatus) return false;
    if (filterBrand && inspection.brand !== filterBrand) return false;
    return true;
  });

  // ---------------- Cột bảng ----------------
  const inspectionColumns = [
    {
      title: "Mã phiếu",
      dataIndex: "code",
      key: "code",
      render: (code: string) => (
        <span style={{ fontWeight: 500, color: "#1890ff" }}>{code}</span>
      ),
    },
    {
      title: "Nhà hàng",
      dataIndex: "storeName",
      key: "storeName",
      render: (name: string, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <Tag color="blue" style={{ marginTop: 4 }}>
            {record.brand}
          </Tag>
        </div>
      ),
    },
    {
      title: "Biểu mẫu",
      dataIndex: "checklistCode",
      key: "checklistCode",
      render: (code: string, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{code}</div>
          <div style={{ fontSize: 12, color: "#666" }}>
            {record.checklistName}
          </div>
        </div>
      ),
    },
    {
      title: "QC thực hiện",
      dataIndex: "qscName",
      key: "qscName",
      render: (name: string | null) =>
        name ? (
          <span>
            <UserOutlined style={{ marginRight: 4 }} />
            {name}
          </span>
        ) : (
          <span style={{ color: "#999" }}>Chưa phân công</span>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const config: any = {
          "Chờ phân công": { color: "default", icon: <ClockCircleOutlined /> },
          "Đã phân công": { color: "processing", icon: <CalendarOutlined /> }, // ✅ thêm mới
          "Đang kiểm tra": { color: "blue", icon: <FormOutlined /> },
          "Hoàn thành": { color: "success", icon: <CheckCircleOutlined /> },
        };
        const cfg = config[status] || { color: "default", icon: null }; // ✅ fallback an toàn
        return (
          <Tag color={cfg.color} icon={cfg.icon}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
    },
    {
      title: "Deadline",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date: string | null) => date || "-",
    },
    {
      title: "Điểm số",
      dataIndex: "score",
      key: "score",
      render: (score: number | null) =>
        score !== null ? (
          <span
            style={{
              fontWeight: 500,
              color:
                score >= 90
                  ? "#52c41a"
                  : score >= 80
                  ? "#faad14"
                  : "#ff4d4f",
            }}
          >
            {score}
          </span>
        ) : (
          <span style={{ color: "#999" }}>-</span>
        ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          {record.status === "Chờ phân công" && (
            <Button
              size="small"
              type="link"
              icon={<UserOutlined />}
              onClick={() => setAssignTarget(record)}
            >
              Phân công
            </Button>
          )}
          <Button size="small" icon={<EyeOutlined />} type="link">
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  // ---------------- Render ----------------
  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>
            Quản lý Phiếu Kiểm tra Chất lượng
          </h1>
          <p style={{ color: "#666", margin: "4px 0 0" }}>
            Tạo và phân công phiếu kiểm tra QSC cho các nhà hàng
          </p>
        </Col>
        <Col>
          {!isCreateVisible && !assignTarget && (
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateVisible(true)}
            >
              Tạo phiếu kiểm tra
            </Button>
          )}
        </Col>
      </Row>

      {/* Form tạo phiếu kiểm tra */}
      {isCreateVisible && (
        <CreateInspectionSimple
          onCancel={() => setIsCreateVisible(false)}
          onCreate={(newInspection) => {
            setInspections([newInspection, ...inspections]);
            setIsCreateVisible(false);
          }}
          stores={stores}
          checklistTemplates={checklistTemplates}
        />
      )}

      {/* Phân công QC */}
      {assignTarget && (
        <PageQscAvailability
          inspection={assignTarget}
          qscStaff={qscStaff}
          onCancel={() => setAssignTarget(null)}
          onAssign={(updated) => {
            setInspections((prev) =>
              prev.map((i) => (i.id === updated.id ? updated : i))
            );
            setAssignTarget(null);
          }}
        />
      )}

      {/* Dashboard + Bảng */}
      {!isCreateVisible && !assignTarget && (
        <>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Tổng phiếu kiểm tra"
                  value={totalInspections}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Chờ phân công"
                  value={pendingAssignment}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Đang kiểm tra"
                  value={inProgress}
                  prefix={<FormOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Điểm TB"
                  value={avgScore || "-"}
                  suffix={avgScore ? "/100" : ""}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{
                    color:
                      avgScore >= 90
                        ? "#52c41a"
                        : avgScore >= 80
                        ? "#faad14"
                        : "#ff4d4f",
                  }}
                />
              </Card>
            </Col>
          </Row>

          <Card
            title={
              <>
                <FileTextOutlined style={{ marginRight: 8 }} />
                Danh sách phiếu kiểm tra
              </>
            }
            extra={
              <Space>
                <Select
                  placeholder="Lọc theo trạng thái"
                  style={{ width: 160 }}
                  allowClear
                  onChange={(v) => setFilterStatus(v)}
                >
                  <Option value="Chờ phân công">Chờ phân công</Option>
                  <Option value="Đã phân công">Đã phân công</Option> {/* ✅ thêm dòng này */}
                  <Option value="Đang kiểm tra">Đang kiểm tra</Option>
                  <Option value="Hoàn thành">Hoàn thành</Option>
                </Select>
                <Select
                  placeholder="Lọc theo thương hiệu"
                  style={{ width: 160 }}
                  allowClear
                  onChange={(v) => setFilterBrand(v)}
                >
                  <Option value="Yoshinoya">Yoshinoya</Option>
                  <Option value="Marukame">Marukame</Option>
                  <Option value="Coco">Coco</Option>
                  <Option value="Pepper Lunch">Pepper Lunch</Option>
                  <Option value="Tokyo Deli">Tokyo Deli</Option>
                </Select>
              </Space>
            }
          >
            <Table
              columns={inspectionColumns}
              dataSource={filteredInspections}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1000 }}
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default TaskManager;
