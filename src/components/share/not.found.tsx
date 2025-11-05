import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";


const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Result
            status="404"
            title="Trang không khả dụng"
            subTitle="Rất tiếc, nội dung bạn đang tìm không khả dụng hoặc đã bị hạn chế truy cập."
            extra={
                <Button type="primary" onClick={() => navigate("/", { replace: true })}>
                    Quay lại trang chính
                </Button>
            }
        />
    );
};

export default NotFound;
