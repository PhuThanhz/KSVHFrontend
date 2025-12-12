import React, { useRef } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Input,
  Space,
  Divider,
  Button,
} from "antd";
import type { ColumnsType } from "antd/es/table";

const { Text, Title } = Typography;
const { TextArea } = Input;

interface ResultRow {
  key: string | number;
  section: string;
  title: string;
  rate: number | string;
  critical: number | string;
  yes: number | string;
  no: number | string;
  na: number | string;
  earned: number | string;
  missed: number | string;
  repeated: number | string;
  percent: number;
  rank: string;
  code: string;
}

interface Props {
  results: any[];
  totalRate: number;
  totalEarned: number;
  totalPercent: number;
  totalRank: string;
  columns: any;
  dataSource: any;
  getRankColor: (rank: string) => string;
}

const rankToCode = (rank: string) => {
  if (rank === "SAT") return "A";
  if (rank.includes("OT")) return "B";
  if (rank.includes("BT")) return "C";
  return "E";
};

const rankBackground = (rank: string) => {
  if (rank === "SAT") return "#0050b3";
  if (rank.includes("OT")) return "#389e0d";
  if (rank.includes("BT")) return "#d4b106";
  return "#cf1322";
};

const rankTextColor = () => "white";

const OCChecklistResult: React.FC<Props> = ({
  results,
  totalPercent,
  totalRank,
  getRankColor,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Kết quả đánh giá</title>
          <style>
            @media print {
              @page { size: A4; margin: 15mm; }
              body { margin: 0; padding: 0; }
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
              color: #000;
              background: white;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
            }
            table th, table td {
              border: 1px solid #000;
              padding: 8px;
              text-align: center;
            }
            table th {
              background: #f0f0f0;
              font-weight: 700;
            }
            .total-row {
              background: #f5f5f5;
              font-weight: 700;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const excelRows: ResultRow[] = results.map((r, idx) => ({
    key: idx,
    section: ["I", "II", "III"][idx],
    title: r.title,
    rate: r.rate,
    critical: "-",
    yes: r.yes,
    no: r.no === 0 ? "-" : r.no,
    na: r.na === 0 ? "-" : r.na,
    earned: r.earned.toFixed(1),
    missed: r.missed === 0 ? "-" : r.missed.toFixed(1),
    repeated: 0,
    percent: r.percent,
    rank: r.rank,
    code: rankToCode(r.rank),
  }));

  const totalRow = {
    key: "total",
    section: "",
    title: "TỔNG",
    rate: results.reduce((a, b) => a + b.rate, 0),
    critical: "-",
    yes: results.reduce((a, b) => a + b.yes, 0),
    no: results.reduce((a, b) => a + b.no, 0),
    na: results.reduce((a, b) => a + b.na, 0),
    earned: results.reduce((a, b) => a + b.earned, 0),
    missed: "-",
    repeated: "",
    percent: totalPercent,
    rank: totalRank,
    code: rankToCode(totalRank),
  };

  excelRows.push(totalRow);

  const excelColumns: ColumnsType<ResultRow> = [
    {
      title: <strong>MỤC</strong>,
      dataIndex: "section",
      width: 60,
      align: "center",
    },
    {
      title: <strong>TÊN</strong>,
      dataIndex: "title",
      width: 220,
    },
    {
      title: <strong>RATE</strong>,
      dataIndex: "rate",
      width: 70,
      align: "center",
    },
    {
      title: <strong>CRITICAL</strong>,
      dataIndex: "critical",
      width: 80,
      align: "center",
    },
    { title: <strong>YES</strong>, dataIndex: "yes", width: 60, align: "center" },
    { title: <strong>NO</strong>, dataIndex: "no", width: 60, align: "center" },
    { title: <strong>N/A</strong>, dataIndex: "na", width: 60, align: "center" },
    {
      title: <strong>EARNED</strong>,
      dataIndex: "earned",
      width: 80,
      align: "center",
    },
    {
      title: <strong>MISSED</strong>,
      dataIndex: "missed",
      width: 80,
      align: "center",
    },
    {
      title: <strong>REPEATED</strong>,
      dataIndex: "repeated",
      width: 90,
      align: "center",
    },
    {
      title: <strong>%</strong>,
      dataIndex: "percent",
      width: 70,
      align: "center",
      render: (v) => <strong>{v.toFixed(0)}%</strong>,
    },

    // ⭐ RANK (HEADER GỘP 2 CỘT)
    {
      title: (
        <div
          style={{
            background: "#b7e1a1",
            padding: "8px 0",
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          RANK
        </div>
      ),
      children: [
        {
          title: "",
          dataIndex: "rank",
          width: 140,
          align: "center",
          render: (rank) => (
            <div
              style={{
                padding: "6px 10px",
                fontWeight: 700,
                background: rankBackground(rank),
                color: "white",
                borderRadius: 2,
              }}
            >
              {rank}
            </div>
          ),
        },
        {
          title: "CODE",
          dataIndex: "code",
          width: 70,
          align: "center",
          render: (code) => (
            <Text
              strong
              style={{
                fontSize: 16,
                color:
                  code === "A"
                    ? "#0050b3"
                    : code === "B"
                    ? "#389e0d"
                    : code === "C"
                    ? "#d4b106"
                    : "#cf1322",
              }}
            >
              {code}
            </Text>
          ),
        },
      ],
    },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 32px", background: "white" }}>
      <div className="no-print" style={{ marginBottom: 24, textAlign: "right" }}>
        <Button
          type="primary"
          size="large"
          onClick={handlePrint}
          style={{
            background: "#1890ff",
            borderRadius: 6,
            height: 44,
            padding: "0 32px",
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          Xuất PDF
        </Button>
      </div>

      <div ref={printRef}>
        <div style={{ marginBottom: 32, paddingBottom: 16, borderBottom: "3px solid #000" }}>
          <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
            KẾT QUẢ ĐÁNH GIÁ CHẤT LƯỢNG DỊCH VỤ
          </Title>
          <Text style={{ fontSize: 14, color: "#595959" }}>Tổng quan kết quả kiểm tra - Operational Checklist</Text>
        </div>

        <div style={{ marginBottom: 32 }}>
          <Table
            columns={excelColumns}
            dataSource={excelRows}
            pagination={false}
            bordered
            size="middle"
            rowClassName={(record) => (record.key === "total" ? "total-row" : "")}
            style={{ fontSize: 13 }}
          />
        </div>

        <Row gutter={24} style={{ marginBottom: 40 }}>
          <Col span={8}>
            <div style={{ border: "2px solid #d9d9d9", padding: 20, textAlign: "center", borderRadius: 6 }}>
              <Text strong>TỔNG ĐIỂM ĐẠT ĐƯỢC</Text>
              <div style={{ fontSize: 36, fontWeight: 700 }}>{totalRow.earned}</div>
            </div>
          </Col>

          <Col span={8}>
            <div style={{ border: "2px solid #d9d9d9", padding: 20, textAlign: "center", borderRadius: 6 }}>
              <Text strong>PHẦN TRĂM HOÀN THÀNH</Text>
              <div style={{ fontSize: 36, fontWeight: 700 }}>{totalPercent.toFixed(0)}%</div>
            </div>
          </Col>

          <Col span={8}>
            <div
              style={{
                background: rankBackground(totalRank),
                padding: 20,
                textAlign: "center",
                borderRadius: 6,
                border: `3px solid ${rankBackground(totalRank)}`,
              }}
            >
              <Text strong style={{ color: "white" }}>
                XẾP LOẠI
              </Text>
              <div style={{ fontSize: 36, fontWeight: 700, color: "white" }}>{totalRank}</div>
            </div>
          </Col>
        </Row>

        <Divider style={{ margin: "40px 0", borderColor: "#000" }} />

        <Title level={3} style={{ marginBottom: 24, fontWeight: 700 }}>
          Ý KIẾN VÀ NHẬN XÉT
        </Title>

        <div style={{ display: "flex", gap: 24, marginBottom: 40 }}>
          <div style={{ border: "2px solid #d9d9d9", padding: 24, borderRadius: 6, flex: 1 }}>
            <Title level={4}>Quản lý nhà hàng / Giám sát</Title>
            <TextArea rows={6} placeholder="Nhập ý kiến đánh giá..." style={{ marginBottom: 20 }} />

            <Space direction="vertical" style={{ width: "100%" }} size={12}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text strong>Ngày:</Text>
                <Text>28/07/2025</Text>
              </div>
              <Divider />

              <div>
                <Text strong>Chữ ký:</Text>
                <div style={{ height: 60, borderBottom: "2px solid #000", marginTop: 8 }}></div>
              </div>

              <div>
                <Text strong>Họ và tên:</Text>
                <span style={{ borderBottom: "1px solid #000", marginLeft: 8, minWidth: 250, display: "inline-block" }}></span>
              </div>
            </Space>
          </div>

          <div style={{ border: "2px solid #d9d9d9", padding: 24, borderRadius: 6, flex: 1 }}>
            <Title level={4}>Nhân viên KSVH</Title>
            <TextArea rows={6} placeholder="Nhập nhận xét..." style={{ marginBottom: 20 }} />

            <Space direction="vertical" style={{ width: "100%" }} size={12}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text strong>Ngày:</Text>
                <Text>28/07/2025</Text>
              </div>

              <Divider />

              <div>
                <Text strong>Chữ ký:</Text>
                <div style={{ height: 60, borderBottom: "2px solid #000", marginTop: 8 }}></div>
              </div>

              <div>
                <Text strong>Họ và tên:</Text>
                <span style={{ borderBottom: "1px solid #000", marginLeft: 8, minWidth: 250, display: "inline-block" }}></span>
              </div>
            </Space>
          </div>
        </div>

        <div style={{ marginTop: 48, textAlign: "center" }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Biểu mẫu đánh giá chất lượng dịch vụ - Operational Checklist
          </Text>
        </div>
      </div>
    </div>
  );
};

export default OCChecklistResult;
