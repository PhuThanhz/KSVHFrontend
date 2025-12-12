import React, { useState } from "react";
import {
  Card,
  Table,
  Typography,
  Button,
  Drawer,
  Space,
  Select,
  Input,
  Modal,
  message,
  Badge,
  Tooltip,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  DownloadOutlined,
  EditOutlined,
  FileTextOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import OCChecklistForm from "../components/OCChecklistForm";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

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
  category: "A" | "B" | "C" | "D" | "E";
}

const OCChecklist: React.FC = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [searchText, setSearchText] = useState("");
  const [newReviewModal, setNewReviewModal] = useState(false);
  const [reviewerName, setReviewerName] = useState("");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");

  const restaurants: Restaurant[] = [
    {
      key: "1",
      name: "MARUGAME UDON - TÂN PHÚ",
      location: "Tân Phú, HCM",
      type: "OC Checklist",
      score: 4.8,
      lastReview: "28/07/2025",
      status: "excellent",
      reviewCount: 5,
      criticalIssues: 0,
      category: "A",
    },
    {
      key: "2",
      name: "MARUGAME UDON - QUẬN 1",
      location: "Quận 1, HCM",
      type: "OC Checklist",
      score: 4.3,
      lastReview: "20/07/2025",
      status: "good",
      reviewCount: 4,
      criticalIssues: 0,
      category: "B",
    },
    {
      key: "3",
      name: "MARUGAME UDON - BÌNH THẠNH",
      location: "Bình Thạnh, HCM",
      type: "OC Checklist",
      score: 3.7,
      lastReview: "15/07/2025",
      status: "needs-improvement",
      reviewCount: 3,
      criticalIssues: 2,
      category: "C",
    },
    {
      key: "4",
      name: "MARUGAME UDON - QUẬN 7",
      location: "Quận 7, HCM",
      type: "OC Checklist",
      score: 4.4,
      lastReview: "25/07/2025",
      status: "good",
      reviewCount: 6,
      criticalIssues: 0,
      category: "B",
    },
    {
      key: "5",
      name: "MARUGAME UDON - THỦ ĐỨC",
      location: "Thủ Đức, HCM",
      type: "OC Checklist",
      score: 3.9,
      lastReview: "18/07/2025",
      status: "needs-improvement",
      reviewCount: 4,
      criticalIssues: 1,
      category: "C",
    },
  ];

  const filterRestaurants = restaurants.filter((r) => {
    const matchFilter =
      filter === "all" ||
      (filter === "high" && r.score >= 4.5) ||
      (filter === "medium" && r.score >= 4 && r.score < 4.5) ||
      (filter === "low" && r.score < 4);

    const matchSearch =
      searchText === "" ||
      r.name.toLowerCase().includes(searchText.toLowerCase()) ||
      r.location.toLowerCase().includes(searchText.toLowerCase());

    return matchFilter && matchSearch;
  });

  const needImprovement = restaurants.filter((r) => r.score < 4).length;
  const excellent = restaurants.filter((r) => r.score >= 4.5).length;

  const handleExport = () => message.success("Đang xuất báo cáo Excel...");

  const handleView = (record: Restaurant) => {
    message.info(`Xem chi tiết: ${record.name}`);
  };

  const handleDelete = (key: string) => {
    message.success("Đã xóa bản ghi kiểm tra!");
  };

  const handleStartReview = () => {
    if (!selectedRestaurantId) {
      message.error("Vui lòng chọn nhà hàng!");
      return;
    }
    const restaurant = restaurants.find((r) => r.key === selectedRestaurantId);
    if (restaurant) {
      setSelectedRestaurant(restaurant);
      setNewReviewModal(false);
      setOpenDrawer(true);
      message.success("Đã chuyển sang form kiểm tra");
    }
  };

  const columns = [
    {
      title: "Nhà hàng",
      dataIndex: "name",
      width: "28%",
      render: (_: string, row: Restaurant) => (
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileTextOutlined className="text-lg text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-800 text-sm">{row.name}</span>
              {row.criticalIssues > 0 && (
                <Badge count={row.criticalIssues} className="ml-1" />
              )}
            </div>
            <Text type="secondary" className="text-xs">{row.location}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Lần kiểm tra",
      dataIndex: "reviewCount",
      width: "10%",
      align: "center" as const,
      render: (count: number) => (
        <span className="text-sm text-gray-600 font-medium">Lần {count}</span>
      ),
    },
    {
      title: "Ngày kiểm tra",
      dataIndex: "lastReview",
      width: "12%",
      render: (date: string) => (
        <div className="flex items-center gap-1 text-gray-600">
          <ClockCircleOutlined />
          <span className="text-sm">{date}</span>
        </div>
      ),
    },
    {
      title: "Điểm / Tỷ lệ",
      dataIndex: "score",
      width: "12%",
      align: "center" as const,
      sorter: (a: Restaurant, b: Restaurant) => a.score - b.score,
      render: (score: number) => {
        const percent = (score / 5) * 100;
        let bgColor = "bg-gray-100";
        let textColor = "text-gray-700";
        
        if (percent >= 90) {
          bgColor = "bg-green-50";
          textColor = "text-green-700";
        } else if (percent >= 80) {
          bgColor = "bg-yellow-50";
          textColor = "text-yellow-700";
        } else if (percent < 80) {
          bgColor = "bg-red-50";
          textColor = "text-red-700";
        }
        
        return (
          <div className={`inline-flex flex-col items-center py-1 px-3 rounded-lg ${bgColor}`}>
            <span className={`font-bold text-base ${textColor}`}>{score.toFixed(1)}</span>
            <span className={`text-xs ${textColor}`}>{percent.toFixed(0)}%</span>
          </div>
        );
      },
    },
    {
      title: "Loại",
      dataIndex: "category",
      width: "8%",
      align: "center" as const,
      render: (cat: string) => {
        const colorMap: Record<string, string> = {
          A: "bg-green-100 text-green-700 border-green-200",
          B: "bg-blue-100 text-blue-700 border-blue-200",
          C: "bg-orange-100 text-orange-700 border-orange-200",
          D: "bg-red-100 text-red-700 border-red-200",
          E: "bg-gray-100 text-gray-700 border-gray-200",
        };
        return (
          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border font-semibold ${colorMap[cat]}`}>
            {cat}
          </span>
        );
      },
    },
    {
      title: "Xếp loại",
      dataIndex: "status",
      width: "12%",
      render: (status: string) => {
        const statusMap: Record<string, { text: string; class: string }> = {
          excellent: { text: "Xuất sắc", class: "bg-green-50 text-green-700 border-green-200" },
          good: { text: "Tốt", class: "bg-blue-50 text-blue-700 border-blue-200" },
          "needs-improvement": { text: "Cần cải thiện", class: "bg-orange-50 text-orange-700 border-orange-200" },
        };
        const s = statusMap[status];
        return (
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${s.class}`}>
            {s.text}
          </span>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: "10%",
      align: "center" as const,
      render: (_: any, row: Restaurant) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleView(row)}
            />
          </Tooltip>
          <Tooltip title="Kiểm tra mới">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedRestaurant(row);
                setOpenDrawer(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xác nhận xóa"
              description="Bạn có chắc muốn xóa bản ghi này?"
              onConfirm={() => handleDelete(row.key)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="mb-8">
        <Card className="shadow-sm border-0">
          <div className="flex items-start justify-between">
            <div>
              <Title level={3} className="!mb-2 text-gray-800">
                Kiểm soát vận hành – OC Checklist
              </Title>
              <Paragraph className="!mb-0 text-gray-600">
                Quản lý và theo dõi kiểm soát vận hành (Tài chính, Hàng hóa, Nhân sự)
              </Paragraph>
            </div>
            <Button 
              type="primary" 
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setNewReviewModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Kiểm tra mới
            </Button>
          </div>
        </Card>
      </div>

      {/* STATS CARDS */}
      {restaurants.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Tổng nhà hàng</div>
                <div className="text-3xl font-bold text-gray-900">{restaurants.length}</div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                <FileTextOutlined className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => setFilter("low")}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Cần cải thiện</div>
                <div className="text-3xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                  {needImprovement}
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <WarningOutlined className="text-2xl text-red-600" />
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => setFilter("high")}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Xuất sắc</div>
                <div className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  {excellent}
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircleOutlined className="text-2xl text-green-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TABLE SECTION */}
      <Card className="shadow-sm border-0 rounded-xl">
        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 pb-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
            <Input
              placeholder="Tìm kiếm nhà hàng..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full sm:w-80"
              size="large"
              allowClear
            />
            <Select 
              value={filter} 
              onChange={setFilter} 
              className="w-full sm:w-56"
              size="large"
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="high">≥ 4.5 (Xuất sắc)</Option>
              <Option value="medium">4.0 - 4.49 (Tốt)</Option>
              <Option value="low">&lt; 4.0 (Cần cải thiện)</Option>
            </Select>
          </div>
          <Button 
            icon={<DownloadOutlined />} 
            onClick={handleExport}
            size="large"
            className="w-full sm:w-auto"
          >
            Xuất báo cáo
          </Button>
        </div>

        {/* TABLE TITLE */}
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Danh sách nhà hàng
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filterRestaurants.length} nhà hàng)
            </span>
          </h3>
        </div>

        <Table
          dataSource={filterRestaurants}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} nhà hàng`,
          }}
          rowKey="key"
          className="overflow-x-auto"
        />
      </Card>

      {/* DRAWER - COMPONENT FORM */}
      <Drawer
        title={
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌸</span>
            <span>{`OC Checklist - ${selectedRestaurant?.name || ""}`}</span>
          </div>
        }
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        width="100%"
        styles={{
          header: {
            background: 'linear-gradient(135deg, #fff5f7 0%, #ffe4ec 50%, #ffd1dc 100%)',
            borderBottom: '1px solid rgba(255, 182, 193, 0.3)',
          },
          body: {
            padding: 0,
          }
        }}
      >
        {selectedRestaurant && (
          <OCChecklistForm 
            restaurant={selectedRestaurant} 
            onClose={() => setOpenDrawer(false)} 
          />
        )}
      </Drawer>

      {/* MODAL CREATE NEW REVIEW */}
      <Modal
        title={<span className="text-lg font-semibold">Tạo kiểm tra mới</span>}
        open={newReviewModal}
        onCancel={() => {
          setNewReviewModal(false);
          setSelectedRestaurantId("");
          setReviewerName("");
        }}
        onOk={handleStartReview}
        okText="Bắt đầu kiểm tra"
        cancelText="Hủy"
        width={600}
      >
        <div className="py-4 space-y-5">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Chọn nhà hàng</label>
            <Select
              placeholder="Chọn nhà hàng cần kiểm tra"
              className="w-full"
              size="large"
              value={selectedRestaurantId}
              onChange={setSelectedRestaurantId}
            >
              {restaurants.map((r) => (
                <Option key={r.key} value={r.key}>
                  <div className="flex items-center justify-between">
                    <span>{r.name}</span>
                    <Text type="secondary" className="text-xs">({r.location})</Text>
                  </div>
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-2">Người kiểm tra</label>
            <Input
              placeholder="Nhập tên người kiểm tra"
              size="large"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OCChecklist;