import { Modal, Form, Input, DatePicker, Select, Button } from "antd";

import dayjs from "dayjs";

interface IProps {
    open: boolean;
    onClose: () => void;
    onApply: (query: Record<string, any>) => void;
}

const { RangePicker } = DatePicker;

const ModalAdminMaintenanceExecutionFilter = ({ open, onClose, onApply }: IProps) => {
    const [form] = Form.useForm();

    const handleApply = () => {
        const values = form.getFieldsValue();

        const query: Record<string, any> = {};

        if (values.requestCode) query.requestCode = values.requestCode;
        if (values.deviceCode) query.deviceCode = values.deviceCode;
        if (values.technicianName) query.technicianName = values.technicianName;
        if (values.status) query.status = values.status;

        if (values.createdAt && values.createdAt.length === 2) {
            query.createdFrom = dayjs(values.createdAt[0]).toISOString();
            query.createdTo = dayjs(values.createdAt[1]).toISOString();
        }

        onApply(query);
        onClose();
    };

    return (
        <Modal
            title="Lọc phiếu thi công"
            open={open}
            onCancel={onClose}
            onOk={handleApply}
            okText="Áp dụng"
        >
            <Form form={form} layout="vertical">
                <Form.Item label="Mã phiếu" name="requestCode">
                    <Input placeholder="Nhập mã phiếu..." />
                </Form.Item>

                <Form.Item label="Mã thiết bị" name="deviceCode">
                    <Input placeholder="Nhập mã thiết bị..." />
                </Form.Item>

                <Form.Item label="Tên kỹ thuật viên" name="technicianName">
                    <Input placeholder="Nhập tên KTV..." />
                </Form.Item>



                <Form.Item label="Ngày tạo phiếu" name="createdAt">
                    <RangePicker
                        format="DD-MM-YYYY"
                        style={{ width: "100%" }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalAdminMaintenanceExecutionFilter;
