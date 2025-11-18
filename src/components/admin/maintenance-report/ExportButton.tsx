import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

interface IProps {
    onExport: () => void;
    loading?: boolean;
}

const ExportButton = ({ onExport, loading }: IProps) => {
    return (
        <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={onExport}
            loading={loading}
            style={{ marginBottom: 15 }}
        >
            Xuất báo cáo
        </Button>
    );
};

export default ExportButton;
