// src/pages/admin/huynhthanhphudeptrai/types/form.ts

export type QuestionType =
  | "yes_no_na"
  | "multiple_choice"
  | "checkboxes"
  | "short_answer"
  | "paragraph"
  | "image_upload"
  | "rating";

/** Giá trị trả lời QC */
export type YesNoNAValue = "yes" | "no" | "na";

export interface QuestionItem {
  id: string;
  type: QuestionType;

  /** Tiêu chuẩn / Câu hỏi */
  title: string;

  /** Yêu cầu / Mô tả */
  description: string;

  /** Bắt buộc hay không */
  required: boolean;

  /* ===== OPTION FIELDS ===== */

  /** Dùng cho multiple choice / checkbox */
  options?: string[];

  /** Rating */
  maxRating?: number;

  /* ===== QC CORE FIELDS ===== */

  /** Kết quả QC: Đạt / Không đạt / N/A */
  answer?: YesNoNAValue;

  /** Điểm tối đa của tiêu chí (vd: 1.0) */
  score?: number;

  /** Điểm thực tế đạt được */
  achievedScore?: number;

  /** Lý do không đạt (khi chọn Không) */
  notAchievedReason?: string;

  /** Ảnh minh chứng */
  evidenceImages?: string[];

  /** Nếu Không thì bắt buộc có hình */
  requireImageWhenFail?: boolean;
}
