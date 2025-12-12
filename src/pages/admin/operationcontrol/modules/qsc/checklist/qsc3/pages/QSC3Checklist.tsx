import React from "react";
import { Card, Typography } from "antd";
const { Title, Paragraph } = Typography;

const QSC3Checklist: React.FC = () => {
  return (
    <Card>
      <Title level={3}>QSC3 – Kiểm tra Follow-up</Title>
      <Paragraph>Đây là giao diện form chấm QSC3 (Follow-up).</Paragraph>
    </Card>
  );
};

export default QSC3Checklist;
