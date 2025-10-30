import React from "react";
import type { TimeUnitType } from "@/types/backend";

interface MaintenanceFrequencyProps {
    maintenanceFrequencyValue: number | "";
    setMaintenanceFrequencyValue: (v: number | "") => void;
    maintenanceFrequencyUnit: TimeUnitType | "";
    setMaintenanceFrequencyUnit: (v: TimeUnitType | "") => void;
    maintenanceDayOfMonth: number | "";
    setMaintenanceDayOfMonth: (v: number | "") => void;
    maintenanceMonth: number | "";
    setMaintenanceMonth: (v: number | "") => void;
}

const MaintenanceFrequencySection: React.FC<MaintenanceFrequencyProps> = ({
    maintenanceFrequencyValue,
    setMaintenanceFrequencyValue,
    maintenanceFrequencyUnit,
    setMaintenanceFrequencyUnit,
    maintenanceDayOfMonth,
    setMaintenanceDayOfMonth,
    maintenanceMonth,
    setMaintenanceMonth,
}) => {
    const showMonthFields = maintenanceFrequencyUnit === "MONTH";
    const showYearFields = maintenanceFrequencyUnit === "YEAR";

    const units: { label: string; value: TimeUnitType }[] = [
        { label: "Ngày", value: "DAY" },
        { label: "Tuần", value: "WEEK" },
        { label: "Tháng", value: "MONTH" },
        { label: "Năm", value: "YEAR" },
    ];

    return (
        <div className="space-y-5">
            <h3 className="text-base font-medium text-gray-900 mb-1">
                Tần suất bảo dưỡng
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tần suất số lần */}
                <div>
                    <label className="block text-sm font-normal text-gray-900 mb-3">
                        * Tần suất (số lần)
                    </label>
                    <input
                        type="number"
                        min={1}
                        placeholder="Nhập số lần"
                        className="w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={maintenanceFrequencyValue}
                        onChange={(e) =>
                            setMaintenanceFrequencyValue(e.target.value === "" ? "" : Number(e.target.value))
                        }
                    />
                </div>

                {/* Đơn vị thời gian */}
                <div>
                    <label className="block text-sm font-normal text-gray-900 mb-3">
                        * Đơn vị thời gian
                    </label>
                    <div className="flex gap-3">
                        {units.map((u) => (
                            <button
                                key={u.value}
                                type="button"
                                onClick={() => setMaintenanceFrequencyUnit(u.value)}
                                className={`flex-1 px-4 py-2.5 text-sm rounded border transition-colors
                ${maintenanceFrequencyUnit === u.value
                                        ? "bg-blue-500 text-white border-blue-500"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                {u.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Ngày trong tháng (hiện nếu MONTH hoặc YEAR) */}
                {(showMonthFields || showYearFields) && (
                    <div>
                        <label className="block text-sm font-normal text-gray-900 mb-3">
                            * Ngày trong tháng
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={31}
                            placeholder="Nhập ngày (1–31)"
                            className="w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={maintenanceDayOfMonth}
                            onChange={(e) =>
                                setMaintenanceDayOfMonth(e.target.value === "" ? "" : Number(e.target.value))
                            }
                        />
                    </div>
                )}

                {/* Tháng trong năm (chỉ khi YEAR) */}
                {showYearFields && (
                    <div>
                        <label className="block text-sm font-normal text-gray-900 mb-3">
                            * Tháng trong năm
                        </label>
                        <select
                            className="w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={maintenanceMonth || ""}
                            onChange={(e) =>
                                setMaintenanceMonth(e.target.value === "" ? "" : Number(e.target.value))
                            }
                        >
                            <option value="">Chọn tháng</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    Tháng {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MaintenanceFrequencySection;
