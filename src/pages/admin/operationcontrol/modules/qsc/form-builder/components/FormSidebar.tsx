import React, { useState } from "react";
import {
  CheckSquare,
  Circle,
  Star,
  Camera,
  AlignLeft,
  FileText,
  Type,
  Plus,
  Sparkles,
} from "lucide-react";

/* ===== TYPES ===== */
export type ElementType =
  | "yes_no_na"
  | "multiple_choice"
  | "checkboxes"
  | "short_answer"
  | "rating"
  | "image_upload"
  | "title"
  | "description"
  | "section";

interface FormSidebarProps {
  onAddElement: (type: ElementType) => void;
}

/* ===== SIDEBAR ITEMS ===== */
const ELEMENT_TYPES = [
  {
    value: "yes_no_na" as const,
    label: "Tiêu chí QC",
    subtitle: "Có / Không / N/A",
    icon: CheckSquare,
    featured: true,
    gradient: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50",
    border: "border-blue-200",
    textColor: "text-blue-700",
    iconBg: "bg-blue-100",
  },
  {
    value: "multiple_choice" as const,
    label: "Trắc nghiệm",
    subtitle: "Chọn một đáp án",
    icon: Circle,
    gradient: "from-purple-500 to-purple-600",
    bgLight: "bg-purple-50",
    textColor: "text-purple-700",
    iconBg: "bg-purple-100",
  },
  {
    value: "checkboxes" as const,
    label: "Hộp kiểm",
    subtitle: "Chọn nhiều đáp án",
    icon: CheckSquare,
    gradient: "from-green-500 to-green-600",
    bgLight: "bg-green-50",
    textColor: "text-green-700",
    iconBg: "bg-green-100",
  },
  {
    value: "short_answer" as const,
    label: "Trả lời ngắn",
    subtitle: "Văn bản tự do",
    icon: AlignLeft,
    gradient: "from-orange-500 to-orange-600",
    bgLight: "bg-orange-50",
    textColor: "text-orange-700",
    iconBg: "bg-orange-100",
  },
  {
    value: "rating" as const,
    label: "Đánh giá",
    subtitle: "Thang điểm sao",
    icon: Star,
    gradient: "from-yellow-500 to-yellow-600",
    bgLight: "bg-yellow-50",
    textColor: "text-yellow-700",
    iconBg: "bg-yellow-100",
  },
  {
    value: "image_upload" as const,
    label: "Tải ảnh",
    subtitle: "Upload hình ảnh",
    icon: Camera,
    gradient: "from-pink-500 to-pink-600",
    bgLight: "bg-pink-50",
    textColor: "text-pink-700",
    iconBg: "bg-pink-100",
  },
  {
    value: "title" as const,
    label: "Tiêu đề",
    subtitle: "Heading lớn",
    icon: Type,
    gradient: "from-gray-500 to-gray-600",
    bgLight: "bg-gray-50",
    textColor: "text-gray-700",
    iconBg: "bg-gray-100",
  },
  {
    value: "description" as const,
    label: "Mô tả",
    subtitle: "Đoạn văn bản",
    icon: FileText,
    gradient: "from-gray-500 to-gray-600",
    bgLight: "bg-gray-50",
    textColor: "text-gray-700",
    iconBg: "bg-gray-100",
  },
  {
    value: "section" as const,
    label: "Thêm phần",
    subtitle: "Chia nhóm câu hỏi",
    icon: Plus,
    gradient: "from-indigo-500 to-indigo-600",
    bgLight: "bg-indigo-50",
    textColor: "text-indigo-700",
    iconBg: "bg-indigo-100",
  },
];

/* ===== SIDEBAR COMPONENT ===== */
const FormSidebar: React.FC<FormSidebarProps> = ({ onAddElement }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 w-64 z-50">
      {/* Main Card with Shadow & Border */}
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm">
        
        {/* Header with Gradient Background */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 px-4 py-3">
          <div className="absolute inset-0 bg-black opacity-5"></div>
          <div className="relative flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            <div>
              <h3 className="text-white font-semibold text-sm">Thêm câu hỏi</h3>
              <p className="text-blue-100 text-xs opacity-90">Chọn loại phù hợp</p>
            </div>
          </div>
        </div>

        {/* Items List with Scroll */}
        <div className="p-2.5 max-h-96 overflow-y-auto">
          <div className="space-y-1.5">
            {ELEMENT_TYPES.map((item) => {
              const Icon = item.icon;
              const isHovered = hoveredItem === item.value;

              return (
                <button
                  key={item.value}
                  onClick={() => onAddElement(item.value)}
                  onMouseEnter={() => setHoveredItem(item.value)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`
                    w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg
                    transition-all duration-200 ease-out text-left
                    border relative overflow-hidden group
                    ${
                      item.featured
                        ? `${item.bgLight} ${item.border} shadow-sm`
                        : "bg-white border-gray-100 hover:border-gray-200"
                    }
                    ${isHovered ? "shadow-md" : ""}
                  `}
                  style={{
                    transform: isHovered ? "translateY(-1px) scale(1.01)" : "none",
                  }}
                >
                  {/* Featured Badge for QC */}
                  {item.featured && (
                    <div className="absolute top-0 right-0 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-md rounded-tr-lg">
                      ★
                    </div>
                  )}

                  {/* Icon Container with Gradient on Hover */}
                  <div
                    className={`
                      w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0
                      transition-all duration-200 shadow-sm
                      ${
                        item.featured || isHovered
                          ? `bg-gradient-to-br ${item.gradient} text-white`
                          : `${item.iconBg} ${item.textColor}`
                      }
                    `}
                    style={{
                      transform: isHovered ? "scale(1.08)" : "scale(1)",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-xs ${item.featured ? item.textColor : "text-gray-800"}`}>
                      {item.label}
                    </div>
                    <div className="text-[10px] text-gray-500 truncate">{item.subtitle}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Tip with Gradient */}
        <div className="px-3 py-2 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-100">
          <p className="text-[10px] text-gray-600 text-center">
            💡 <span className="font-medium">Mẹo:</span> Kéo thả sắp xếp
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormSidebar;