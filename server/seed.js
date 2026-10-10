import bcrypt from 'bcryptjs';
import { pool } from './db.js';

async function seed() {
  console.log('--- BAT DAU SEED DU LIEU CHO TBU MOT CUA ---');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. SEED USERS
    console.log('1. Seeding users...');
    const hashedPw = await bcrypt.hash('123456', 10);
    const users = [
      ['Đặng Văn Long', 'admin@tbu.edu.vn', 'ADMIN-001', hashedPw, 'Admin', '0988123456', 'Văn phòng', 'Active'],
      ['Lê Thu Hà', 'thuha@tbu.edu.vn', 'CBGV-0145', hashedPw, 'Cán bộ xử lý', '0977234567', 'Phòng Đào tạo', 'Active'],
      ['Nguyễn Thị Hương', 'huongnt@tbu.edu.vn', 'CBGV-0048', hashedPw, 'Cán bộ xử lý', '0966345678', 'Phòng Tổ chức Cán bộ', 'Active'],
      ['Trần Minh Đức', 'minhduc@tbu.edu.vn', 'CBGV-0182', hashedPw, 'CBGV', '0912456789', 'Khoa Kinh tế', 'Active'],
      ['Nguyễn Lan Anh', 'lananh@tbu.edu.vn', '21D100123', hashedPw, 'Sinh viên', '0988654321', 'Khoa Kinh tế', 'Active'],
      ['Phạm Hoàng Nam', 'namph@tbu.edu.vn', '21D120056', hashedPw, 'Sinh viên', '0977112233', 'Khoa CNTT', 'Active'],
      ['Đỗ Ngọc Mai', 'ngocmai@tbu.edu.vn', '21D110089', hashedPw, 'Sinh viên', '0933445566', 'Khoa Ngoại ngữ', 'Active']
    ];

    for (const u of users) {
      await client.query(`
        INSERT INTO users (name, email, code, password, role, phone, department, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role
      `, u);
    }

    // 2. SEED PROCEDURES
    console.log('2. Seeding procedures...');
    const procedures = [
      {
        code: 'TT-ĐT-001',
        name: 'Cấp giấy xác nhận sinh viên',
        dept: 'Phòng Đào tạo',
        dept_short: 'ĐT',
        audience: 'Sinh viên',
        time: '1-2 ngày',
        fee: 0,
        description: 'Cấp giấy xác nhận đang học tập tại trường phục vụ vay vốn ngân hàng, tạm hoãn nghĩa vụ quân sự hoặc chế độ chính sách.',
        details: 'Sinh viên điền đầy đủ thông tin vào mẫu đơn, nộp trực tuyến và nhận kết quả tại Bộ phận Một cửa hoặc bản điện tử có chữ ký số.',
        steps: [
          { name: 'Nộp hồ sơ trực tuyến', desc: 'Sinh viên gửi đơn yêu cầu qua Cổng dịch vụ Một cửa.', dept: 'Sinh viên', time: '15 phút' },
          { name: 'Tiếp nhận & Kiểm tra', desc: 'Cán bộ Một cửa kiểm tra tính hợp lệ và thông tin sinh viên.', dept: 'Bộ phận Một cửa', time: '4 giờ' },
          { name: 'Xác nhận & Ký duyệt', desc: 'Lãnh đạo Phòng Đào tạo duyệt và cấp giấy xác nhận.', dept: 'Phòng Đào tạo', time: '1 ngày' },
          { name: 'Trả kết quả', desc: 'Gửi thông báo và trả bản in hoặc bản số hóa cho sinh viên.', dept: 'Bộ phận Một cửa', time: '4 giờ' }
        ],
        requirements: ['Đơn đề nghị cấp giấy xác nhận sinh viên', 'Bản chụp thẻ sinh viên hoặc CCCD']
      },
      {
        code: 'TT-ĐT-002',
        name: 'Xin cấp lại thẻ sinh viên',
        dept: 'Phòng Đào tạo',
        dept_short: 'ĐT',
        audience: 'Sinh viên',
        time: '3 ngày',
        fee: 50000,
        description: 'Cấp lại thẻ sinh viên bị mất, hỏng hoặc cần cập nhật thông tin.',
        details: 'Sinh viên làm đơn đề nghị, đính kèm ảnh chân dung 3x4 và lệ phí làm lại thẻ theo quy định.',
        steps: [
          { name: 'Nộp đơn cấp lại thẻ', desc: 'Điền đơn và đính kèm ảnh 3x4 nền xanh.', dept: 'Sinh viên', time: '15 phút' },
          { name: 'Thẩm định hồ sơ', desc: 'Kiểm tra thông tin trên hệ thống quản lý đào tạo.', dept: 'Phòng Đào tạo', time: '1 ngày' },
          { name: 'In phôi thẻ mới', desc: 'Bộ phận kỹ thuật in ấn phôi thẻ sinh viên tích hợp chip.', dept: 'Trung tâm CNTT', time: '1 ngày' },
          { name: 'Giao trả thẻ', desc: 'Nhận thẻ tại bàn tiếp nhận Bộ phận Một cửa.', dept: 'Bộ phận Một cửa', time: '4 giờ' }
        ],
        requirements: ['Đơn xin cấp lại thẻ sinh viên', '01 ảnh thẻ 3x4 chụp không quá 6 tháng', 'Biên lai lệ phí']
      },
      {
        code: 'TT-TCCB-001',
        name: 'Đăng ký nghỉ phép năm',
        dept: 'Phòng Tổ chức Cán bộ',
        dept_short: 'TCCB',
        audience: 'CBGV',
        time: '3 ngày',
        fee: 0,
        description: 'Giải quyết chế độ nghỉ phép năm cho cán bộ, giảng viên và nhân viên nhà trường.',
        details: 'Cán bộ làm đơn xin nghỉ phép năm có ý kiến chấp thuận của Trưởng đơn vị/Trưởng khoa trước khi gửi về Phòng TCCB.',
        steps: [
          { name: 'Lập đơn xin nghỉ phép', desc: 'Điền đơn và xin ý kiến phê duyệt của Trưởng đơn vị.', dept: 'Cán bộ / Giảng viên', time: '1 ngày' },
          { name: 'Gửi hồ sơ lên Một cửa', desc: 'Tải đơn có chữ ký lên cổng trực tuyến.', dept: 'Bộ phận Một cửa', time: '2 giờ' },
          { name: 'Thẩm định chế độ', desc: 'Phòng TCCB rà soát số ngày phép còn lại trong năm.', dept: 'Phòng TCCB', time: '1 ngày' },
          { name: 'Phê duyệt & Ban hành', desc: 'Ban Giám hiệu ký duyệt quyết định nghỉ phép.', dept: 'Ban Giám hiệu', time: '1 ngày' }
        ],
        requirements: ['Đơn xin nghỉ phép năm (BM-TCCB-01)', 'Ý kiến phê duyệt của Trưởng đơn vị']
      },
      {
        code: 'TT-KHTC-001',
        name: 'Thanh toán công tác phí',
        dept: 'Phòng Kế hoạch - Tài chính',
        dept_short: 'KHTC',
        audience: 'CBGV',
        time: '5-7 ngày',
        fee: 0,
        description: 'Quyết toán các chi phí đi lại, ăn ở và phụ cấp lưu trú trong quá trình đi công tác theo lệnh điều động.',
        details: 'Hồ sơ bao gồm Giấy đi đường có xác nhận nơi đến, hóa đơn chứng từ vé xe, khách sạn hợp lệ.',
        steps: [
          { name: 'Tập hợp chứng từ', desc: 'Cán bộ tập hợp hóa đơn tài chính và giấy đi đường.', dept: 'Người thanh toán', time: '2 ngày' },
          { name: 'Lập giấy đề nghị', desc: 'Kê khai bảng thanh toán công tác phí.', dept: 'Bộ phận Một cửa', time: '1 ngày' },
          { name: 'Kiểm tra tài chính', desc: 'Phòng KHTC kiểm tra định mức chi tiêu nội bộ.', dept: 'Phòng KHTC', time: '3 ngày' },
          { name: 'Chuyển khoản chi trả', desc: 'Chuyển tiền vào tài khoản cán bộ nhận công tác phí.', dept: 'Kế toán viên', time: '1 ngày' }
        ],
        requirements: ['Giấy đề nghị thanh toán công tác phí', 'Giấy đi đường có đóng dấu nơi đến', 'Hóa đơn tài chính hợp lệ']
      },
      {
        code: 'TT-KHCN-001',
        name: 'Đề xuất nhiệm vụ khoa học công nghệ',
        dept: 'Phòng KHCN & HTPT',
        dept_short: 'KHCN',
        audience: 'CBGV',
        time: '10 ngày',
        fee: 0,
        description: 'Đăng ký đề tài nghiên cứu khoa học cấp trường, cấp tỉnh hoặc các chương trình hợp tác phát triển.',
        details: 'Nộp thuyết minh đề tài theo mẫu quy chuẩn kèm danh sách thành viên nhóm nghiên cứu.',
        steps: [
          { name: 'Nộp thuyết minh đề tài', desc: 'Tải file đề cương thuyết minh lên hệ thống.', dept: 'Chủ nhiệm đề tài', time: '1 ngày' },
          { name: 'Sơ tuyển hồ sơ', desc: 'Phòng KHCN rà soát tính hợp lệ và trùng lặp đề tài.', dept: 'Phòng KHCN & HTPT', time: '3 ngày' },
          { name: 'Hội đồng thẩm định', desc: 'Hội đồng khoa học trường đánh giá tính khả thi.', dept: 'Hội đồng KHCN', time: '5 ngày' },
          { name: 'Thông báo kết quả', desc: 'Công bố danh mục đề tài được phê duyệt.', dept: 'Ban Giám hiệu', time: '1 ngày' }
        ],
        requirements: ['Phiếu đề xuất nhiệm vụ KHCN', 'Đề cương thuyết minh sơ bộ']
      },
      {
        code: 'TT-VP-001',
        name: 'Đăng ký sử dụng phòng học / Hội trường',
        dept: 'Văn phòng',
        dept_short: 'VP',
        audience: 'Tất cả',
        time: '1-2 ngày',
        fee: 0,
        description: 'Đăng ký mượn giảng đường, hội trường đa năng phục vụ học bù, hội thảo, sinh hoạt câu lạc bộ.',
        details: 'Đăng ký trước tối thiểu 2 ngày làm việc để Văn phòng sắp xếp lịch và kỹ thuật viên hỗ trợ âm thanh, máy chiếu.',
        steps: [
          { name: 'Gửi phiếu đăng ký', desc: 'Đăng ký thời gian, số lượng người và thiết bị cần.', dept: 'Người đăng ký', time: '15 phút' },
          { name: 'Kiểm tra lịch phòng', desc: 'Văn phòng kiểm tra tình trạng trống của cơ sở vật chất.', dept: 'Văn phòng', time: '4 giờ' },
          { name: 'Xác nhận cấp phòng', desc: 'Gửi xác nhận lịch và liên hệ bảo vệ mở cửa.', dept: 'Văn phòng', time: '1 ngày' }
        ],
        requirements: ['Phiếu đăng ký sử dụng phòng học / hội trường']
      }
    ];

    for (const p of procedures) {
      await client.query(`
        INSERT INTO procedures (code, name, dept, dept_short, audience, time, fee, description, details, steps, requirements)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
      `, [p.code, p.name, p.dept, p.dept_short, p.audience, p.time, p.fee, p.description, p.details, JSON.stringify(p.steps), JSON.stringify(p.requirements)]);
    }

    // 3. SEED FORMS
    console.log('3. Seeding forms...');
    const forms = [
      ['BM-ĐT-01', 'Đơn xin xác nhận sinh viên', 'Đào tạo', 'Phòng Đào tạo', 'v2.0', 'PDF', '180 KB', 320],
      ['BM-ĐT-02', 'Đơn xin cấp lại thẻ sinh viên', 'Đào tạo', 'Phòng Đào tạo', 'v1.0', 'DOC', '155 KB', 198],
      ['BM-ĐT-03', 'Đơn đăng ký học lại / cải thiện điểm', 'Đào tạo', 'Phòng Đào tạo', 'v2.1', 'PDF', '275 KB', 241],
      ['BM-TCCB-01', 'Đơn xin nghỉ phép năm', 'Nghỉ phép', 'Phòng TCCB', 'v2.0', 'PDF', '248 KB', 145],
      ['BM-TCCB-02', 'Đơn xin nghỉ ốm / thai sản', 'Nghỉ phép', 'Phòng TCCB', 'v1.2', 'DOC', '186 KB', 98],
      ['BM-TCCB-03', 'Đơn xin chuyển ngạch viên chức', 'HĐLĐ', 'Phòng TCCB', 'v1.0', 'DOC', '162 KB', 74],
      ['BM-KHTC-01', 'Giấy đề nghị thanh toán công tác phí', 'Lương', 'Phòng KHTC', 'v2.0', 'PDF', '420 KB', 87],
      ['BM-KHTC-02', 'Bảng kê chi phí công tác', 'Lương', 'Phòng KHTC', 'v1.0', 'XLS', '128 KB', 45],
      ['BM-KHCN-01', 'Phiếu đề xuất nhiệm vụ KHCN', 'Tập huấn', 'Phòng KHCN', 'v1.0', 'DOC', '344 KB', 51],
      ['BM-VP-01', 'Phiếu đăng ký sử dụng phòng học / hội trường', 'Đào tạo', 'Văn phòng', 'v1.2', 'PDF', '232 KB', 65]
    ];

    for (const f of forms) {
      await client.query(`
        INSERT INTO forms (code, name, category, dept, version, type, size, downloads)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, downloads = EXCLUDED.downloads
      `, f);
    }

    // 4. SEED APPLICATIONS
    console.log('4. Seeding applications...');
    const apps = [
      ['HS-2026-001234', 'Nguyễn Lan Anh', '21D100123', 'lananh@tbu.edu.vn', '0988654321', 'Phòng Đào tạo', 'Cấp giấy xác nhận sinh viên', 'TT-ĐT-001', 'blue', 'Đang xử lý', 'Lê Thu Hà', 'Đã tiếp nhận hồ sơ hợp lệ.'],
      ['HS-2026-001229', 'Trần Minh Đức', 'CBGV-0182', 'minhduc@tbu.edu.vn', '0912456789', 'Phòng KHTC', 'Thanh toán công tác phí', 'TT-KHTC-001', 'yellow', 'Chờ bổ sung', 'Nguyễn Văn Minh', 'Thiếu hóa đơn vé máy bay lượt về.'],
      ['HS-2026-001228', 'Đỗ Ngọc Mai', '21D110089', 'ngocmai@tbu.edu.vn', '0933445566', 'Phòng Đào tạo', 'Xin cấp lại thẻ sinh viên', 'TT-ĐT-002', 'green', 'Hoàn thành', 'Lê Thu Hà', 'Đã in xong thẻ mới, mời sinh viên đến nhận.'],
      ['HS-2026-001225', 'Phạm Hoàng Nam', '21D120056', 'namph@tbu.edu.vn', '0977112233', 'Phòng KHCN', 'Đề xuất nhiệm vụ khoa học công nghệ', 'TT-KHCN-001', 'red', 'Đang xử lý', 'Trần Thị Mai', 'Đang trình Hội đồng thẩm định chuyên môn.'],
      ['HS-2026-001218', 'Nguyễn Thị Hương', 'CBGV-0048', 'huongnt@tbu.edu.vn', '0966345678', 'Phòng TCCB', 'Đăng ký nghỉ phép năm', 'TT-TCCB-001', 'green', 'Trả kết quả', 'Đặng Văn Long', 'Đã ban hành quyết định nghỉ phép.']
    ];

    for (const a of apps) {
      await client.query(`
        INSERT INTO applications (code, applicant_name, applicant_code, email, phone, dept, procedure_name, procedure_code, priority, status, assigned_staff, note)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (code) DO UPDATE SET status = EXCLUDED.status, note = EXCLUDED.note
      `, a);

      // Add timeline
      await client.query(`
        INSERT INTO application_timeline (application_code, status, staff_name, note)
        VALUES ($1, 'Đã tiếp nhận', 'Cổng Một cửa', 'Tiếp nhận hồ sơ trực tuyến từ người nộp.')
      `, [a[0]]);

      if (a[9] !== 'Tiếp nhận') {
        await client.query(`
          INSERT INTO application_timeline (application_code, status, staff_name, note)
          VALUES ($1, $2, $3, $4)
        `, [a[0], a[9], a[10], a[11]]);
      }
    }

    // 5. SEED FAQS
    console.log('5. Seeding faqs...');
    const faqs = [
      ['Làm thế nào để nộp hồ sơ xin giấy xác nhận sinh viên trực tuyến?', 'Bạn chỉ cần đăng nhập bằng email sinh viên trường (@tbu.edu.vn), vào mục "Nộp hồ sơ", chọn thủ tục "Cấp giấy xác nhận sinh viên", điền thông tin và nhấn "Gửi hồ sơ". Hệ thống sẽ cấp ngay mã hồ sơ để bạn theo dõi.', 'Sinh viên'],
      ['Thời gian xử lý hồ sơ thông thường mất bao lâu?', 'Thời gian xử lý trung bình từ 1-3 ngày làm việc tùy theo tính chất từng thủ tục. Các thủ tục xác nhận sinh viên thường hoàn thành trong 24-48 giờ.', 'Thủ tục chung'],
      ['Tôi bị mất thẻ sinh viên thì cần làm thủ tục gì?', 'Bạn làm thủ tục "Xin cấp lại thẻ sinh viên", chuẩn bị 01 ảnh chân dung 3x4 và nộp lệ phí 50.000đ tại Bộ phận Một cửa. Thời gian nhận thẻ mới là 3 ngày làm việc.', 'Sinh viên'],
      ['Cán bộ giảng viên xin nghỉ phép năm gửi cho ai phê duyệt?', 'Đơn xin nghỉ phép cần có ý kiến phê duyệt của Trưởng khoa/Trưởng đơn vị quản lý trực tiếp, sau đó gửi qua Cổng Một cửa để Phòng TCCB kiểm tra và trình Ban Giám hiệu ký quyết định.', 'CBGV'],
      ['Bộ phận Một cửa làm việc vào những khung giờ nào?', 'Bộ phận làm việc từ thứ Hai đến thứ Sáu hằng tuần. Sáng từ 07:30 đến 11:30, Chiều từ 13:30 đến 17:00.', 'Thủ tục chung']
    ];

    for (const f of faqs) {
      await client.query(`
        INSERT INTO faqs (question, answer, category)
        VALUES ($1, $2, $3)
      `, f);
    }

    // 6. SEED NEWS
    console.log('6. Seeding news...');
    const news = [
      ['Triển khai cổng dịch vụ hành chính trực tuyến phiên bản mới', 'Thông báo', 'Từ tháng 10/2026, Trường Đại học Thái Bình chính thức đưa vào vận hành hệ thống Một cửa điện tử thế hệ mới, tích hợp Trợ lý AI hỗ trợ giải đáp 24/7.', 'Sinh viên và cán bộ có thể nộp hồ sơ, theo dõi tiến độ và nhận kết quả mọi lúc.'],
      ['Hướng dẫn cập nhật thông tin tài khoản người dùng', 'Hướng dẫn', 'Để đảm bảo thông báo kết quả xử lý hồ sơ được gửi đúng hạn, đề nghị sinh viên và cán bộ cập nhật chính xác số điện thoại và email trường.', 'Một số lưu ý để bảo mật tài khoản và nhận thông báo xử lý hồ sơ kịp thời.'],
      ['Lịch tiếp nhận hồ sơ trực tiếp tại Bộ phận Một cửa', 'Thông báo', 'Bên cạnh cổng trực tuyến, Bộ phận Một cửa tại Tòa nhà Điều hành vẫn phục vụ trực tiếp sinh viên từ thứ 2 đến thứ 6.', 'Thời gian làm việc từ thứ Hai đến thứ Sáu, sáng 7h30-11h30 và chiều 13h30-17h.']
    ];

    for (const n of news) {
      await client.query(`
        INSERT INTO news (title, category, content, excerpt)
        VALUES ($1, $2, $3, $4)
      `, n);
    }

    // 7. SEED SYSTEM SETTINGS
    console.log('7. Seeding settings...');
    const settings = [
      ['school_name', 'Trường Đại học Thái Bình'],
      ['office_name', 'Bộ phận Tiếp nhận và Trả kết quả (Một cửa)'],
      ['address', 'Phố Lê Thánh Tông, Phường Trần Hưng Đạo, TP. Thái Bình'],
      ['phone', '(0227) 3831 499'],
      ['email', 'motcua@tbu.edu.vn'],
      ['working_hours', 'Thứ 2 - Thứ 6: 07:30 - 11:30 & 13:30 - 17:00'],
      ['ai_model', 'gemini-2.0-flash'],
      ['ai_temperature', '0.3'],
      ['ai_top_k', '5']
    ];

    for (const s of settings) {
      await client.query(`
        INSERT INTO system_settings (key, value)
        VALUES ($1, $2)
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
      `, s);
    }

    await client.query('COMMIT');
    console.log('--- SEED DU LIEU HOAN TAT THANH CONG! ---');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Loi khi seed du lieu:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
