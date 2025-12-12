import React, { useState } from "react";
import {
  Card,
  Typography,
  Table,
  Tag,
  Space,
  Button,
  message,
} from "antd";

const { Title, Paragraph } = Typography;

interface QSCResult {
  id: number;
  storeName: string;
  auditor: string;
  score: number;
  status: string;
  date: string;
}

const QSCStandardPage: React.FC = () => {
  // ✅ Dữ liệu mẫu
  const [results, setResults] = useState<QSCResult[]>([
    {
      id: 1,
      storeName: "Yoshinoya - Nguyễn Huệ",
      auditor: "Huỳnh Thanh Phú",
      score: 92,
      status: "Đạt",
      date: "2025-01-10",
    },
    {
      id: 2,
      storeName: "Coco Ichibanya - Quận 1",
      auditor: "Nguyễn Văn A",
      score: 78,
      status: "Cần cải thiện",
      date: "2025-01-12",
    },
    {
      id: 3,
      storeName: "Marukame Udon - Vạn Hạnh Mall",
      auditor: "Trần Minh B",
      score: 88,
      status: "Đạt",
      date: "2025-01-15",
    },
  ]);

  // ✅ Định nghĩa cột bảng
  const columns = [
    {
      title: "Cửa hàng",
      dataIndex: "storeName",
      key: "storeName",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Người kiểm tra",
      dataIndex: "auditor",
      key: "auditor",
    },
    {
      title: "Điểm QSC",
      dataIndex: "score",
      key: "score",
      sorter: (a: QSCResult, b: QSCResult) => a.score - b.score,
      render: (score: number) => (
        <span style={{ color: score >= 85 ? "green" : "red" }}>{score}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Đạt" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Ngày kiểm tra",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: QSCResult) => (
        <Space>
          <Button
            size="small"
            type="primary"
            onClick={() => message.info(`Xem chi tiết ${record.storeName}`)}
          >
            Xem
          </Button>
          <Button
            size="small"
            onClick={() => message.success("Đã tải báo cáo!")}
          >
            Tải báo cáo
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "30px" }}>
      <Card
        style={{
          marginBottom: 20,
          backgroundColor: "#f0f5ff",
          border: "1px solid #d6e4ff",
        }}
      >
        <Title level={3} style={{ marginBottom: 0, color: "#1d39c4" }}>
          Bảng tổng hợp điểm QSC (Standard)
        </Title>
        <Paragraph style={{ marginTop: 5, marginBottom: 0 }}>
          Đây là nơi hiển thị bảng tổng hợp kết quả đánh giá chất lượng QSC cho
          từng cửa hàng.
        </Paragraph>
      </Card>

      <Card title="Kết quả đánh giá QSC">
        <Table
          dataSource={results}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default QSCStandardPage;
