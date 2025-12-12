import React from "react";
import { Card, Typography } from "antd";
const { Title, Paragraph } = Typography;

const QSC2Checklist: React.FC = () => {
  return (
    <Card>
      <Title level={3}>QSC2 – Kiểm tra định kỳ</Title>
      <Paragraph>Đây là giao diện form chấm QSC2 (định kỳ).</Paragraph>
    </Card>
  );
};

export default QSC2Checklist;
