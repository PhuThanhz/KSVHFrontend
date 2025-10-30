/**
 * Hàm tiện ích để build query string từ object (bỏ qua giá trị undefined / null)
 * Ví dụ:
 *   buildQueryString({ page: 2, size: 10, sort: "-createdAt" })
 *   => "page=2&size=10&sort=-createdAt"
 */
export const buildQueryString = (params: Record<string, any>): string => {
    const query = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");
    return query;
};
