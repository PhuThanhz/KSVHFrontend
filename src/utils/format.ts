export const formatCurrency = (
    value?: number | string | null
): string => {
    if (value === null || value === undefined || isNaN(Number(value))) {
        return "0 VNĐ";
    }
    const numberValue = Math.round(Number(value));
    if (numberValue === 0) return "0 VNĐ";
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numberValue);
};



export const formatDateTime = (date?: string | Date | null): string => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};


export const formatDate = (date?: string | Date | null): string => {
    if (!date) return "-";

    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";

    return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};


export const truncateText = (str?: string, length: number = 30): string => {
    if (!str) return "";
    return str.length > length ? `${str.slice(0, length)}...` : str;
};
