import React, { useState } from "react";
import { 
  Card, Row, Col, Typography, Space, Tag, Radio, Input, Collapse, Button, Statistic, message 
} from "antd";

const { Text } = Typography;

interface ChecklistItem {
  id: string;
  text: string;
  weight: number;
  critical?: boolean;
}

interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
}

interface FinanceChecklistFormProps {
  restaurant: {
    name: string;
    location: string;
  };
  checklist: ChecklistSection[];
  onClose: () => void;
}

const FinanceChecklistForm: React.FC<FinanceChecklistFormProps> = ({
  restaurant,
  checklist,
  onClose,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleSelect = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const calculateScore = () => {
    let totalWeight = 0;
    let earnedWeight = 0;

    checklist.forEach((section) => {
      section.items.forEach((item) => {
        totalWeight += item.weight;
        if (answers[item.id] === "yes") earnedWeight += item.weight;
      });
    });

    return totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
  };

  const handleSubmit = () => {
    const score = calculateScore();

    console.log("===== Checklist Submit =====");
    console.log("Restaurant:", restaurant);
    console.log("Answers:", answers);
    console.log("Notes:", notes);
    console.log("Score:", score);

    message.success(`Đã lưu đánh giá! Điểm số: ${score}%`);
    onClose();
  };

  return (
    <div style={{ padding: 24, background: "#f5f5f5" }}>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Text type="secondary">Nhà hàng:</Text>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {restaurant.name}
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Text type="secondary">Địa điểm:</Text>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {restaurant.location}
            </Typography.Title>
          </Col>
        </Row>
      </Card>

      <Collapse accordion defaultActiveKey={["I"]}>
        {checklist.map((section) => (
          <Collapse.Panel
            header={<Text strong style={{ fontSize: 16 }}>{section.title}</Text>}
            key={section.id}
          >
            {section.items.map((item) => (
              <Card key={item.id} style={{ marginBottom: 12 }} size="small">
                <Row gutter={[16, 16]}>
                  <Col span={14}>
                    <Space direction="vertical" size={0}>
                      <Space>
                        <Text strong>{item.id}</Text>
                        {item.critical && <Tag color="red">CRITICAL</Tag>}
                        <Text type="secondary">Trọng số: {item.weight}</Text>
                      </Space>
                      <Text>{item.text}</Text>
                    </Space>
                  </Col>

                  <Col span={10}>
                    <Radio.Group
                      onChange={(e) => handleSelect(item.id, e.target.value)}
                      value={answers[item.id] ?? null}
                    >
                      <Space>
                        <Radio value="yes">YES</Radio>
                        <Radio value="no">NO</Radio>
                        <Radio value="na">N/A</Radio>
                      </Space>
                    </Radio.Group>
                  </Col>

                  <Col span={24}>
                    <Input.TextArea
                      rows={2}
                      placeholder="Ghi chú..."
                      value={notes[item.id] ?? ""}
                      onChange={(e) =>
                        setNotes((prev) => ({
                          ...prev,
                          [item.id]: e.target.value,
                        }))
                      }
                    />
                  </Col>
                </Row>
              </Card>
            ))}
          </Collapse.Panel>
        ))}
      </Collapse>

      <Card style={{ marginTop: 16, textAlign: "center" }}>
        <Statistic
          title="Điểm số ước tính"
          value={calculateScore()}
          suffix="%"
          valueStyle={{
            color:
              calculateScore() >= 90
                ? "#52c41a"
                : calculateScore() >= 80
                ? "#faad14"
                : "#ff4d4f",
            fontSize: 32,
          }}
        />
      </Card>

      <Row justify="end" gutter={8} style={{ marginTop: 16 }}>
        <Col>
          <Button size="large" onClick={onClose}>
            Hủy
          </Button>
        </Col>
        <Col>
          <Button type="primary" size="large" onClick={handleSubmit}>
            Lưu đánh giáx
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default FinanceChecklistForm;
