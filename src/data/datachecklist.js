// data.js - Mystery Shopper Checklist Data for Yoshinoya
// Dữ liệu đầy đủ cho form đánh giá Mystery Shopper

export const checklistDataSource = [
  // ==========================================
  // I. ĐÁNH GIÁ TRẢI NGHIỆM TRƯỚC KHI ĐẾN NHÀ HÀNG
  // ==========================================
  {
    id: '1',
    section: 'I. TRƯỚC KHI ĐẾN NHÀ HÀNG',
    score: 1.0,
    criterion: 'Đặt bàn',
    requirement: 'Quá trình đặt bàn có dễ dàng không? Có nhân viên túc trực đặt bàn nghe điện thoại và tư vấn nhiệt tình, vui vẻ tạo cảm giác thân thiện cho bạn không?',
    isCritical: false,
  },
  {
    id: '2',
    section: 'I. TRƯỚC KHI ĐẾN NHÀ HÀNG',
    score: 1.0,
    criterion: 'Tư vấn đặt bàn',
    requirement: 'Bạn có được tư vấn đặt bàn và cung cấp thông tin phù hợp theo nhu cầu của khách?',
    isCritical: false,
  },

  // ==========================================
  // II.1. BÊN NGOÀI NHÀ HÀNG
  // ==========================================
  {
    id: '3',
    section: 'II.1. BÊN NGOÀI NHÀ HÀNG',
    score: 1.0,
    criterion: 'Bảng hiệu, hình ảnh bên ngoài nhà hàng',
    requirement: 'Sạch sẽ, trong điều kiện hoạt động tốt (bao gồm tất cả các logo, bảng hiệu của nhãn hàng, standee, POSM).',
    isCritical: false,
  },
  {
    id: '4',
    section: 'II.1. BÊN NGOÀI NHÀ HÀNG',
    score: 1.0,
    criterion: 'Khu vực Bảo vệ',
    requirement: 'Luôn có nhân viên bảo vệ trực. Nhân viên bảo vệ nhiệt tình vui vẻ, có hướng dẫn khách để xe ghi thẻ xe đầy đủ cho khách, khu vực bảo vệ sạch sẽ, không có rác.',
    isCritical: false,
  },
  {
    id: '5',
    section: 'II.1. BÊN NGOÀI NHÀ HÀNG',
    score: 1.0,
    criterion: 'Khu vực sảnh ngoài nhà hàng',
    requirement: 'Có sẵn Menu ở bên ngoài cho khách hàng tham khảo. Menu trong tình trạng tốt, không bị rách.',
    isCritical: false,
  },

  // ==========================================
  // II.2. HẠNG MỤC CHUNG - CƠ SỞ VẬT CHẤT
  // ==========================================
  {
    id: '6',
    section: 'II.2. HẠNG MỤC CHUNG',
    score: 1.0,
    criterion: 'Cơ sở vật chất - Nền, tường, trần',
    requirement: 'Nền, tường, trần sạch sẽ, không hư hỏng/ bể vỡ/ bong tróc/ dột nước khi mưa?',
    isCritical: false,
  },
  {
    id: '7',
    section: 'II.2. HẠNG MỤC CHUNG',
    score: 1.0,
    criterion: 'Cơ sở vật chất - Lối đi',
    requirement: 'Tất cả lối đi sạch sẽ, không hư hỏng, không có rác hoặc chướng ngại vật',
    isCritical: false,
  },
  {
    id: '8',
    section: 'II.2. HẠNG MỤC CHUNG',
    score: 1.0,
    criterion: 'Cơ sở vật chất - Cửa kính',
    requirement: 'Cửa kính được lau dọn sạch sẽ.',
    isCritical: false,
  },
  {
    id: '9',
    section: 'II.2. HẠNG MỤC CHUNG',
    score: 1.0,
    criterion: 'Cơ sở vật chất - Máy lạnh',
    requirement: 'Máy lạnh khu vực hoạt động tốt, không nhiễu nước',
    isCritical: false,
  },
  {
    id: '10',
    section: 'II.2. HẠNG MỤC CHUNG',
    score: 1.0,
    criterion: 'Cơ sở vật chất - Hệ thống hút mùi',
    requirement: 'Hệ thống hút mùi, thông gió tốt, nhà hàng không có mùi lạ.',
    isCritical: false,
  },

  // ==========================================
  // II.2. HẠNG MỤC CHUNG - ÂM NHẠC VÀ KHÔNG GIAN
  // ==========================================
  {
    id: '11',
    section: 'II.2. HẠNG MỤC CHUNG',
    score: 1.0,
    criterion: 'Âm nhạc',
    requirement: 'Nhà hàng có mở nhạc phù hợp (nhạc mở theo ngày Lễ, nhạc Nhật, nhạc không lời, không sử dụng nhạc Việt, hiphop, rap,…); âm lượng vừa phải để có thể nói chuyện.',
    isCritical: false,
  },
  {
    id: '12',
    section: 'II.2. HẠNG MỤC CHUNG',
    score: 1.0,
    criterion: 'Không gian - Logo',
    requirement: 'Logo, bảng hiệu nhãn hàng bên trong không bị mất từ ngữ và luôn sáng.',
    isCritical: false,
  },
  {
    id: '13',
    section: 'II.2. HẠNG MỤC CHUNG',
    score: 1.0,
    criterion: 'Không gian - Nhiệt độ',
    requirement: 'Nhiệt độ trong nhà hàng có dễ chịu hay không?',
    isCritical: false,
  },
  {
    id: '14',
    section: 'II.2. HẠNG MỤC CHUNG',
    score: 1.0,
    criterion: 'Không gian - Ánh sáng',
    requirement: 'Không gian nhà hàng có đủ ánh sáng/ đèn có được mở hay không?',
    isCritical: false,
  },
  {
    id: '15',
    section: 'II.2. HẠNG MỤC CHUNG',
    score: 1.0,
    criterion: 'Không gian - Cây cảnh',
    requirement: 'Cây cảnh trong nhà hàng không bám bụi dày, không có rác trong chậu cây',
    isCritical: false,
  },

  // ==========================================
  // II.2. HẠNG MỤC CHUNG - ĐỒNG PHỤC & TÁC PHONG
  // ==========================================
  {
    id: '16',
    section: 'II.2. HẠNG MỤC CHUNG',
    score: 1.0,
    criterion: 'Đồng phục & Tác phong',
    requirement: 'Nhân viên mặc đồng phục đúng quy định, có mang bảng tên, cơ thể không có mùi, búi tóc gọn gàng, trang điểm nhẹ nhàng (đối với nữ), tóc ngắn và không để râu (đối với nam)',
    isCritical: false,
  },
  {
    id: '17',
    section: 'II.2. HẠNG MỤC CHUNG',
    score: 1.0,
    criterion: 'Tác phong nhân viên',
    requirement: 'Tác phong nhân viên nghiêm túc khi làm việc, không tụ tập nói chuyện và làm việc riêng.',
    isCritical: false,
  },

  // ==========================================
  // II.2. HẠNG MỤC CHUNG - VỆ SINH KHU VỰC
  // ==========================================
  {
    id: '18',
    section: 'II.2. HẠNG MỤC CHUNG',
    score: 1.0,
    criterion: 'Vệ sinh - Lễ tân',
    requirement: 'Các khu vực trên đường đi phải sạch sẽ hoặc nhân viên có chủ động dọn dẹp vệ sinh không? Khu vực lễ tân sạch sẽ.',
    isCritical: false,
  },
  {
    id: '19',
    section: 'II.2. HẠNG MỤC CHUNG',
    score: 1.0,
    criterion: 'Vệ sinh - Sảnh ngồi',
    requirement: 'Khu vực sảnh ngồi sạch sẽ',
    isCritical: false,
  },
  {
    id: '20',
    section: 'II.2. HẠNG MỤC CHUNG',
    score: 1.0,
    criterion: 'Vệ sinh - Quầy nước',
    requirement: 'Khu vực quầy nước (bao gồm thùng đá) sạch sẽ',
    isCritical: false,
  },
  {
    id: '21',
    section: 'II.2. HẠNG MỤC CHUNG',
    score: 1.0,
    criterion: 'Vệ sinh - Khu vực phục vụ',
    requirement: 'Khu vực phục vụ khách hàng sạch sẽ',
    isCritical: false,
  },
  {
    id: '22',
    section: 'II.2. HẠNG MỤC CHUNG',
    score: 1.0,
    criterion: 'Vệ sinh - Đèn và trang trí',
    requirement: 'Đèn và đồ dùng trang trí nội thất xung quanh có sạch sẽ hay không?',
    isCritical: false,
  },

  // ==========================================
  // II.2. HẠNG MỤC CHUNG - CẦU THANG & TOILET (*)
  // ==========================================
  {
    id: '23',
    section: 'II.2. HẠNG MỤC CHUNG',
    score: 1.0,
    criterion: 'Cầu thang & toilet (*)',
    requirement: 'Đường thang bộ có sạch sẽ không? Tranh có bị bong tróc, trầy nhiều không? Có mùi lạ không?',
    isCritical: true,
  },
  {
    id: '24',
    section: 'II.2. HẠNG MỤC CHUNG',
    score: 1.0,
    criterion: 'Toilet - Hướng dẫn (*)',
    requirement: 'Nhân viên có hướng dẫn khách hàng khu vực toilet?',
    isCritical: true,
  },
  {
    id: '25',
    section: 'II.2. HẠNG MỤC CHUNG',
    score: 1.0,
    criterion: 'Toilet - Vệ sinh (*)',
    requirement: 'Nhà vệ sinh đảm bảo gọn gàng, sạch sẽ (không có rác, đọng nước dơ,…) và không có mùi hôi, phải có bảng caution khi ngừng phục vụ để dọn vệ sinh',
    isCritical: true,
  },
  {
    id: '26',
    section: 'II.2. HẠNG MỤC CHUNG',
    score: 1.0,
    criterion: 'Toilet - Trang thiết bị (*)',
    requirement: 'Trang thiết bị trong nhà vệ sinh đầy đủ, đảm bảo hoạt động tốt không hư hỏng (đèn, vòi xịt, lavabo,….), luôn đảm bảo có giấy, nước rửa tay',
    isCritical: true,
  },
  {
    id: '27',
    section: 'II.2. HẠNG MỤC CHUNG',
    score: 1.0,
    criterion: 'Toilet - Bảng cảnh báo (*)',
    requirement: 'Phải có bảng thông báo tạm khóa khi dọn vệ sinh hoặc biển cảnh báo "Caution Wet Floor" để khách hàng nhận biết.',
    isCritical: true,
  },

  // ==========================================
  // II.3. GREETING/CHÀO ĐÓN KHÁCH HÀNG
  // ==========================================
  {
    id: '28',
    section: 'II.3. GREETING/CHÀO ĐÓN',
    score: 5.0,
    criterion: 'Lễ tân & chào đón khách hàng (*)',
    requirement: 'Nhân viên lễ tân câu chào đúng tiêu chuẩn: "Irasshaimase/ Yoshinoya xin chào", cúi đầu chào, gương mặt thân thiện/ ánh mắt thể hiện sự tươi cười sau đó dắt khách vào bàn',
    isCritical: true,
  },
  {
    id: '29',
    section: 'II.3. GREETING/CHÀO ĐÓN',
    score: 1.0,
    criterion: 'Lấy thông tin khách hàng',
    requirement: 'Nhân viên lấy thông tin khách hàng (thông tin khách dùng tại hoặc mang về, số lượng khách,….)',
    isCritical: false,
  },
  {
    id: '30',
    section: 'II.3. GREETING/CHÀO ĐÓN',
    score: 1.0,
    criterion: 'Khu vực chờ & gửi menu',
    requirement: 'Mời khách ngồi tại khu vực chờ đối với khách đồng ý ngồi đợi bàn và thông báo thời gian hẹn khách có thể vào bàn.(trường hợp đông khách hết bàn) và gửi menu cho khách bằng 2 tay để khách tham khảo menu trước (nếu khách yêu cầu)',
    isCritical: false,
  },
  {
    id: '31',
    section: 'II.3. GREETING/CHÀO ĐÓN',
    score: 4.0,
    criterion: 'Dẫn khách vào bàn & gửi menu',
    requirement: 'Hướng dẫn khách, mời khách hàng ngồi vào bàn và gửi menu cho khách hoặc hướng dẫn khách menu trên bàn để khách tham khảo menu (Riêng đối với giờ cao điểm delay tối đa 30 giây)',
    isCritical: false,
  },
  {
    id: '32',
    section: 'II.3. GREETING/CHÀO ĐÓN',
    score: 1.0,
    criterion: 'Giao tiếp với khách hàng',
    requirement: 'Sử dụng từ "Hai" để giao tiếp khi có sự kêu gọi từ khách hàng, Nhân viên trong tư thế sẵn sàng phục vụ, gương mặt luôn tươi vui, nhiệt tình với khách hàng. Dùng cử chỉ và câu nói lịch sự để gửi thông tin đến khách hàng (Xin lỗi, xin phép, vui lòng, cảm ơn …)',
    isCritical: false,
  },

  // ==========================================
  // II.4. CHUẨN BỊ/SET UP
  // ==========================================
  {
    id: '33',
    section: 'II.4. CHUẨN BỊ/SET UP',
    score: 1.0,
    criterion: 'Set up - Bàn ghế',
    requirement: 'Chỗ ngồi bàn ghế sạch sẽ, không gãy, không bong tróc.',
    isCritical: false,
  },
  {
    id: '34',
    section: 'II.4. CHUẨN BỊ/SET UP',
    score: 1.0,
    criterion: 'Set up - Menu',
    requirement: 'Menu đầy đủ, menu đạt chất lượng, không hư hỏng, rách trang/ mất trang, mất chữ; có standy để bàn chương trình khuyến mãi (nếu có)',
    isCritical: false,
  },
  {
    id: '35',
    section: 'II.4. CHUẨN BỊ/SET UP',
    score: 1.0,
    criterion: 'Set up - Dụng cụ',
    requirement: 'Đầy đủ dụng cụ set up trên bàn theo quy định, CCDC sạch sẽ, không sứt mẻ.hư hỏng',
    isCritical: false,
  },

  // ==========================================
  // II.5. TAKING ORDER/NHẬN VÀ XÁC NHẬN ORDER
  // ==========================================
  {
    id: '36',
    section: 'II.5. TAKING ORDER',
    score: 1.0,
    criterion: 'Gửi menu và tư vấn menu (*)',
    requirement: 'Trong vòng 2 phút phải có nhân viên phục vụ đến lấy order hoặc nhân viên trực tiếp giới thiệu CTKM (Fair, CTKM,…) lấy oder để ra bill cho khách.',
    isCritical: true,
  },
  {
    id: '37',
    section: 'II.5. TAKING ORDER',
    score: 1.0,
    criterion: 'Tư vấn theo quy trình',
    requirement: 'Nhân viên tư vấn khách theo đúng quy trình: Nhóm món chính - Nhóm món phụ (Salad, Add-on) - Nước.',
    isCritical: false,
  },
  {
    id: '38',
    section: 'II.5. TAKING ORDER',
    score: 5.0,
    criterion: 'Giới thiệu CTKM',
    requirement: 'Giới thiệu CTKM, Fair menu và món bán chạy.',
    isCritical: false,
  },
  {
    id: '39',
    section: 'II.5. TAKING ORDER',
    score: 3.0,
    criterion: 'Nhận và xác nhận Order (*)',
    requirement: 'Xác nhận lập lại món khách hàng đã order, thông báo thời gian chờ',
    isCritical: true,
  },
  {
    id: '40',
    section: 'II.5. TAKING ORDER',
    score: 1.0,
    criterion: 'Giao tiếp với khách hàng',
    requirement: 'Sử dụng từ "Hai" để giao tiếp khi có sự kêu gọi từ khách hàng, Nhân viên trong tư thế sẵn sàng phục vụ, gương mặt luôn tươi vui, nhiệt tình với khách hàng. Dùng cử chỉ và câu nói lịch sự để gửi thông tin đến khách hàng (Xin lỗi, xin phép, vui lòng, cảm ơn …). Khi tư vấn, bàn tay nhân viên khép lại và hướng vào menu, giọng nói dễ nghe, âm lượng vừa đủ.',
    isCritical: false,
  },

  // ==========================================
  // II.6. PHỤC VỤ KHÁCH HÀNG
  // ==========================================
  {
    id: '41',
    section: 'II.6. PHỤC VỤ KHÁCH HÀNG',
    score: 1.0,
    criterion: 'Thứ tự phục vụ món (*)',
    requirement: 'Thứ tự món ăn được phục vụ đúng theo tiêu chuẩn: Nước - Món chính.',
    isCritical: true,
  },
  {
    id: '42',
    section: 'II.6. PHỤC VỤ KHÁCH HÀNG',
    score: 5.0,
    criterion: 'Thời gian phục vụ món (*)',
    requirement: 'Món nước pha chế được phục vụ trong vòng 5-7 phút. Món chính (Cơm, lẩu,…) phục vụ trong vòng 5 phút. Riêng món cơm bò phục vụ trong vòng 2 phút. *Đối với thời gian cao điểm (11h-14h00 và 17h00-20h00) món sẽ gấp đôi thời gian làm món',
    isCritical: true,
  },
  {
    id: '43',
    section: 'II.6. PHỤC VỤ KHÁCH HÀNG',
    score: 1.0,
    criterion: 'Thông báo thời gian chờ',
    requirement: 'Trong thời gian đông khách, nhân viên có thông báo thời gian đợi món thêm hay không (chỉ được phép hẹn thêm 1 lần)?',
    isCritical: false,
  },
  {
    id: '44',
    section: 'II.6. PHỤC VỤ KHÁCH HÀNG',
    score: 5.0,
    criterion: 'Phục vụ và hướng dẫn (*)',
    requirement: 'Đọc rõ tên món và chúc khách ngon miệng',
    isCritical: true,
  },
  {
    id: '45',
    section: 'II.6. PHỤC VỤ KHÁCH HÀNG',
    score: 1.0,
    criterion: 'Đúng số lượng',
    requirement: 'Nhân viên phục vụ đúng và đủ số lượng đồ ăn khách hàng đặt hàng',
    isCritical: false,
  },
  {
    id: '46',
    section: 'II.6. PHỤC VỤ KHÁCH HÀNG',
    score: 1.0,
    criterion: 'Phục vụ khay',
    requirement: 'Phục vụ khay đầy đủ cho khách và trên khay có giấy lót đúng quy định của nhà hàng.',
    isCritical: false,
  },
  {
    id: '47',
    section: 'II.6. PHỤC VỤ KHÁCH HÀNG',
    score: 1.0,
    criterion: 'Giao tiếp với khách hàng',
    requirement: 'Sử dụng từ "Hai" để giao tiếp khi có sự kêu gọi từ khách hàng, Nhân viên trong tư thế sẵn sàng phục vụ, gương mặt luôn tươi vui, nhiệt tình với khách hàng. Dùng cử chỉ và câu nói lịch sự để gửi thông tin đến khách hàng (Xin lỗi, xin phép, vui lòng, cảm ơn …)',
    isCritical: false,
  },

  // ==========================================
  // II.7. QUAN TÂM & CHĂM SÓC KHÁCH HÀNG
  // ==========================================
  {
    id: '48',
    section: 'II.7. QUAN TÂM & CHĂM SÓC',
    score: 1.0,
    criterion: 'Quan sát và chăm sóc (*)',
    requirement: 'Nhân viên luôn trong tầm mắt khách hàng và luôn sẵn sàng khi khách hàng có yêu cầu.',
    isCritical: true,
  },
  {
    id: '49',
    section: 'II.7. QUAN TÂM & CHĂM SÓC',
    score: 1.0,
    criterion: 'Dọn bàn',
    requirement: 'Sau khi khách dùng xong và rời đi phải có nhân viên chủ động đến dọn đĩa dơ trên bàn (đặc biệt là thời gian cao điểm có khách chờ bàn)',
    isCritical: false,
  },
  {
    id: '50',
    section: 'II.7. QUAN TÂM & CHĂM SÓC',
    score: 1.0,
    criterion: 'Tư vấn thêm',
    requirement: 'Nhân viên chủ động quan sát lượng đồ ăn/ thức uống của khách và chủ động nhận order/ tư vấn thêm của khách (tùy theo yêu cầu của khách)',
    isCritical: false,
  },
  {
    id: '51',
    section: 'II.7. QUAN TÂM & CHĂM SÓC',
    score: 3.0,
    criterion: 'Hỏi thăm ý kiến',
    requirement: 'Nhân viên có chủ động đến hỏi thăm ý kiến khách hàng về bữa ăn (chọn thời điểm hợp lý).',
    isCritical: false,
  },
  {
    id: '52',
    section: 'II.7. QUAN TÂM & CHĂM SÓC',
    score: 1.0,
    criterion: 'Giao tiếp với khách hàng',
    requirement: 'Sử dụng từ "Hai" để giao tiếp khi có sự kêu gọi từ khách hàng, Nhân viên trong tư thế sẵn sàng phục vụ, gương mặt luôn tươi vui, nhiệt tình với khách hàng. Dùng cử chỉ và câu nói lịch sự để gửi thông tin đến khách hàng (Xin lỗi, xin phép, vui lòng, cảm ơn …)',
    isCritical: false,
  },

  // ==========================================
  // II.8. PAYMENT/THANH TOÁN
  // ==========================================
  {
    id: '53',
    section: 'II.8. PAYMENT/THANH TOÁN',
    score: 1.0,
    criterion: 'Thanh toán - Thời gian phản hồi (*)',
    requirement: 'Khi khách hàng yêu cầu bill thanh toán, nhân viên có mặt trong vòng 1 phút, đối với nhà hàng có lầu tối đa 2 phút',
    isCritical: true,
  },
  {
    id: '54',
    section: 'II.8. PAYMENT/THANH TOÁN',
    score: 1.0,
    criterion: 'Xác nhận mã khuyến mãi',
    requirement: 'Xác nhận lại mã khuyến mãi, giảm giá, voucher,…',
    isCritical: false,
  },
  {
    id: '55',
    section: 'II.8. PAYMENT/THANH TOÁN',
    score: 1.0,
    criterion: 'Hình thức thanh toán',
    requirement: 'Xác nhận hình thức thanh toán của khách hàng (tiền mặt, thẻ, QR code, voucher)',
    isCritical: false,
  },
  {
    id: '56',
    section: 'II.8. PAYMENT/THANH TOÁN',
    score: 1.0,
    criterion: 'Gửi phiếu tạm tính',
    requirement: 'Gửi phiếu thanh toán tạm tính (có hiển thị đầy đủ số tiền và CTKM nếu có) và thông báo số tiền thanh toán (trừ trường hợp sử dung Voucher nội bộ sẽ thông báo khách kiểm tra lại).',
    isCritical: false,
  },
  {
    id: '57',
    section: 'II.8. PAYMENT/THANH TOÁN',
    score: 1.0,
    criterion: 'Xác nhận số tiền/thẻ',
    requirement: 'Nhân viên có xác nhận với khách hàng số tiền hoặc thẻ đã nhận không? Đối với khách hàng thanh toán bằng QR code, nhân viên lịch sự mời khách đến quầy thu ngân để thanh toán.',
    isCritical: false,
  },
  {
    id: '58',
    section: 'II.8. PAYMENT/THANH TOÁN',
    score: 1.0,
    criterion: 'Thời gian thanh toán',
    requirement: 'Thanh toán tiền cho khách hàng trong vòng 3-5 phút, hướng dẫn khách xuất hóa đơn đỏ (nếu khách yêu cầu).',
    isCritical: false,
  },
  {
    id: '59',
    section: 'II.8. PAYMENT/THANH TOÁN',
    score: 3.0,
    criterion: 'Gửi hóa đơn và tiền thừa',
    requirement: 'Gửi lại hóa đơn và tiền thừa đầy đủ cho khách hàng kiểm tra, cảm ơn khách hàng.',
    isCritical: false,
  },
  {
    id: '60',
    section: 'II.8. PAYMENT/THANH TOÁN',
    score: 1.0,
    criterion: 'Giao tiếp với khách hàng',
    requirement: 'Sử dụng từ "Hai" để giao tiếp khi có sự kêu gọi từ khách hàng, Nhân viên trong tư thế sẵn sàng phục vụ, gương mặt luôn tươi vui, nhiệt tình với khách hàng. Dùng cử chỉ và câu nói lịch sự để gửi thông tin đến khách hàng (Xin lỗi, xin phép, vui lòng, cảm ơn …)',
    isCritical: false,
  },

  // ==========================================
  // II.9. CHÀO KHÁCH RA VỀ
  // ==========================================
  {
    id: '61',
    section: 'II.9. CHÀO KHÁCH RA VỀ',
    score: 3.0,
    criterion: 'Chào và tiễn khách (*)',
    requirement: 'Toàn bộ nhân viên cảm ơn khách hàng qua câu: "Arigatou Gozaimash". *Yêu cầu có nghe nhân viên chào khách',
    isCritical: true,
  },
  {
    id: '62',
    section: 'II.9. CHÀO KHÁCH RA VỀ',
    score: 1.0,
    criterion: 'Lễ tân tiễn khách',
    requirement: 'Lễ tân/ nhân viên có cúi chào khách hàng và tươi cười, thân thiện đúng quy định, bấm thang máy cho khách (nếu có) hoặc hướng dẫn khách lối ra',
    isCritical: false,
  },

  // ==========================================
  // III. QUALITY - CHẤT LƯỢNG
  // ==========================================
  {
    id: '63',
    section: 'III. QUALITY - CHẤT LƯỢNG',
    score: 3.0,
    criterion: 'Chất lượng nước uống (*)',
    requirement: 'Chất lượng nước uống không có gì bất thường.',
    isCritical: true,
  },
  {
    id: '64',
    section: 'III. QUALITY - CHẤT LƯỢNG',
    score: 2.0,
    criterion: 'HSD và bao bì nước',
    requirement: 'Nước còn HSD và không móp méo, hư hỏng (Nước đóng lon)',
    isCritical: false,
  },
  {
    id: '65',
    section: 'III. QUALITY - CHẤT LƯỢNG',
    score: 3.0,
    criterion: 'Chất lượng món ăn - Trình bày (*)',
    requirement: 'Cách bày trí món đẹp mắt và nhiệt độ món ăn phù hợp để dùng',
    isCritical: true,
  },
  {
    id: '66',
    section: 'III. QUALITY - CHẤT LƯỢNG',
    score: 2.0,
    criterion: 'Chất lượng món ăn - Tình trạng (*)',
    requirement: 'Món ăn không có bất kì dấu hiệu bất thường (hư hỏng, ôi chua, cơm sống,….)',
    isCritical: true,
  },
];

// ==========================================
// Hướng dẫn chấm điểm
// ==========================================
export const scoringGuidelines = {
  instructions: [
    'Chỉ nhập dấu "x" vào câu trả lời 1 trong 3 mục: "Có" hoặc "Không" hoặc "N/A".',
    'Khi mắc phải lỗi trọng điểm → Mất điểm 1 mục (lỗi trọng điểm là những lỗi được đánh dấu "*")',
    'Tổng điểm: điểm đạt sau khi trừ hết các điểm hạng mục không đạt.',
    'Câu trả lời "N/A": Không tính điểm cho mục đánh giá này. Tuy nhiên tại phần "Tổng điểm" vẫn sẽ cộng vào để giữ mức điểm chuẩn.',
  ],
  gradeScale: [
    { range: '90-100', grade: 'A', description: 'Xuất sắc' },
    { range: '80-89', grade: 'B', description: 'Đạt yêu cầu' },
    { range: '70-79', grade: 'C', description: 'Không đạt yêu cầu' },
    { range: '60-69', grade: 'D', description: 'Cần cải thiện' },
    { range: '0-59', grade: 'E', description: 'Kém' },
  ],
};

// ==========================================
// Các trường hợp ngừng đánh giá
// ==========================================
export const criticalFailureCases = [
  {
    id: 'TH1',
    title: 'Trường hợp 1',
    description: 'Anh/Chị nghe những câu chửi tục, từ ngữ không đúng thuần phong mỹ tục (xuất phát từ nhân viên nhãn hàng).',
  },
  {
    id: 'TH2',
    title: 'Trường hợp 2',
    description: 'Anh/Chị thấy sự cãi vả, mẫu thuẫn nội bộ giữa nhân viên với nhau/ quản lý to tiếng la lối nhân viên trước mặt khách hoặc mâu thuẫn giữa nhân viên nhãn hàng với khách hàng.',
  },
];

// ==========================================
// Export default cho tiện sử dụng
// ==========================================
export { 
  checklistDataSource,
  scoringGuidelines,
  criticalFailureCases
};
