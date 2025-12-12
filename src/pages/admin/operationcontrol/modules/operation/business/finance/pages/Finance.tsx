import React, { useState } from "react";
import {
  Card,
  Table,
  Typography,
  Button,
  Tag,
  Drawer,
  Space,
  Row,
  Col,
  Select,
  Input,
  DatePicker,
  Modal,
  Form,
  message,
  Tooltip,
  Statistic,
  Progress,
  Badge,
  Timeline,
  Alert,
  Collapse,
  Radio,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  DownloadOutlined,
  HistoryOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  TrophyOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LineChartOutlined,
  BellOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import FinanceChecklistForm from "../components/FinanceChecklistForm";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// ============================================
// Interfaces
// ============================================
interface Restaurant {
  key: string;
  name: string;
  location: string;
  type: string;
  score: number;
  lastReview: string;
  status: "excellent" | "good" | "needs-improvement";
  reviewCount: number;
  criticalIssues: number;
}

// ============================================
// Mock Data
// ============================================
const mockChecklist = [
  {
    id: "I",
    title: "I. TÀI CHÍNH",
    items: [
      { id: "I.1.1", text: "Két sắt được niêm phong đúng quy định vào cuối ngày.", weight: 2, critical: true },
      { id: "I.1.2", text: "Chìa khóa két được giữ bởi quản lý ca, mã mở két sắt đã được vô hiệu sau lần mở/đóng két gần nhất.", weight: 2, critical: true },
      { id: "I.1.3", text: "Tiền tồn trong két có khớp với báo cáo doanh thu ghi nhận trên POS không?", weight: 2, critical: true },
    ],
  },
  {
    id: "II",
    title: "II. HÀNG HÓA",
    items: [
      { id: "II.1.1", text: "Nhà hàng có thực hiện đúng quy trình đặt hàng hay không?", weight: 1, critical: false },
      { id: "II.1.2", text: "Các nguyên vật liệu hàng hóa nhập vào nhà hàng có được cập nhật và ghi nhận đầy đủ không?", weight: 1, critical: false },
      { id: "II.1.4", text: "Không sử dụng hàng hóa hết hạn sử dụng trên bao bì.", weight: 2, critical: true },
    ],
  },
  {
    id: "III",
    title: "III. NHÂN SỰ",
    items: [
      { id: "III.1.1", text: "Các nhân sự thay đổi, điều chuyển có thông báo phê duyệt theo đúng quy định", weight: 1, critical: false },
      { id: "III.1.2", text: "Số lượng nhân viên thực tế ở nhà hàng tại thời điểm kiểm tra khớp so với dấu vân tay của hệ thống", weight: 1, critical: false },
    ],
  },
];

// ============================================
// Main Component
// ============================================
const Finance: React.FC = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState<any>(null);
  const [historyModal, setHistoryModal] = useState(false);
  const [newReviewModal, setNewReviewModal] = useState(false);
  const [trendModal, setTrendModal] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [form] = Form.useForm();

  const restaurants: Restaurant[] = [
    {
      key: "1",
      name: "MARUGAME UDON - TÂN PHÚ",
      location: "Tân Phú, HCM",
      type: "Tài chính",
      score: 92,
      lastReview: "28/07/2025",
      status: "excellent",
      reviewCount: 3,
      criticalIssues: 0,
    },
    {
      key: "2",
      name: "MARUGAME UDON - QUẬN 1",
      location: "Quận 1, HCM",
      type: "Tài chính",
      score: 85,
      lastReview: "15/06/2025",
      status: "good",
      reviewCount: 2,
      criticalIssues: 0,
    },
    {
      key: "3",
      name: "MARUGAME UDON - BÌNH THẠNH",
      location: "Bình Thạnh, HCM",
      type: "Tài chính",
      score: 74,
      lastReview: "01/05/2025",
      status: "needs-improvement",
      reviewCount: 1,
      criticalIssues: 2,
    },
    {
      key: "4",
      name: "MARUGAME UDON - QUẬN 7",
      location: "Quận 7, HCM",
      type: "Tài chính",
      score: 88,
      lastReview: "20/07/2025",
      status: "good",
      reviewCount: 4,
      criticalIssues: 0,
    },
    {
      key: "5",
      name: "MARUGAME UDON - THỦ ĐỨC",
      location: "Thủ Đức, HCM",
      type: "Tài chính",
      score: 78,
      lastReview: "10/06/2025",
      status: "needs-improvement",
      reviewCount: 2,
      criticalIssues: 1,
    },
  ];

  // Filters
  const filterRestaurants = restaurants.filter((r) => {
    const matchFilter =
      filter === "all" ||
      (filter === "high" && r.score >= 90) ||
      (filter === "medium" && r.score >= 80 && r.score < 90) ||
      (filter === "low" && r.score < 80);

    const matchSearch =
      searchText === "" ||
      r.name.toLowerCase().includes(searchText.toLowerCase()) ||
      r.location.toLowerCase().includes(searchText.toLowerCase());

    return matchFilter && matchSearch;
  });

  // Stats
  const avgScore = (restaurants.reduce((sum, r) => sum + r.score, 0) / restaurants.length).toFixed(1);
  const totalCritical = restaurants.reduce((sum, r) => sum + r.criticalIssues, 0);
  const needImprovement = restaurants.filter((r) => r.score < 80).length;
  const excellent = restaurants.filter((r) => r.score >= 90).length;

  const handleExport = () => message.success("Đang xuất báo cáo Excel...");
  const handleNewReview = () => setNewReviewModal(true);

  // Table Columns
  const restaurantColumns: ColumnsType<Restaurant> = [
    {
      title: "Nhà hàng",
      dataIndex: "name",
      width: "28%",
      render: (_: string, row: Restaurant) => (
        <Space direction="vertical" size={2}>
          <Space>
            <Text strong style={{ fontSize: 14 }}>{row.name}</Text>
            {row.criticalIssues > 0 && (
              <Badge count={row.criticalIssues} style={{ backgroundColor: "#ff4d4f" }} />
            )}
          </Space>
          <Text type="secondary" style={{ fontSize: 12 }}>{row.location}</Text>
        </Space>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      width: "8%",
      align: "center",
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "Lần BH",
      dataIndex: "reviewCount",
      width: "8%",
      align: "center",
      render: (count: number) => <Tag color="blue">Lần {count}</Tag>,
    },
    {
      title: "Ngày đánh giá",
      dataIndex: "lastReview",
      width: "12%",
      render: (date: string) => (
        <Space>
          <ClockCircleOutlined style={{ color: "#999" }} />
          <Text style={{ fontSize: 13 }}>{date}</Text>
        </Space>
      ),
    },
    {
      title: "Điểm",
      dataIndex: "score",
      width: "10%",
      align: "center",
      sorter: (a, b) => a.score - b.score,
      render: (score: number) => {
        const color = score >= 90 ? "#52c41a" : score >= 80 ? "#faad14" : "#ff4d4f";
        return <Text strong style={{ fontSize: 16, color }}>{score}</Text>;
      },
    },
    {
      title: "Tỷ lệ đạt",
      dataIndex: "score",
      width: "12%",
      align: "center",
      render: (score: number) => {
        const color = score >= 90 ? "#52c41a" : score >= 80 ? "#faad14" : "#ff4d4f";
        return <Progress percent={score} strokeColor={color} showInfo={false} size="small" />;
      },
    },
    {
      title: "Xếp loại",
      dataIndex: "status",
      width: "12%",
      render: (status: string) => {
        const statusMap: Record<string, { text: string; color: string; icon: any }> = {
          excellent: { text: "Xuất sắc", color: "#52c41a", icon: <CheckCircleOutlined /> },
          good: { text: "Tốt", color: "#faad14", icon: <CheckCircleOutlined /> },
          "needs-improvement": { text: "Cần cải thiện", color: "#ff4d4f", icon: <WarningOutlined /> },
        };
        const s = statusMap[status];
        return <Tag icon={s.icon} color={s.color}>{s.text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: "10%",
      render: (_: any, row: Restaurant) => (
        <Space size="small">
          <Tooltip title="Xem lịch sử">
            <Button
              type="text"
              icon={<HistoryOutlined />}
              onClick={() => {
                setSelectedRestaurant(row);
                setHistoryModal(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Đánh giá mới">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedRestaurant(row);
                setOpenDrawer(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0, marginBottom: 8 }}>
            Đánh giá Tài chính
          </Title>
          <Text type="secondary">Quản lý và theo dõi đánh giá tài chính định kỳ</Text>
        </Col>
        <Col>
          {totalCritical > 0 && (
            <Badge count={totalCritical}>
              <Button icon={<BellOutlined />} danger size="large" onClick={() => setAlertModal(true)}>
                Cảnh báo
              </Button>
            </Badge>
          )}
        </Col>
      </Row>

      {/* Quick Alerts */}
      {needImprovement > 0 && (
        <Alert
          message={`Có ${needImprovement} nhà hàng cần cải thiện (< 80%)`}
          type="warning"
          showIcon
          closable
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" type="link" onClick={() => setFilter("low")}>
              Xem chi tiết
            </Button>
          }
        />
      )}

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Tổng nhà hàng"
              value={restaurants.length}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Điểm trung bình"
              value={avgScore}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable onClick={() => setFilter("low")} style={{ cursor: "pointer" }}>
            <Statistic
              title="Cần cải thiện"
              value={needImprovement}
              prefix={<WarningOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable onClick={() => setFilter("high")} style={{ cursor: "pointer" }}>
            <Statistic
              title="Xuất sắc"
              value={excellent}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Additional Stats Row */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <LineChartOutlined />
                <span>Tổng quan đánh giá gần đây</span>
              </Space>
            }
            bordered={false}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="Đánh giá tuần này" value={3} suffix="/ 5" valueStyle={{ fontSize: 20 }} />
                <Progress percent={60} strokeColor="#1890ff" showInfo={false} />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Đạt chuẩn"
                  value={2}
                  suffix="/ 3"
                  valueStyle={{ fontSize: 20, color: "#52c41a" }}
                />
                <Progress percent={67} strokeColor="#52c41a" showInfo={false} />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Critical Issues"
                  value={totalCritical}
                  valueStyle={{ fontSize: 20, color: totalCritical > 0 ? "#ff4d4f" : "#52c41a" }}
                />
                <Progress
                  percent={totalCritical > 0 ? 100 : 0}
                  strokeColor="#ff4d4f"
                  showInfo={false}
                  status={totalCritical > 0 ? "exception" : "success"}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title="Đánh giá sắp tới"
            bordered={false}
            extra={<Button type="link" onClick={handleNewReview}>Tạo mới</Button>}
          >
            <Timeline
              items={[
                {
                  color: "blue",
                  children: (
                    <Space direction="vertical" size={0}>
                      <Text strong>MARUGAME - Quận 3</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>05/08/2025</Text>
                    </Space>
                  ),
                },
                {
                  color: "green",
                  children: (
                    <Space direction="vertical" size={0}>
                      <Text strong>MARUGAME - Phú Nhuận</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>10/08/2025</Text>
                    </Space>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters & Actions */}
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space size="middle" wrap>
              <Input
                placeholder="Tìm kiếm nhà hàng..."
                prefix={<SearchOutlined />}
                style={{ width: 250 }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
              <Select
                value={filter}
                onChange={setFilter}
                style={{ width: 180 }}
                suffixIcon={<FilterOutlined />}
              >
                <Option value="all">Tất cả</Option>
                <Option value="high">≥ 90% (Xuất sắc)</Option>
                <Option value="medium">80-89% (Tốt)</Option>
                <Option value="low">&lt; 80% (Cần cải thiện)</Option>
              </Select>
              <RangePicker
                style={{ width: 250 }}
                placeholder={["Từ ngày", "Đến ngày"]}
                value={dateRange}
                onChange={setDateRange}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <Button icon={<LineChartOutlined />} onClick={() => setTrendModal(true)}>
                Xu hướng
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                Xuất báo cáo
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleNewReview}>
                Đánh giá mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card
        bordered={false}
        title={
          <Space>
            <FileTextOutlined />
            <span>Danh sách nhà hàng ({filterRestaurants.length})</span>
          </Space>
        }
      >
        <Table<Restaurant>
          dataSource={filterRestaurants}
          columns={restaurantColumns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} nhà hàng`,
          }}
          rowKey="key"
          rowClassName={(record) => (record.criticalIssues > 0 ? "bg-red-50" : "")}
        />
      </Card>

      {/* Checklist Drawer */}
      <Drawer
        title={`Checklist Tài chính - ${selectedRestaurant?.name || ""}`}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        width="100%"
        bodyStyle={{ padding: 0 }}
      >
        {selectedRestaurant && (
          <FinanceChecklistForm
            restaurant={selectedRestaurant}
            checklist={mockChecklist}
            onClose={() => setOpenDrawer(false)}
          />
        )}
      </Drawer>

      {/* History Modal */}
      <Modal
        title={`Lịch sử đánh giá - ${selectedRestaurant?.name || ""}`}
        open={historyModal}
        onCancel={() => setHistoryModal(false)}
        width={900}
        footer={[<Button key="close" onClick={() => setHistoryModal(false)}>Đóng</Button>]}
      >
        <Table
          dataSource={[
            { key: "1", date: "28/07/2025", score: 92, reviewer: "Nguyễn Văn A", critical: 0 },
            { key: "2", date: "15/06/2025", score: 88, reviewer: "Trần Thị B", critical: 0 },
            { key: "3", date: "01/05/2025", score: 85, reviewer: "Lê Văn C", critical: 1 },
          ]}
          columns={[
            { title: "Ngày", dataIndex: "date" },
            {
              title: "Điểm",
              dataIndex: "score",
              render: (s: number) => {
                const color = s >= 90 ? "#52c41a" : s >= 80 ? "#faad14" : "#ff4d4f";
                return <Text strong style={{ color }}>{s}%</Text>;
              },
            },
            {
              title: "Critical Issues",
              dataIndex: "critical",
              render: (n: number) => <Tag color={n > 0 ? "red" : "green"}>{n}</Tag>,
            },
            { title: "Người đánh giá", dataIndex: "reviewer" },
            {
              title: "Chi tiết",
              render: () => <Button type="link" icon={<EyeOutlined />}>Xem</Button>,
            },
          ]}
          pagination={false}
        />
      </Modal>

      {/* Trend Modal */}
      <Modal
        title={
          <Space>
            <LineChartOutlined />
            <span>Xu hướng đánh giá</span>
          </Space>
        }
        open={trendModal}
        onCancel={() => setTrendModal(false)}
        width={800}
        footer={[<Button key="close" onClick={() => setTrendModal(false)}>Đóng</Button>]}
      >
        <div style={{ textAlign: "center", padding: 40 }}>
          <Text type="secondary">Biểu đồ xu hướng sẽ hiển thị tại đây</Text>
        </div>
      </Modal>

      {/* Alert Modal */}
      <Modal
        title={
          <Space>
            <BellOutlined style={{ color: "#ff4d4f" }} />
            <span>Cảnh báo Critical Issues</span>
          </Space>
        }
        open={alertModal}
        onCancel={() => setAlertModal(false)}
        width={700}
        footer={[
          <Button key="close" type="primary" onClick={() => setAlertModal(false)}>
            Đã hiểu
          </Button>,
        ]}
      >
        <Alert message="Các nhà hàng có vấn đề nghiêm trọng" type="error" showIcon style={{ marginBottom: 16 }} />
        {restaurants
          .filter((r) => r.criticalIssues > 0)
          .map((r) => (
            <Card key={r.key} style={{ marginBottom: 12 }} size="small">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Space>
                  <Badge count={r.criticalIssues} />
                  <Text strong>{r.name}</Text>
                </Space>
                <Text type="secondary">Cần xử lý ngay lập tức</Text>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setSelectedRestaurant(r);
                    setAlertModal(false);
                    setOpenDrawer(true);
                  }}
                >
                  Xem chi tiết
                </Button>
              </Space>
            </Card>
          ))}
      </Modal>

      {/* New Review Modal */}
      <Modal
        title="Tạo đánh giá mới"
        open={newReviewModal}
        onCancel={() => {
          setNewReviewModal(false);
          form.resetFields();
        }}
        onOk={() => {
          form.validateFields().then((values) => {
            const restaurant = restaurants.find((r) => r.key === values.restaurantId);
            if (restaurant) {
              setSelectedRestaurant(restaurant);
              setNewReviewModal(false);
              setOpenDrawer(true);
              form.resetFields();
              message.success("Đã chuyển sang form đánh giá");
            }
          });
        }}
        okText="Đồng ý"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Chọn nhà hàng"
            name="restaurantId"
            rules={[{ required: true, message: "Vui lòng chọn nhà hàng" }]}
          >
            <Select placeholder="Chọn nhà hàng" size="large">
              {restaurants.map((r) => (
                <Option key={r.key} value={r.key}>
                  {r.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Ngày đánh giá"
            name="reviewDate"
            rules={[{ required: true, message: "Vui lòng chọn ngày đánh giá" }]}
          >
            <DatePicker style={{ width: "100%" }} size="large" format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            label="Người đánh giá"
            name="reviewer"
            rules={[{ required: true, message: "Vui lòng nhập tên người đánh giá" }]}
          >
            <Input placeholder="Nhập tên người đánh giá" size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Finance;