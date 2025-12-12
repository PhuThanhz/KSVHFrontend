export const financeChecklist = [
  {
    section: "I.1",
    title: "Doanh thu, Tiền quỹ",
    items: [
      {
        code: "I.1.1",
        content: "Két sắt được niêm phong đúng quy định vào cuối ngày.",
        weight: 2,
        critical: false,
      },
      {
        code: "I.1.2",
        content:
          "Chìa khóa két được giữ bởi quản lý ca, mã mở két đã được vô hiệu sau lần mở gần nhất.",
        weight: 2,
        critical: false,
      },
      {
        code: "I.1.3",
        content:
          "Tiền tồn trong két có khớp với báo cáo doanh thu POS? Tiền quỹ đổi lẻ có bảng liệt kê?",
        weight: 2,
        critical: false,
      },
      {
        code: "I.1.4",
        content:
          "Tiền mặt lưu giữ tại két sắt từ 01 ngày trở lên phải có hình ảnh bàn giao nguyên vẹn.",
        weight: 1,
        critical: false,
      },
      {
        code: "I.1.5",
        content:
          "Số tồn thực tế doanh thu tiền mặt chưa nộp bank-in khớp với sổ cuối ngày (CRITICAL).",
        weight: 3,
        critical: true,
      },
      {
        code: "I.1.6",
        content: "Số tồn Petty Cash thực tế khớp với sổ Petty Cash (CRITICAL).",
        weight: 3,
        critical: true,
      },
      {
        code: "I.1.7",
        content:
          "Số tồn quỹ chung tiền mặt + voucher khớp với sổ quỹ chung (CRITICAL).",
        weight: 3,
        critical: true,
      },
      {
        code: "I.1.8",
        content:
          "Tiền float thực tế khớp với số tồn trên sổ bàn giao ca (CRITICAL).",
        weight: 3,
        critical: true,
      },
    ],
  },

  {
    section: "I.2",
    title: "Sổ bàn giao ca",
    items: [
      {
        code: "I.2.1",
        content: "Sổ bàn giao ca được lưu giữ đầy đủ đúng quy định.",
        weight: 1,
        critical: false,
      },
      {
        code: "I.2.2",
        content: "Quản lý mở ca kiểm đếm và ghi nhận đúng số tồn thực tế.",
        weight: 2,
        critical: false,
      },
      {
        code: "I.2.3",
        content: "Sổ quỹ nhà hàng có được theo dõi, cập nhật đầy đủ?",
        weight: 1,
        critical: false,
      },
    ],
  },
];
