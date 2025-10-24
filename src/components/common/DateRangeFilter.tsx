// src/components/common/DateRangeFilter.tsx
import { DatePicker, Typography } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";

dayjs.extend(utc);
const { Text } = Typography;

interface DateRangeFilterProps {
    label?: string;
    defaultValue?: [string | null, string | null];
    onChange?: (filter: string | null) => void;
    format?: string;
    fieldName?: string;
    width?: number;           // NEW: chỉnh chiều rộng
    size?: "small" | "middle" | "large"; // NEW: chỉnh size
    className?: string;       // NEW: cho phép custom class
}

const DateRangeFilter = ({
    label = "Lọc theo ngày tạo",
    defaultValue,
    onChange,
    format = "YYYY-MM-DD",
    fieldName = "createdAt",
    width = 320,
    size = "middle",
    className,
}: DateRangeFilterProps) => {
    const [range, setRange] = useState<[string | null, string | null]>(
        defaultValue || [null, null]
    );

    useEffect(() => {
        if (defaultValue) setRange(defaultValue);
    }, [defaultValue]);

    const handleChange: RangePickerProps["onChange"] = (dates) => {
        if (!dates) {
            setRange([null, null]);
            onChange?.(null);
            return;
        }
        const start = dates[0]?.startOf("day").utc().toISOString() ?? null;
        const end = dates[1]?.endOf("day").utc().toISOString() ?? null;
        setRange([start, end]);

        if (start && end) {
            const filter = `(${fieldName}>='${start}' and ${fieldName}<='${end}')`;
            onChange?.(filter);
        } else {
            onChange?.(null);
        }
    };

    return (
        <div className={className} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Text style={{ margin: 0, whiteSpace: "nowrap" }}>{label}</Text>
            <DatePicker.RangePicker
                size={size}
                format={format}
                placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                style={{ width }}
                value={
                    range[0] && range[1] ? [dayjs(range[0]), dayjs(range[1])] : undefined
                }
                onChange={handleChange}
                allowClear
                inputReadOnly
            />
        </div>
    );
};

export default DateRangeFilter;
