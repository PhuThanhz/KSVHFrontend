import { useState } from "react";
import { Button, Popconfirm, Space, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import dayjs from "dayjs";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";

import { useShiftTemplatesQuery, useDeleteShiftTemplateMutation } from "@/hooks/useShiftTemplate";
import type { IShiftTemplate } from "@/types/backend";
import ModalShiftTemplate from "@/pages/admin/shift-template/modal.shift-template";
import ViewDetailShiftTemplate from "@/pages/admin/shift-template/view.shift-template";
import { notify } from "@/components/common/notify";

const PageShiftTemplate = () => {
    /** ========================= STATE ========================= */
    const [query, setQuery] = useState<string>("page=1&pageSize=10");
    const [openModal, setOpenModal] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [dataInit, setDataInit] = useState<IShiftTemplate | null>(null);
    const [selectedId, setSelectedId] = useState<string | number | null>(null);

    /** ========================= HOOKS ========================= */
    const { data, isFetching, refetch } = useShiftTemplatesQuery(query);
    const { mutate: deleteShiftTemplate, isPending: isDeleting } = useDeleteShiftTemplateMutation();

    const templates = data?.result ?? [];

    /** ========================= HANDLERS ========================= */
    const handleOpenCreate = () => {
        setDataInit(null);
        setOpenModal(true);
    };

    const handleOpenEdit = (record: IShiftTemplate) => {
        setDataInit(record);
        setOpenModal(true);
    };

    const handleViewDetail = (record: IShiftTemplate) => {
        setSelectedId(record.id ?? null);
        setOpenView(true);
    };

    const handleDelete = (id?: string) => {
        if (!id) return;
        deleteShiftTemplate(id, {
            onSuccess: () => { },
        });
    };

    /** ========================= TABLE COLUMNS ========================= */
    const columns: ProColumns<IShiftTemplate>[] = [
        {
            title: "Tên ca làm việc",
            dataIndex: "name",
            sorter: true,
            ellipsis: true,
        },
        {
            title: "Giờ bắt đầu",
            dataIndex: "startTime",
            render: (_, record) => record.startTime ? dayjs(record.startTime, "HH:mm:ss").format("HH:mm") : "-",
            width: 120,
            align: "center",
        },
        {
            title: "Giờ kết thúc",
            dataIndex: "endTime",
            render: (_, record) => record.endTime ? dayjs(record.endTime, "HH:mm:ss").format("HH:mm") : "-",
            width: 120,
            align: "center",
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            ellipsis: true,
            render: (_, record) => record.note || "-",
        },
        {
            title: "Trạng thái",
            dataIndex: "active",
            align: "center",
            width: 140,
            render: (_, record) =>
                record.active ? <Tag color="green">Đang hoạt động</Tag> : <Tag color="red">Ngừng hoạt động</Tag>,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            width: 180,
            render: (_, record) =>
                record.createdAt ? dayjs(record.createdAt).format("DD-MM-YYYY HH:mm") : "-",
        },
        {
            title: "Hành động",
            key: "action",
            fixed: "right",
            align: "center",
            width: 180,
            render: (_, record) => (
                <Space>

                    <Access permission={ALL_PERMISSIONS.SHIFT_TEMPLATE.GET_BY_ID} hideChildren>
                        <Button
                            type="link"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetail(record)}
                        />
                    </Access>
                    <Access permission={ALL_PERMISSIONS.SHIFT_TEMPLATE.UPDATE} hideChildren>
                        <Button
                            type="link"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleOpenEdit(record)}
                        />
                    </Access>
                    <Access permission={ALL_PERMISSIONS.SHIFT_TEMPLATE.DELETE} hideChildren>
                        <Popconfirm
                            title="Bạn có chắc muốn xóa ca làm việc này không?"
                            okText="Xóa"
                            cancelText="Hủy"
                            onConfirm={() => handleDelete(record.id)}
                        >
                            <Button
                                danger
                                type="link"
                                size="small"
                                icon={<DeleteOutlined />}
                                loading={isDeleting}
                            />
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    /** ========================= RENDER ========================= */
    return (
        <>
            <ProTable<IShiftTemplate>
                rowKey="id"
                columns={columns}
                dataSource={templates}
                loading={isFetching}
                search={false}
                pagination={{
                    total: data?.meta?.total ?? 0,
                    current: data?.meta?.page ?? 1,
                    pageSize: data?.meta?.pageSize ?? 10,
                    onChange: (page, pageSize) => setQuery(`page=${page}&pageSize=${pageSize}`),
                }}
                headerTitle="Danh sách ca làm việc mẫu"
                toolBarRender={() => [
                    <Button key="refresh" icon={<ReloadOutlined />} onClick={() => refetch()}>
                        Làm mới
                    </Button>,
                    <Access permission={ALL_PERMISSIONS.SHIFT_TEMPLATE.CREATE} hideChildren>
                        <Button
                            key="create"
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleOpenCreate}
                        >
                            Thêm mới
                        </Button>,
                    </Access>
                ]}
            />

            {openModal && (
                <ModalShiftTemplate
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    dataInit={dataInit}
                    setDataInit={setDataInit}
                />
            )}

            {openView && (
                <ViewDetailShiftTemplate
                    open={openView}
                    onClose={setOpenView}
                    shiftTemplateId={selectedId}
                />
            )}
        </>
    );
};

export default PageShiftTemplate;
