import {
    FooterToolbar,
    ModalForm,
    ProCard,
    ProFormSwitch,
    ProFormText,
    ProFormTextArea,
} from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from "react-device-detect";
import type { IPermission, IRole } from "@/types/backend";
import { CheckSquareOutlined } from "@ant-design/icons";
import ModuleApi from "./module.api";
import {
    useCreateRoleMutation,
    useUpdateRoleMutation,
} from "@/hooks/useRoles";
import { useEffect } from "react";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    reloadTable: () => void;
    listPermissions: {
        module: string;
        permissions: IPermission[];
    }[];
    singleRole: IRole | null;
    setSingleRole: (v: any) => void;
}

const ModalRole = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, listPermissions, singleRole, setSingleRole } = props;
    const [form] = Form.useForm();

    // ✅ React Query mutations
    const { mutate: createRole, isPending: creating } = useCreateRoleMutation();
    const { mutate: updateRole, isPending: updating } = useUpdateRoleMutation();

    useEffect(() => {
        if (!openModal) {
            form.resetFields();
        }
    }, [openModal]);

    const submitRole = async (valuesForm: any) => {
        const { description, active, name, permissions } = valuesForm;
        const checkedPermissions = [];

        // Lấy danh sách quyền được chọn
        if (permissions) {
            for (const key in permissions) {
                if (/^[1-9][0-9]*$/.test(key) && permissions[key] === true) {
                    checkedPermissions.push({ id: key });
                }
            }
        }

        const roleData = {
            name,
            description,
            active,
            permissions: checkedPermissions,
        };

        if (singleRole?.id) {
            // ✅ Cập nhật role
            updateRole(
                { id: String(singleRole.id), role: roleData },
                {
                    onSuccess: () => {
                        message.success("Cập nhật role thành công");
                        handleReset();
                        reloadTable();
                    },
                    onError: (err: any) => {
                        notification.error({
                            message: "Lỗi khi cập nhật role",
                            description: err.message || "Đã xảy ra lỗi",
                        });
                    },
                }
            );
        } else {
            // ✅ Tạo mới role
            createRole(roleData as IRole, {
                onSuccess: () => {
                    message.success("Thêm mới role thành công");
                    handleReset();
                    reloadTable();
                },
                onError: (err: any) => {
                    notification.error({
                        message: "Lỗi khi tạo role",
                        description: err.message || "Đã xảy ra lỗi",
                    });
                },
            });
        }
    };

    const handleReset = () => {
        form.resetFields();
        setOpenModal(false);
        setSingleRole(null);
    };

    return (
        <ModalForm
            title={<>{singleRole?.id ? "Cập nhật Role" : "Tạo mới Role"}</>}
            open={openModal}
            form={form}
            modalProps={{
                onCancel: handleReset,
                afterClose: handleReset,
                destroyOnClose: true,
                width: isMobile ? "100%" : 900,
                keyboard: false,
                maskClosable: false,
            }}
            scrollToFirstError
            preserve={false}
            onFinish={submitRole}
            submitter={{
                render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
                submitButtonProps: {
                    icon: <CheckSquareOutlined />,
                    loading: creating || updating,
                },
                searchConfig: {
                    resetText: "Hủy",
                    submitText: <>{singleRole?.id ? "Cập nhật" : "Tạo mới"}</>,
                },
            }}
        >
            <Row gutter={16}>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Tên Role"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
                        placeholder="Nhập tên vai trò"
                    />
                </Col>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormSwitch
                        label="Trạng thái"
                        name="active"
                        checkedChildren="ACTIVE"
                        unCheckedChildren="INACTIVE"
                        initialValue={true}
                        fieldProps={{
                            defaultChecked: true,
                        }}
                    />
                </Col>
                <Col span={24}>
                    <ProFormTextArea
                        label="Miêu tả"
                        name="description"
                        rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
                        placeholder="Nhập mô tả role"
                        fieldProps={{
                            autoSize: { minRows: 2 },
                        }}
                    />
                </Col>
                <Col span={24}>
                    <ProCard
                        title="Quyền hạn"
                        subTitle="Các quyền hạn được phép cho vai trò này"
                        headStyle={{ color: "#d81921" }}
                        style={{ marginBottom: 20 }}
                        headerBordered
                        size="small"
                        bordered
                    >
                        <ModuleApi
                            form={form}
                            listPermissions={listPermissions}
                            singleRole={singleRole}
                            openModal={openModal}
                        />
                    </ProCard>
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalRole;
