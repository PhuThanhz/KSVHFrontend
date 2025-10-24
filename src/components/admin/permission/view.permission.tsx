import type { IPermission } from "@/types/backend";
import { Descriptions, Drawer, Spin } from "antd";
import dayjs from "dayjs";
import { usePermissionByIdQuery } from "@/hooks/usePermissions";

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IPermission | null;
    setDataInit: (v: any) => void;
}

const ViewDetailPermission = (props: IProps) => {
    const { onClose, open, dataInit, setDataInit } = props;

    const { data, isFetching } = usePermissionByIdQuery(dataInit?.id);

    const handleClose = () => {
        onClose(false);
        setDataInit(null);
    };

    return (
        <Drawer
            title="Thông Tin Permission"
            placement="right"
            onClose={handleClose}
            open={open}
            width={"40vw"}
            maskClosable={false}
        >
            {isFetching ? (
                <div style={{ textAlign: "center", marginTop: 50 }}>
                    <Spin tip="Đang tải dữ liệu..." />
                </div>
            ) : (
                <Descriptions bordered column={2} layout="vertical">
                    <Descriptions.Item label="Tên Permission">
                        {data?.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="API Path">
                        {data?.apiPath}
                    </Descriptions.Item>

                    <Descriptions.Item label="Method">
                        {data?.method}
                    </Descriptions.Item>
                    <Descriptions.Item label="Thuộc Module">
                        {data?.module}
                    </Descriptions.Item>

                    <Descriptions.Item label="Ngày tạo">
                        {data?.createdAt
                            ? dayjs(data.createdAt).format("DD-MM-YYYY HH:mm:ss")
                            : ""}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày sửa">
                        {data?.updatedAt
                            ? dayjs(data.updatedAt).format("DD-MM-YYYY HH:mm:ss")
                            : ""}
                    </Descriptions.Item>
                </Descriptions>
            )}
        </Drawer>
    );
};

export default ViewDetailPermission;
