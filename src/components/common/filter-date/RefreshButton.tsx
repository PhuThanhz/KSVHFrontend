import React from "react";
import { Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

interface RefreshButtonProps {
    onReset?: () => void;
    title?: string;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onReset, title = "Làm mới" }) => {
    return (
        <Button
            icon={<ReloadOutlined />}
            onClick={onReset}
            title={title}
        />
    );
};

export default RefreshButton;
