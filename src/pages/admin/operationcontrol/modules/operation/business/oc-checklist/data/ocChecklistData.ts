// src/pages/admin/huynhthanhphudeptrai/modules/operation/business/oc-checklist/data/ocChecklistData.ts

export interface ChecklistItem {
  id: string;
  text: string;
  weight: number;
  critical?: boolean;
  previousNote?: string;
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistCategory {
  id: string;
  title: string;
  sections: ChecklistSection[];
}

// ==============================
// OC CHECKLIST FULL DATA
// ==============================
export const ocChecklistData: ChecklistCategory[] = [
  {
    id: "I",
    title: "I. TÀI CHÍNH",
    sections: [
      {
        id: "I.1",
        title: "I.1 DOANH THU, TIỀN QUỸ",
        items: [
          {
            id: "I.1.1",
            text: "Két sắt được niêm phong đúng quy định vào cuối ngày.",
            weight: 2,
            critical: true,
          },
          {
            id: "I.1.2",
            text: "Chìa khóa két được giữ bởi quản lý ca, mã mở két sắt đã được vô hiệu sau lần mở/đóng két gần nhất.",
            weight: 2,
            critical: true,
          },
          {
            id: "I.1.3",
            text: `* Tiền tồn trong két có khớp với báo cáo doanh thu ghi nhận trên POS không?
* Tiền quỹ đổi lẻ trong két có bảng liệt kê cụ thể đầu giờ bàn giao cho thu ngân không?`,
            weight: 2,
          },
          {
            id: "I.1.4",
            text: `Doanh thu tiền mặt lưu giữ tại két sắt nhà hàng từ 01 ngày trở lên
phải có hình ảnh xác nhận còn nguyên vẹn niêm phong khi bàn giao giữa các ca.`,
            weight: 1,
          },
          {
            id: "I.1.5",
            text: `Số tồn thực tế doanh thu tiền mặt chưa đi bank-in khớp với số tồn trên báo cáo doanh thu cuối ngày hôm trước.`,
            weight: 3,
            critical: true,
          },
          {
            id: "I.1.6",
            text: `Số tồn Petty Cash thực tế khớp với số tồn cuối trên sổ Petty Cash.`,
            weight: 3,
            critical: true,
          },
          {
            id: "I.1.7",
            text: `Số tồn quỹ chung bao gồm cả tiền mặt và voucher khớp với số tồn cuối trong sổ quỹ chung.`,
            weight: 3,
            critical: true,
          },
          {
            id: "I.1.8",
            text: `Tiền float thực tế khớp với số tồn trên sổ bàn giao ca.`,
            weight: 3,
            critical: true,
          },
          {
            id: "I.1.10",
            text: `Số tồn thực tế tiền khách hàng đặt cọc khớp với sổ sách và chứng từ nhận đặt cọc.`,
            weight: 2,
            critical: true,
          },
          {
            id: "I.1.11",
            text: `Doanh thu từ thẻ / voucher trên báo cáo đóng ca cuối ngày phải khớp với tiền / voucher đã thu.`,
            weight: 3,
            critical: true,
          },
        ],
      },
      {
        id: "I.2",
        title: "I.2 SỔ BÀN GIAO CA",
        items: [
          {
            id: "I.2.1",
            text: "Sổ bàn giao ca được lưu giữ đầy đủ theo quy định.",
            weight: 1,
          },
          {
            id: "I.2.2",
            text: "Quản lý mở ca cùng nhân viên chỉ định làm chứng mở ca kiểm đếm và ghi nhận đúng số tồn thực tế.",
            weight: 2,
          },
          {
            id: "I.2.5",
            text: "Số liệu bàn giao trong sổ sách được ghi chép rõ ràng, chính xác, có chữ ký đầy đủ.",
            weight: 1,
            previousNote:
              "Sổ bàn giao ca ngày 17/6 không có đầy đủ chữ ký khi bàn giao tiền float.",
          },
        ],
      },
      // các mục I.3, I.4, I.5... tương tự (copy từ bạn cung cấp)
    ],
  },
  {
    id: "II",
    title: "II. HÀNG HÓA",
    sections: [
      {
        id: "II.1",
        title: "II.1 NHẬP VÀ BẢO QUẢN HÀNG HÓA, CCDC, TTB",
        items: [
          {
            id: "II.1.1",
            text: "Nhà hàng có thực hiện đúng quy trình đặt hàng hay không?",
            weight: 1,
          },
          {
            id: "II.1.6",
            text: `Cập nhật Hạn Sử dụng lên hàng hóa đầy đủ, chính xác theo quy định.`,
            weight: 1,
            previousNote: `*Không cập nhật HSD: Nước chanh (bình), Cont gà.`,
          },
        ],
      },
    ],
  },
  {
    id: "III",
    title: "III. NHÂN SỰ",
    sections: [
      {
        id: "III.1",
        title: "III.1 TUÂN THỦ LỊCH LÀM VIỆC",
        items: [
          {
            id: "III.1.1",
            text: "Các nhân sự thay đổi, điều chuyển có thông báo phê duyệt theo đúng quy định.",
            weight: 1,
          },
          {
            id: "III.1.3",
            text: "Có tình trạng nhân viên không có thật tại nhà hàng không?",
            weight: 3,
            critical: true,
          },
        ],
      },
    ],
  },
];
