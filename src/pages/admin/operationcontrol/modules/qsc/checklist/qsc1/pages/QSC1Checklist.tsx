import React, { useState, useMemo } from "react";
import {
  Card,
  Table,
  Input,
  Typography,
  Tag,
  Radio,
  Space,
  Statistic,
  Divider,
  Row,
  Col,
  Button,
  Alert,
  Progress,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

// =====================
// 1️⃣ Import dữ liệu từ file data
// =====================
// Chú ý: Đường dẫn có thể là "./data/datachecklist" hoặc "../data/datachecklist" 
// tùy vào cấu trúc folder của bạn
import { checklistDataSource } from "../../../../../data/datachecklist";


// =====================
// 2️⃣ Kiểu dữ liệu
// =====================
interface ChecklistItem {
  id: string;
  section: string;
  score: number;
  criterion: string;
  requirement: string;
  answer?: "Có" | "Không" | "N/A";
  reason?: string;
  note?: string;
  isCritical?: boolean;
}

interface BasicInfo {
  time: string;
  date: string;
  restaurant: string;
  auditor: string;
}

// =====================
// 3️⃣ Component chính
// =====================
const QSC1Checklist: React.FC = () => {
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    time: "",
    date: "",
    restaurant: "",
    auditor: "",
  });

  const [data, setData] = useState<ChecklistItem[]>(checklistDataSource);

  // Hàm cập nhật giá trị
  const handleUpdate = (id: string, field: keyof ChecklistItem, value: any) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Hàm reset dữ liệu
  const handleReset = () => {
    setData(checklistDataSource);
    setBasicInfo({
      time: "",
      date: "",
      restaurant: "",
      auditor: "",
    });
  };

  // =====================
  // 4️⃣ Tính điểm
  // =====================
  const scoreCalculation = useMemo(() => {
    let totalScore = 0;
    let maxScore = 0;
    let criticalErrors = 0;

    data.forEach((item) => {
      if (item.answer === "Có") {
        totalScore += item.score;
      }
      if (item.answer !== "N/A") {
        maxScore += item.score;
      }
      if (item.answer === "Không" && item.isCritical) {
        criticalErrors++;
      }
    });

    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    let grade = "E";
    let gradeStatus: "success" | "exception" | "active" | "normal" = "exception";
    let gradeDesc = "Kém";

    if (percentage >= 90) {
      grade = "A";
      gradeStatus = "success";
      gradeDesc = "Xuất sắc";
    } else if (percentage >= 80) {
      grade = "B";
      gradeStatus = "success";
      gradeDesc = "Đạt yêu cầu";
    } else if (percentage >= 70) {
      grade = "C";
      gradeStatus = "normal";
      gradeDesc = "Không đạt yêu cầu";
    } else if (percentage >= 60) {
      grade = "D";
      gradeStatus = "normal";
      gradeDesc = "Cần cải thiện";
    }

    return {
      totalScore,
      maxScore,
      percentage,
      grade,
      gradeStatus,
      gradeDesc,
      criticalErrors,
    };
  }, [data]);

  // =====================
  // 5️⃣ Export dữ liệu
  // =====================
  const handleExport = () => {
    const exportData = {
      basicInfo,
      checklist: data,
      score: scoreCalculation,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `yoshinoya-qsc-${basicInfo.restaurant || "report"}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // =====================
  // 6️⃣ Cấu hình cột bảng
  // =====================
  const columns: ColumnsType<ChecklistItem> = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      width: 60,
      align: "center",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Phần",
      dataIndex: "section",
      key: "section",
      width: 200,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Tiêu chuẩn",
      dataIndex: "criterion",
      key: "criterion",
      width: 200,
      render: (text, record) => (
        <Text strong style={{ color: record.isCritical ? "#ff4d4f" : "#000" }}>
          {record.isCritical && "(*) "}
          {text}
        </Text>
      ),
    },
    {
      title: "Yêu cầu",
      dataIndex: "requirement",
      key: "requirement",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Điểm",
      dataIndex: "score",
      key: "score",
      width: 80,
      align: "center",
      render: (score) => <Tag color="purple">{score}</Tag>,
    },
    {
      title: "Câu trả lời",
      key: "answer",
      width: 200,
      align: "center",
      render: (_, record) => (
        <Radio.Group
          value={record.answer}
          onChange={(e) => handleUpdate(record.id, "answer", e.target.value)}
          buttonStyle="solid"
          size="small"
        >
          <Radio.Button value="Có">Có</Radio.Button>
          <Radio.Button value="Không">Không</Radio.Button>
          <Radio.Button value="N/A">N/A</Radio.Button>
        </Radio.Group>
      ),
    },
    {
      title: "Lý do không đạt",
      dataIndex: "reason",
      key: "reason",
      width: 180,
      render: (_, record) => (
        <TextArea
          rows={2}
          value={record.reason}
          onChange={(e) => handleUpdate(record.id, "reason", e.target.value)}
          placeholder="Nhập lý do..."
          disabled={record.answer !== "Không"}
        />
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 180,
      render: (_, record) => (
        <TextArea
          rows={2}
          value={record.note}
          onChange={(e) => handleUpdate(record.id, "note", e.target.value)}
          placeholder="Nhập ghi chú..."
        />
      ),
    },
  ];

  // =====================
  // 7️⃣ Giao diện hiển thị
  // =====================
  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <Card style={{ marginBottom: 16, borderRadius: 8 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ marginBottom: 0, color: "#1890ff" }}>
              🔍 QSC1 – MYSTERY SHOPPER CHECKLIST
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Yoshinoya Vietnam - Đánh giá toàn diện chất lượng – dịch vụ – vệ sinh
            </Text>
          </Col>
          <Col>
            <Space>
              <Button
                type="default"
                icon={<ReloadOutlined />}
                onClick={handleReset}
                danger
              >
                Reset
              </Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                Export JSON
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Thông tin cơ bản */}
      <Card title="📋 Thông tin cơ bản" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Thời gian:</Text>
            </div>
            <Input
              type="time"
              value={basicInfo.time}
              onChange={(e) =>
                setBasicInfo({ ...basicInfo, time: e.target.value })
              }
              size="large"
            />
          </Col>
          <Col span={6}>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Ngày:</Text>
            </div>
            <Input
              type="date"
              value={basicInfo.date}
              onChange={(e) =>
                setBasicInfo({ ...basicInfo, date: e.target.value })
              }
              size="large"
            />
          </Col>
          <Col span={6}>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Nhà hàng:</Text>
            </div>
            <Input
              value={basicInfo.restaurant}
              onChange={(e) =>
                setBasicInfo({ ...basicInfo, restaurant: e.target.value })
              }
              placeholder="Tên nhà hàng"
              size="large"
            />
          </Col>
          <Col span={6}>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Người đánh giá:</Text>
            </div>
            <Input
              value={basicInfo.auditor}
              onChange={(e) =>
                setBasicInfo({ ...basicInfo, auditor: e.target.value })
              }
              placeholder="Tên auditor"
              size="large"
            />
          </Col>
        </Row>
      </Card>

      {/* Hướng dẫn chấm điểm */}
      <Alert
        message="📌 Lưu ý cách chấm điểm"
        description={
          <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
            <li>Chỉ chọn 1 trong 3 mục: <strong>Có</strong>, <strong>Không</strong>, hoặc <strong>N/A</strong></li>
            <li>Khi mắc phải lỗi trọng điểm (*) → Mất điểm 1 mục</li>
            <li>Câu trả lời <strong>N/A</strong>: Không tính điểm cho mục đánh giá này</li>
            <li>
              <strong>Thang điểm:</strong> A (90-100) | B (80-89) | C (70-79) | D (60-69) | E (0-59)
            </li>
          </ul>
        }
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      {/* Điểm tổng kết */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={4}>
            <Statistic
              title="Điểm đạt"
              value={scoreCalculation.totalScore.toFixed(1)}
              valueStyle={{ color: "#3f8600" }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="Tổng điểm"
              value={scoreCalculation.maxScore.toFixed(1)}
              valueStyle={{ color: "#1890ff" }}
            />
          </Col>
          <Col span={6}>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Tỷ lệ hoàn thành:</Text>
            </div>
            <Progress
              percent={Number(scoreCalculation.percentage.toFixed(1))}
              status={scoreCalculation.gradeStatus}
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="Xếp hạng"
              value={scoreCalculation.grade}
              suffix={`- ${scoreCalculation.gradeDesc}`}
              valueStyle={{
                color:
                  scoreCalculation.gradeStatus === "success"
                    ? "#3f8600"
                    : scoreCalculation.gradeStatus === "normal"
                    ? "#faad14"
                    : "#cf1322",
              }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Lỗi nghiêm trọng (*)"
              value={scoreCalculation.criticalErrors}
              valueStyle={{ color: "#cf1322" }}
              suffix="lỗi"
            />
          </Col>
        </Row>
      </Card>

      {/* Bảng checklist */}
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} tiêu chí`,
          }}
          bordered
          size="middle"
          scroll={{ x: 1500 }}
          rowClassName={(record) =>
            record.isCritical ? "critical-row" : ""
          }
        />
      </Card>

      <style>{`
        .critical-row {
          background-color: #fff1f0 !important;
        }
        .critical-row:hover {
          background-color: #ffccc7 !important;
        }
      `}</style>
    </div>
  );
};

export default QSC1Checklist;