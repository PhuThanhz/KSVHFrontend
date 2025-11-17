import { Modal, Input, Table, Spin, Empty } from "antd";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import queryString from "query-string";
import { sfLike } from "spring-filter-query-builder";
import { useUsersQuery } from "@/hooks/user/useUsers";
import type { IUser } from "@/types/backend";

interface IManagerPickerModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (user: { label: string; value: string }) => void;
}

const ManagerPickerModal = ({ open, onClose, onSelect }: IManagerPickerModalProps) => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const abortRef = useRef<AbortController | null>(null);

    const query = useMemo(() => {
        let filter = "role.name='EMPLOYEE'";
        if (search.trim()) {
            filter = `${filter} and (${sfLike("name", search)} or ${sfLike("email", search)})`;
        }
        return queryString.stringify({ page, size: pageSize, sort: "createdAt,desc", filter }, { encode: false });
    }, [search, page, pageSize]);

    const { data, isFetching, refetch } = useUsersQuery(query);

    useEffect(() => {
        const handler = setTimeout(() => {
            setPage(1);
            refetch();
        }, 400);
        return () => clearTimeout(handler);
    }, [search, refetch]);

    useEffect(() => {
        if (!open && abortRef.current) abortRef.current.abort();
    }, [open]);

    const columns = useMemo(
        () => [
            {
                title: "STT",
                key: "index",
                width: 60,
                align: "center" as const,
                render: (_: any, __: IUser, index: number) =>
                    (index + 1) + ((data?.meta?.page || 1) - 1) * (data?.meta?.pageSize || 10),
            },
            { title: "Tên hiển thị", dataIndex: "name", key: "name" },
            { title: "Email", dataIndex: "email", key: "email" },
            { title: "Vai trò", dataIndex: ["role", "name"], key: "role", render: (value: string) => value || "—" },
        ],
        [data?.meta]
    );

    const handleSelect = useCallback(
        (record: IUser) => {
            onSelect({ label: record.name || "", value: String(record.id || "") });
            onClose();
        },
        [onSelect, onClose]
    );

    return (
        <Modal
            title="Chọn nhân viên quản lý"
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
            maskClosable={false}
            destroyOnClose
            centered
        >
            <Input.Search
                allowClear
                placeholder="Nhập tên hoặc email để tìm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                enterButton="Tìm kiếm"
                style={{ marginBottom: 16 }}
            />

            {isFetching ? (
                <div style={{ textAlign: "center", padding: 40 }}>
                    <Spin size="large" />
                </div>
            ) : (data?.result?.length ?? 0) === 0 ? (
                <Empty description="Không có dữ liệu" style={{ padding: 40 }} />
            ) : (
                <Table<IUser>
                    rowKey="id"
                    columns={columns}
                    dataSource={data?.result || []}
                    pagination={{
                        current: data?.meta?.page ?? page,
                        pageSize: data?.meta?.pageSize ?? pageSize,
                        total: data?.meta?.total ?? 0,
                        showSizeChanger: true,
                        onChange: (p, s) => {
                            setPage(p);
                            setPageSize(s);
                        },
                        showTotal: (t) => `${t.toLocaleString()} người dùng`,
                    }}
                    onRow={(record) => ({ onClick: () => handleSelect(record) })}
                    style={{ cursor: "pointer" }}
                    size="middle"
                />
            )}
        </Modal>
    );
};

export default ManagerPickerModal;