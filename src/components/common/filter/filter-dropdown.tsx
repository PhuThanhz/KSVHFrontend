import { useState } from "react";
import { Button, Dropdown, Menu, Tag, DatePicker, Checkbox, Space } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface FilterOption {
    key: string;
    label: string;
    type?: "select" | "date";
    options?: { label: string; value: string }[];
}

interface FilterDropdownProps {
    filters: FilterOption[];
    onChange: (values: Record<string, any>) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ filters, onChange }) => {
    const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
    const [openKey, setOpenKey] = useState<string | null>(null);

    const handleSelect = (key: string, value: any) => {
        const updated = { ...selectedFilters, [key]: value };
        setSelectedFilters(updated);
        onChange(updated);
    };

    const menu = (
        <Menu>
            {filters.map((filter) => (
                <Menu.SubMenu
                    key={filter.key}
                    title={filter.label}
                    onTitleClick={() => setOpenKey(filter.key)}
                >
                    {filter.type === "select" &&
                        filter.options?.map((opt) => (
                            <Menu.Item key={opt.value} onClick={() => handleSelect(filter.key, opt.value)}>
                                <Checkbox
                                    checked={selectedFilters[filter.key] === opt.value}
                                    style={{ marginRight: 8 }}
                                />
                                {opt.label}
                            </Menu.Item>
                        ))}

                    {filter.type === "date" && (
                        <Menu.Item key={`${filter.key}-date`}>
                            <DatePicker
                                onChange={(date) => handleSelect(filter.key, date ? dayjs(date).toISOString() : null)}
                            />
                        </Menu.Item>
                    )}
                </Menu.SubMenu>
            ))}
        </Menu>
    );

    return (
        <Dropdown overlay={menu} trigger={["click"]}>
            <Button icon={<FilterOutlined />}>Filter</Button>
        </Dropdown>
    );
};

export default FilterDropdown;
