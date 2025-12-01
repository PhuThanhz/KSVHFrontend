import React, { useState } from "react";
import { Input, Button, Popover, Form, Space } from "antd";
import { FilterOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons";
import RefreshButton from "./RefreshButton";

export interface FilterField {
    name: string;
    label: string;
    placeholder?: string;
}

interface SearchFilterProps {
    searchPlaceholder?: string;
    filterFields?: FilterField[];
    onSearch?: (value: string) => void;
    onFilterApply?: (filters: Record<string, any>) => void;
    onReset?: () => void;
    onAddClick?: () => void;
    addLabel?: string;
    showAddButton?: boolean;
    showFilterButton?: boolean;
    showResetButton?: boolean;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
    searchPlaceholder = "Tìm kiếm...",
    filterFields = [],
    onSearch,
    onFilterApply,
    onReset,
    onAddClick,
    addLabel = "Thêm mới",
    showAddButton = true,
    showFilterButton = true,
    showResetButton = true,
}) => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();

    const handleApply = () => {
        const values = form.getFieldsValue();
        onFilterApply?.(values);
        setOpen(false);
    };

    const handleReset = () => {
        form.resetFields();
        onReset?.();
        setOpen(false);
    };

    const content = (
        <div style={{ width: 260 }}>
            <Form layout="vertical" form={form}>
                {filterFields.map((f) => (
                    <Form.Item key={f.name} label={f.label} name={f.name}>
                        <Input placeholder={`Nhập ${f.label.toLowerCase()}`} />
                    </Form.Item>
                ))}
                <Space style={{ justifyContent: "space-between", width: "100%" }}>
                    <Button onClick={handleReset}>Làm mới</Button>
                    <Button type="primary" onClick={handleApply}>
                        Áp dụng
                    </Button>
                </Space>
            </Form>
        </div>
    );

    return (
        <Space wrap>
            <Input
                placeholder={searchPlaceholder}
                prefix={<SearchOutlined />}
                onPressEnter={(e) => onSearch?.((e.target as HTMLInputElement).value)}
                style={{ width: 240 }}
            />

            {showFilterButton && (
                <Popover
                    open={open}
                    onOpenChange={setOpen}
                    trigger="click"
                    placement="bottomRight"
                    content={content}
                >
                    <Button icon={<FilterOutlined />}>Bộ lọc</Button>
                </Popover>
            )}

            {showResetButton && <RefreshButton onReset={handleReset} />}

            {showAddButton && (
                <Button type="primary" icon={<PlusOutlined />} onClick={onAddClick}>
                    {addLabel}
                </Button>
            )}
        </Space>
    );
};

export default SearchFilter;
