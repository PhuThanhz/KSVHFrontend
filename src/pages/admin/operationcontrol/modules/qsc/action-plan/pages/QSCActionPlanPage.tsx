import React from "react";
import { Card, Typography } from "antd";
const { Title, Paragraph } = Typography;

const QSCActionPlanPage: React.FC = () => {
  return (
    <Card>
      <Title level={3}>Kế hoạch khắc phục (Action Plan)</Title>
      <Paragraph>Đây là khu vực nhập và theo dõi kế hoạch khắc phục sau QSC.</Paragraph>
    </Card>
  );
};

export default QSCActionPlanPage;
