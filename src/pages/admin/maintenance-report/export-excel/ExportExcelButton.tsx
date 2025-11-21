import React, { useState } from "react";
import { downloadExcel } from "@/config/downloadExcel";

interface ExportExcelButtonProps {
    label: string;                         // Tên nút
    apiFn: (filter: any) => Promise<any>;  // API download (đã viết ở file api)
    filter: any;                           // Filter gửi lên backend
    fileName: string;                      // Tên file tải về
}

const ExportExcelButton: React.FC<ExportExcelButtonProps> = ({
    label,
    apiFn,
    filter,
    fileName,
}) => {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        try {
            setLoading(true);
            await downloadExcel(apiFn(filter), fileName);
        } catch (err) {
            console.error("Export Excel failed:", err);
            alert("Không thể xuất file Excel");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
            {loading ? "Đang xử lý..." : label}
        </button>
    );
};

export default ExportExcelButton;
