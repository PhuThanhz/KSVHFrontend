import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Table,
  Space,
  Modal,
  Input,
  DatePicker,
  message,
  Tooltip,
  Popconfirm,
  Select,
} from "antd";
import { 
  EditOutlined, 
  EyeOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  PlusOutlined,
  CalendarOutlined,
  FileTextOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

// Import component QSCFormCreatePage
import QSCFormCreatePage from "../components/QSCFormCreatePage";

const { Title, Paragraph, Text } = Typography;

// ✅ MOCK Component cho demo (thay bằng import thật)


const QSCFormOverviewPage: React.FC = () => {
  // ✅ FIX: Di chuyển useRef vào TRONG component
  // const elementRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  const [templates, setTemplates] = useState([
    { id: 1, name: "Checklist_MS_Yoshinoya", lastUpdated: "2025-01-10", status: "active", category: "Mystery Shopper" },
    { id: 2, name: "Checklist_MS_Coco Ichibanya", lastUpdated: "2025-01-12", status: "active", category: "Mystery Shopper" },
    { id: 3, name: "Checklist_MS_Conservo", lastUpdated: "2025-01-05", status: "inactive", category: "Mystery Shopper" },
    { id: 4, name: "Checklist_MS_Marukame Udon", lastUpdated: "2025-01-15", status: "active", category: "Mystery Shopper" },
    { id: 5, name: "Checklist_MS_Ushi Mania", lastUpdated: "2025-01-14", status: "draft", category: "Mystery Shopper" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formStatus, setFormStatus] = useState("");
  const [formDate, setFormDate] = useState<any>(null);

  // ==========================
  //  FILTER & SEARCH
  // ==========================
  const filteredTemplates = templates.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = filterStatus === "all" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // ==========================
  //  HANDLE EDIT TEMPLATE
  // ==========================
  const handleEdit = (record: any) => {
    setEditingItem(record);
    setFormName(record.name);
    setFormCategory(record.category);
    setFormStatus(record.status);
    setFormDate(dayjs(record.lastUpdated));
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formName || !formCategory || !formStatus || !formDate) {
      message.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const updated = templates.map((item) =>
      item.id === editingItem.id
        ? {
            ...item,
            name: formName,
            lastUpdated: formDate.format("YYYY-MM-DD"),
            status: formStatus,
            category: formCategory,
          }
        : item
    );
    setTemplates(updated);
    setIsModalOpen(false);
    message.success("Cập nhật biểu mẫu thành công!");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormName("");
    setFormCategory("");
    setFormStatus("");
    setFormDate(null);
  };

  // ==========================
  //  HANDLE DELETE
  // ==========================
  const handleDelete = (id: number) => {
    setTemplates(templates.filter(item => item.id !== id));
    message.success("Đã xóa biểu mẫu!");
  };

  // ==========================
  //  HANDLE VIEW
  // ==========================
  const handleView = (record: any) => {
    message.info(`Xem biểu mẫu: ${record.name}`);
  };

  // ==========================
  //  NAVIGATE TO CREATE PAGE
  // ==========================
  const handleCreateNew = () => {
    console.log("Tạo biểu mẫu mới - showCreateForm:", true);
    setShowCreateForm(true);
  };
  
  const handleCloseCreateForm = () => {
    console.log("Đóng form - showCreateForm:", false);
    setShowCreateForm(false);
  };

  // ==========================
  //  STATUS TAG
  // ==========================
  const getStatusTag = (status: string) => {
    const statusConfig: any = {
      active: { class: "bg-green-50 text-green-700 border-green-200", text: "Đang dùng" },
      inactive: { class: "bg-red-50 text-red-700 border-red-200", text: "Ngừng dùng" },
      draft: { class: "bg-orange-50 text-orange-700 border-orange-200", text: "Bản nháp" },
    };
    const config = statusConfig[status] || { class: "bg-gray-50 text-gray-700 border-gray-200", text: status };
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const columns = [
    {
      title: "Tên biểu mẫu",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileTextOutlined className="text-lg text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-800 text-sm mb-1">{text}</div>
            <Text type="secondary" className="text-xs">{record.category}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getStatusTag(status),
      width: 130,
    },
    {
      title: "Cập nhật lần cuối",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      render: (date: string) => (
        <div className="flex items-center gap-1 text-gray-600">
          <CalendarOutlined />
          <span className="text-sm">{dayjs(date).format("DD/MM/YYYY")}</span>
        </div>
      ),
      width: 180,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 180,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              size="small" 
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xác nhận xóa"
              description="Bạn có chắc muốn xóa biểu mẫu này?"
              onConfirm={() => handleDelete(record.id)}
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

  // ✅ FIX: Hiển thị form create khi showCreateForm = true
  if (showCreateForm) {
    return (
      <QSCFormCreatePage onClose={handleCloseCreateForm} />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="mb-8">
        <Card className="shadow-sm border-0">
          <div className="flex items-start justify-between">
            <div>
              <Title level={3} className="!mb-2 text-gray-800">
                Quản lý biểu mẫu QSC
              </Title>
              <Paragraph className="!mb-0 text-gray-600">
                Theo dõi, quản lý và tạo mới biểu mẫu kiểm tra chất lượng (QSC).
              </Paragraph>
            </div>
            <Button 
              type="primary" 
              size="large"
              icon={<PlusOutlined />}
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Tạo biểu mẫu mới
            </Button>
          </div>
        </Card>
      </div>

      {/* STATS CARDS */}
      {templates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Tổng biểu mẫu</div>
                <div className="text-3xl font-bold text-gray-900">{templates.length}</div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                <FileTextOutlined className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Đang sử dụng</div>
                <div className="text-3xl font-bold text-gray-900">
                  {templates.filter(t => t.status === "active").length}
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Bản nháp</div>
                <div className="text-3xl font-bold text-gray-900">
                  {templates.filter(t => t.status === "draft").length}
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center">
                <EditOutlined className="text-2xl text-orange-600" />
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
              placeholder="Tìm kiếm biểu mẫu..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full sm:w-80"
              size="large"
              allowClear
            />
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              className="w-full sm:w-56"
              size="large"
              suffixIcon={<FilterOutlined />}
              options={[
                { label: "Tất cả trạng thái", value: "all" },
                { label: "Đang dùng", value: "active" },
                { label: "Bản nháp", value: "draft" },
                { label: "Ngừng dùng", value: "inactive" },
              ]}
            />
          </div>
        </div>

        {/* TABLE TITLE */}
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Danh sách biểu mẫu
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredTemplates.length} biểu mẫu)
            </span>
          </h3>
        </div>

        <Table
          dataSource={filteredTemplates}
          columns={columns}
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} biểu mẫu`,
            showSizeChanger: true,
          }}
          className="overflow-x-auto"
        />
      </Card>

      {/* EDIT MODAL */}
      <Modal
        title={
          <span className="text-lg font-semibold">
            Chỉnh sửa biểu mẫu
          </span>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={handleSave}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        width={600}
      >
        <div className="mt-4 space-y-5">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Tên biểu mẫu</label>
            <Input 
              placeholder="Nhập tên biểu mẫu" 
              size="large"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Danh mục</label>
            <Select
              size="large"
              placeholder="Chọn danh mục"
              className="w-full"
              value={formCategory}
              onChange={setFormCategory}
              options={[
                { label: "Mystery Shopper", value: "Mystery Shopper" },
                { label: "Quality Check", value: "Quality Check" },
                { label: "Safety Audit", value: "Safety Audit" },
              ]}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Trạng thái</label>
            <Select
              size="large"
              placeholder="Chọn trạng thái"
              className="w-full"
              value={formStatus}
              onChange={setFormStatus}
              options={[
                { label: "Đang dùng", value: "active" },
                { label: "Bản nháp", value: "draft" },
                { label: "Ngừng dùng", value: "inactive" },
              ]}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Ngày cập nhật</label>
            <DatePicker 
              format="DD/MM/YYYY" 
              className="w-full"
              size="large"
              value={formDate}
              onChange={setFormDate}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QSCFormOverviewPage;