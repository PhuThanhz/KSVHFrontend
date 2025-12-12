import React from "react";
import type { QuestionItem, YesNoNAValue } from "../../../../../types/form";

interface Props {
  question: QuestionItem;
  sectionIndex: number;
  elementIndex: number;
  updateElement: (
    sectionIndex: number,
    elementIndex: number,
    field: string,
    value: any
  ) => void;
}

const YesNoNAQuestion: React.FC<Props> = ({
  question,
  sectionIndex,
  elementIndex,
  updateElement,
}) => {
  const handleChange = (value: YesNoNAValue) => {
    updateElement(sectionIndex, elementIndex, "answer", value);

    if (value === "no") {
      updateElement(
        sectionIndex,
        elementIndex,
        "achievedScore",
        0
      );
    }

    if (value === "yes") {
      updateElement(
        sectionIndex,
        elementIndex,
        "achievedScore",
        question.score ?? 0
      );
    }

    if (value === "na") {
      updateElement(
        sectionIndex,
        elementIndex,
        "achievedScore",
        0
      );
    }
  };

  return (
    <div className="space-y-3 mt-3">
      <div className="flex gap-6">
        {[
          { label: "Có", value: "yes" },
          { label: "Không", value: "no" },
          { label: "N/A", value: "na" },
        ].map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name={question.id}
              checked={question.answer === opt.value}
              onChange={() => handleChange(opt.value as YesNoNAValue)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>

      {/* Lý do không đạt */}
      {question.answer === "no" && (
        <textarea
          value={question.notAchievedReason || ""}
          onChange={(e) =>
            updateElement(
              sectionIndex,
              elementIndex,
              "notAchievedReason",
              e.target.value
            )
          }
          className="w-full text-sm border border-gray-300 rounded p-2"
          placeholder="Lý do không đạt"
        />
      )}
    </div>
  );
};

export default YesNoNAQuestion;
