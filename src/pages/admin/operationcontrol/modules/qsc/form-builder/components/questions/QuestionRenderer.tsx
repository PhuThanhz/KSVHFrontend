import React from "react";
import type { QuestionItem } from "../../../../../types/form";

import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import YesNoNAQuestion from "./YesNoNAQuestion";

interface Props {
  question: QuestionItem;
  sectionIndex: number;
  elementIndex: number;

  /* dùng cho QC / yes-no-na */
  updateElement: (
    sectionIndex: number,
    elementIndex: number,
    field: string,
    value: any
  ) => void;

  /* dùng cho câu hỏi có option */
  updateOption?: (
    sectionIndex: number,
    elementIndex: number,
    optionIndex: number,
    value: string
  ) => void;
  addOption?: (sectionIndex: number, elementIndex: number) => void;
  deleteOption?: (
    sectionIndex: number,
    elementIndex: number,
    optionIndex: number
  ) => void;
}

const QuestionRenderer: React.FC<Props> = (props) => {
  const { question } = props;

  switch (question.type) {
    /* ===== QC CORE ===== */
    case "yes_no_na":
      return (
        <YesNoNAQuestion
          question={question}
          sectionIndex={props.sectionIndex}
          elementIndex={props.elementIndex}
          updateElement={props.updateElement}
        />
      );

    /* ===== OPTION BASED ===== */
    case "multiple_choice":
      return (
        <MultipleChoiceQuestion
          question={question}
          sectionIndex={props.sectionIndex}
          elementIndex={props.elementIndex}
          updateOption={props.updateOption!}
          addOption={props.addOption!}
          deleteOption={props.deleteOption!}
        />
      );

    /* ===== CHƯA DÙNG ===== */
    default:
      return null;
  }
};

export default QuestionRenderer;
