import React from "react";
import { Pagination } from "antd";
import { PAGINATION_CONFIG } from "@/config/pagination";

interface CustomPaginationProps {
    current?: number;
    pageSize?: number;
    total?: number;
    onChange?: (page: number, pageSize: number) => void;
    showTotalText?: string;
    showQuickJumper?: boolean;
    showSizeChanger?: boolean;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
    current = PAGINATION_CONFIG.DEFAULT_PAGE,
    pageSize = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
    total = 0,
    onChange,
    showTotalText = "bản ghi",
    showQuickJumper = true,
    showSizeChanger = true,
}) => {
    // ✅ Tính đúng dải hiển thị (vd: 1–20 trên 23)
    const start = total === 0 ? 0 : (current - 1) * pageSize + 1;
    const end = Math.min(current * pageSize, total);

    return (
        <div
            style={{
                marginTop: 16,
                padding: "12px 24px",
                background: "#fff",
                borderRadius: 8,
                borderTop: "1px solid #f0f0f0",
                display: "flex",
                justifyContent: "flex-end",
            }}
        >
            <Pagination
                current={current}
                pageSize={pageSize}
                total={total}
                showQuickJumper={showQuickJumper}
                showSizeChanger={showSizeChanger}
                showTotal={() => (
                    <div style={{ fontSize: 13, color: "#595959" }}>
                        <span style={{ fontWeight: 500, color: "#000" }}>
                            {total === 0 ? "0–0" : `${start}–${end}`}
                        </span>{" "}
                        trên{" "}
                        <span style={{ fontWeight: 600, color: "#1677ff" }}>
                            {total.toLocaleString()}
                        </span>{" "}
                        {showTotalText}
                    </div>
                )}
                onChange={(page, size) => {
                    if (onChange) onChange(page, size);
                }}
            />
        </div>
    );
};

export default CustomPagination;
