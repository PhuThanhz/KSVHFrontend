import React from "react";
import { ArrowLeft, Eye, Save, MoreVertical, Clock, Star } from "lucide-react";

interface FormBuilderHeaderProps {
  formTitle: string;
  onBack: () => void;
  onSave: () => void;
  onPreview?: () => void;
  isSaving?: boolean;
  lastSaved?: string;
}

export const FormBuilderHeader: React.FC<FormBuilderHeaderProps> = ({
  formTitle,
  onBack,
  onSave,
  onPreview,
  isSaving = false,
  lastSaved,
}) => {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>

            <div className="flex flex-col">
              <h1 className="text-lg font-medium text-gray-900 line-clamp-1">
                {formTitle || "Biểu mẫu không có tiêu đề"}
              </h1>
              {lastSaved && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>Đã lưu {lastSaved}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center Section - Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button className="px-4 py-1.5 text-sm font-medium bg-white text-gray-900 rounded shadow-sm">
            Câu hỏi
          </button>
          <button className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded">
            Câu trả lời
          </button>
          <button className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded">
            Cài đặt
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          {/* Preview Button */}
          {onPreview && (
            <button
              onClick={onPreview}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Xem trước"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden lg:inline">Xem trước</span>
            </button>
          )}

          {/* Save Button */}
          <button
            onClick={onSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-medium text-white rounded-lg transition-all ${
              isSaving
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow"
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Lưu</span>
              </>
            )}
          </button>
          {/* More Options */}
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Tùy chọn khác"
          >
            <MoreVertical className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
      {/* Mobile Tabs */}
      <div className="md:hidden flex border-t border-gray-200">
        <button className="flex-1 px-4 py-3 text-sm font-medium border-b-2 border-purple-600 text-purple-600">
          Câu hỏi
        </button>
        <button className="flex-1 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900">
          Câu trả lời
        </button>
        <button className="flex-1 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900">
          Cài đặt
        </button>
      </div>
    </div>
  );
};