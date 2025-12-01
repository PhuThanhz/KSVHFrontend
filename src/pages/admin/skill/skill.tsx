import { useRef, useState } from "react";
import { Button, Popconfirm, Space } from "antd";
import {
    EditOutlined,
    EyeOutlined,
    DeleteOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import dayjs from "dayjs";
import queryString from "query-string";

import PageContainer from "@/components/common/data-table/PageContainer";
import DataTable from "@/components/common/data-table";
import SearchFilter from "@/components/common/filter-date/SearchFilter";
import CustomPagination from "@/components/common/pagination/CustomPagination";

import type { ISkill } from "@/types/backend";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { useSkillsQuery, useDeleteSkillMutation } from "@/hooks/useSkills";
import ModalSkill from "@/pages/admin/skill/modal.skill";
import ViewDetailSkill from "@/pages/admin/skill/view.skill";
import { PAGINATION_CONFIG } from "@/config/pagination";

const SkillPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<ISkill | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);

    const [query, setQuery] = useState<string>(
        `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=${PAGINATION_CONFIG.DEFAULT_SORT}`
    );

    const tableRef = useRef<ActionType>(null);

    const { data, isFetching } = useSkillsQuery(query);
    const deleteMutation = useDeleteSkillMutation();

    const meta = data?.meta ?? {
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: 0,
    };
    const skills = data?.result ?? [];

    /** ================== Xử lý xóa kỹ năng ================== */
    const handleDelete = async (id?: number | string) => {
        if (!id) return;
        await deleteMutation.mutateAsync(id, {
            onSuccess: () => reloadTable(),
        });
    };

    /** ================== Reload bảng ================== */
    const reloadTable = () => {
        setQuery(
            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=${PAGINATION_CONFIG.DEFAULT_SORT}`
        );
    };

    /** ================== Build query ================== */
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        };

        if (params.techniqueName) {
            q.filter = `techniqueName~'${params.techniqueName}'`;
        }

        let temp = queryString.stringify(q, { encode: false });

        if (sort?.techniqueName) {
            const dir = sort.techniqueName === "ascend" ? "asc" : "desc";
            temp += `&sort=techniqueName,${dir}`;
        } else {
            temp += `&sort=${PAGINATION_CONFIG.DEFAULT_SORT}`;
        }

        return temp;
    };

    /** ================== Cột bảng ================== */
    const columns: ProColumns<ISkill>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                index + 1 + ((meta.page || 1) - 1) * (meta.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE),
            hideInSearch: true,
        },
        {
            title: "Tên kỹ năng",
            dataIndex: "techniqueName",
            sorter: true,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            hideInSearch: true,
            render: (_, record) =>
                record.createdAt
                    ? dayjs(record.createdAt).format("DD-MM-YYYY HH:mm")
                    : "-",
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updatedAt",
            hideInSearch: true,
            render: (_, record) =>
                record.updatedAt
                    ? dayjs(record.updatedAt).format("DD-MM-YYYY HH:mm")
                    : "-",
        },
        {
            title: "Hành động",
            hideInSearch: true,
            width: 120,
            align: "center",
            render: (_, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.SKILL.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1677ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedSkillId(Number(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.SKILL.UPDATE} hideChildren>
                        <EditOutlined
                            style={{ fontSize: 18, color: "#fa8c16", cursor: "pointer" }}
                            onClick={() => {
                                setDataInit(entity);
                                setOpenModal(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.SKILL.DELETE} hideChildren>
                        <Popconfirm
                            title="Xác nhận xóa kỹ năng"
                            description="Bạn có chắc chắn muốn xóa kỹ năng này không?"
                            okText="Xóa"
                            cancelText="Hủy"
                            onConfirm={() => handleDelete(entity.id!)}
                        >
                            <DeleteOutlined
                                style={{ fontSize: 18, color: "#ff4d4f", cursor: "pointer" }}
                            />
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    /** ================== Render ================== */
    return (
        <PageContainer
            title="Quản lý kỹ năng"
            filter={
                <SearchFilter
                    searchPlaceholder="Tìm kiếm kỹ năng..."
                    addLabel="Thêm kỹ năng"
                    showFilterButton={false}
                    onSearch={(val) =>
                        setQuery(
                            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&filter=techniqueName~'${val}'`
                        )
                    }
                    onReset={() => reloadTable()}
                    onAddClick={() => {
                        setDataInit(null);
                        setOpenModal(true);
                    }}
                />
            }
        >
            <Access permission={ALL_PERMISSIONS.SKILL.GET_PAGINATE}>
                <DataTable<ISkill>
                    actionRef={tableRef}
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={skills}
                    request={async (params, sort) => {
                        const q = buildQuery(params, sort);
                        setQuery(q);
                        return Promise.resolve({
                            data: skills || [],
                            success: true,
                            total: meta.total || 0,
                        });
                    }}
                    pagination={false}
                    footer={() => (
                        <CustomPagination
                            current={meta.page}
                            pageSize={meta.pageSize}
                            total={meta.total}
                            onChange={(page, size) => {
                                setQuery(`page=${page}&size=${size}&sort=${PAGINATION_CONFIG.DEFAULT_SORT}`);
                            }}
                            showTotalText="kỹ năng"
                        />
                    )}
                    rowSelection={false}
                />
            </Access>

            {/* Modal thêm/sửa */}
            <ModalSkill
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            {/* Modal xem chi tiết */}
            <ViewDetailSkill
                onClose={setOpenViewDetail}
                open={openViewDetail}
                skillId={selectedSkillId}
            />
        </PageContainer>
    );
};

export default SkillPage;
