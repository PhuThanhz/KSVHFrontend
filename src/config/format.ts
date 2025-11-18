/**
 * Định dạng số thành đơn vị tiền tệ VNĐ hoặc theo locale
 * @param value số tiền (number)
 * @param locale ngôn ngữ hiển thị, mặc định là "vi-VN"
 * @param currency loại tiền, mặc định là "VND"
 * @returns Chuỗi định dạng ví dụ: "25.000 ₫"
 */
export const formatCurrency = (
    value?: number | null,
    locale: string = "vi-VN",
    currency: string = "VND"
): string => {
    if (value === null || value === undefined || isNaN(Number(value))) return "0 ₫";
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Number(value));
};

/**
 * Định dạng ngày giờ về dạng DD/MM/YYYY HH:mm
 * @param date string hoặc Date
 * @returns Chuỗi ngày giờ định dạng "DD/MM/YYYY HH:mm" hoặc "-"
 */
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
/**
 * Định dạng ngày về dạng DD/MM/YYYY
 * @param date string hoặc Date
 * @returns Chuỗi ngày "DD/MM/YYYY" hoặc "-"
 */
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
/**
 * Rút gọn chuỗi dài, dùng trong bảng hoặc tooltip
 * @param str chuỗi cần rút gọn
 * @param length độ dài tối đa (mặc định: 30)
 * @returns Chuỗi rút gọn ví dụ: "Thiết bị kiểm tra áp suất..."
 */
export const truncateText = (str?: string, length: number = 30): string => {
    if (!str) return "";
    return str.length > length ? `${str.slice(0, length)}...` : str;
};
