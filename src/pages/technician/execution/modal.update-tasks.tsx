import {
    Modal,
    Spin,
    Typography,
    Divider,
    Empty
} from "antd";
import TaskItem from "./TaskItem";
import { useExecutionDetailQuery } from "@/hooks/maintenance/useMaintenanceExecutions";

const { Title } = Typography;

interface Props {
    open: boolean;
    onClose: (v: boolean) => void;
    requestId: string | null;
    requestCode?: string | null;
    onSuccess: () => void;
}

const ModalUpdateTasks = ({ open, onClose, requestId, requestCode, onSuccess }: Props) => {
    const { data, isFetching, refetch } = useExecutionDetailQuery(requestId || undefined);

    const handleUpdated = () => {
        refetch();
        onSuccess();
    };

    return (
        <Modal
            open={open}
            onCancel={() => onClose(false)}
            footer={null}
            width={900}
            title={`Cập nhật công việc • ${requestCode || ""}`}
            destroyOnClose
        >
            {isFetching ? (
                <div style={{ textAlign: "center", padding: 40 }}>
                    <Spin />
                </div>
            ) : !data?.tasks?.length ? (
                <Empty description="Không có công việc để cập nhật" />
            ) : (
                <>
                    <Title level={5}>Danh sách công việc</Title>
                    <Divider />

                    {data.tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onUpdated={handleUpdated}
                        />
                    ))}
                </>
            )}
        </Modal>
    );
};

export default ModalUpdateTasks;
