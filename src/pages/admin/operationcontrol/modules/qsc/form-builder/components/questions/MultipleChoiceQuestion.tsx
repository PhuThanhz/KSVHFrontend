import React from "react";
import { X } from "lucide-react";
import type { QuestionItem } from "../../../../../types/form";

interface Props {
  question: QuestionItem;
  sectionIndex: number;
  elementIndex: number;
  updateOption: (
    sectionIndex: number,
    elementIndex: number,
    optionIndex: number,
    value: string
  ) => void;
  addOption: (sectionIndex: number, elementIndex: number) => void;
  deleteOption: (
    sectionIndex: number,
    elementIndex: number,
    optionIndex: number
  ) => void;
}

const MultipleChoiceQuestion: React.FC<Props> = ({
  question,
  sectionIndex,
  elementIndex,
  updateOption,
  addOption,
  deleteOption,
}) => {
  return (
    <div className="space-y-2 mt-3">
      {question.options?.map((option, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <input
            type="radio"
            disabled
            className="w-4 h-4 text-blue-600"
          />

          <input
            value={option}
            onChange={(e) =>
              updateOption(sectionIndex, elementIndex, idx, e.target.value)
            }
            className="flex-1 text-sm border-b border-gray-200 focus:border-blue-600 outline-none py-1"
            placeholder={`Tùy chọn ${idx + 1}`}
          />

          {question.options!.length > 1 && (
            <button
              onClick={() =>
                deleteOption(sectionIndex, elementIndex, idx)
              }
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}

      <button
        onClick={() => addOption(sectionIndex, elementIndex)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mt-2"
      >
        <input type="radio" disabled />
        <span>Thêm tùy chọn</span>
      </button>
    </div>
  );
};

export default MultipleChoiceQuestion;
