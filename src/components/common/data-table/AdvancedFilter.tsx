import React, { useState } from "react";
import { Dropdown, Menu, Tag, Space, Button, DatePicker, Radio } from "antd";
import { FilterOutlined, CalendarOutlined, TagOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export interface FilterField {
    key: string;
    label: string;
    icon?: React.ReactNode;
    type?: "select" | "date";
    options?: { label: string; value: any; color?: string }[];
}

interface AdvancedFilterProps {
    filters: FilterField[];
    activeFilters: Record<string, any>;
    onChange: (key: string, value: any) => void;
    onClear: (key: string) => void;
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
    filters,
    activeFilters,
    onChange,
    onClear,
}) => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const mainMenu = (
        <Menu
            items={filters.map((f) => ({
                key: f.key,
                label: (
                    <Space>
                        {f.icon || <TagOutlined />}
                        {f.label}
                    </Space>
                ),
                onClick: () => setActiveMenu(f.key),
            }))}
        />
    );

    const subMenu = (field: FilterField) => {
        if (field.type === "date") {
            return (
                <RangePicker
                    onChange={(val) => {
                        const range =
                            val && val[0] && val[1]
                                ? `${field.key} >= '${dayjs(val[0]).format(
                                    "YYYY-MM-DD"
                                )}' and ${field.key} <= '${dayjs(val[1]).format(
                                    "YYYY-MM-DD"
                                )}'`
                                : null;
                        onChange(field.key, range);
                        setActiveMenu(null);
                    }}
                />
            );
        }
        return (
            <Radio.Group
                onChange={(e) => {
                    onChange(field.key, e.target.value);
                    setActiveMenu(null);
                }}
                value={activeFilters[field.key]}
            >
                <Space direction="vertical">
                    {field.options?.map((opt) => (
                        <Radio key={opt.value} value={opt.value}>
                            <Tag color={opt.color || "default"}>{opt.label}</Tag>
                        </Radio>
                    ))}
                </Space>
            </Radio.Group>
        );
    };

    return (
        <Space wrap>
            {/* Filter dropdown */}
            <Dropdown
                overlay={activeMenu ? subMenu(filters.find((f) => f.key === activeMenu)!) : mainMenu}
                trigger={["click"]}
                onOpenChange={(open) => !open && setActiveMenu(null)}
            >
                <Button icon={<FilterOutlined />}>Filter</Button>
            </Dropdown>

            {/* Active filter tags */}
            {Object.entries(activeFilters).map(([key, val]) => {
                const field = filters.find((f) => f.key === key);
                return (
                    <Tag
                        key={key}
                        closable
                        onClose={() => onClear(key)}
                        style={{ padding: "4px 8px", fontSize: 13 }}
                    >
                        {field?.label} : <strong>{String(val)}</strong>
                    </Tag>
                );
            })}
        </Space>
    );
};

export default AdvancedFilter;
