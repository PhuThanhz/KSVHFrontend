import { Input, Select, Row, Col, Space, Button } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { useState } from "react";

interface SearchField {
    key: string;
    label: string;
    placeholder?: string;
}

interface FilterField {
    key: string;
    label: string;
    options: { label: string; value: string }[];
}

interface SearchFilterBarProps {
    searchFields?: SearchField[];
    filterFields?: FilterField[];
    onChange: (values: { search: Record<string, string>; filters: Record<string, string> }) => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
    searchFields = [],
    filterFields = [],
    onChange,
}) => {
    const [search, setSearch] = useState<Record<string, string>>({});
    const [filters, setFilters] = useState<Record<string, string>>({});

    const handleSearchChange = (key: string, value: string) => {
        const updated = { ...search, [key]: value };
        setSearch(updated);
        onChange({ search: updated, filters });
    };

    const handleFilterChange = (key: string, value: string) => {
        const updated = { ...filters, [key]: value };
        setFilters(updated);
        onChange({ search, filters: updated });
    };

    const handleReset = () => {
        setSearch({});
        setFilters({});
        onChange({ search: {}, filters: {} });
    };

    return (
        <div
            style={{
                background: "#fff",
                padding: 16,
                borderRadius: 8,
                marginBottom: 16,
                border: "1px solid #f0f0f0",
            }}
        >
            <Row gutter={[12, 12]} align="middle">
                {searchFields.map((field) => (
                    <Col key={field.key} xs={24} sm={12} md={8} lg={6}>
                        <Input
                            placeholder={field.placeholder || `Tìm kiếm ${field.label}`}
                            prefix={<SearchOutlined />}
                            value={search[field.key] || ""}
                            onChange={(e) => handleSearchChange(field.key, e.target.value)}
                        />
                    </Col>
                ))}

                {filterFields.map((field) => (
                    <Col key={field.key} xs={24} sm={12} md={8} lg={6}>
                        <Select
                            allowClear
                            placeholder={`Chọn ${field.label}`}
                            style={{ width: "100%" }}
                            value={filters[field.key] || undefined}
                            onChange={(v) => handleFilterChange(field.key, v)}
                            options={field.options}
                        />
                    </Col>
                ))}

                <Col>
                    <Space>
                        <Button icon={<ReloadOutlined />} onClick={handleReset}>
                            Làm mới
                        </Button>
                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default SearchFilterBar;
