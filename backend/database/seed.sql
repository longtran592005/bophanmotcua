-- Seed demo TBU One-Stop. Mật khẩu của 4 tài khoản: 123456
BEGIN;

INSERT INTO users (name,email,code,password_hash,role,phone,department)
VALUES
('Đặng Văn Long','admin@tbu.edu.vn','ADMIN-001','$2a$10$Qg96fOyp68T2F4SFFVee2.CuyoKjbNERRsX3A0AksGtARlC1C.Ay.','ADMIN','0988123456','Văn phòng'),
('Lê Thu Hà','thuha@tbu.edu.vn','CBGV-0145','$2a$10$Qg96fOyp68T2F4SFFVee2.CuyoKjbNERRsX3A0AksGtARlC1C.Ay.','STAFF','0977234567','Phòng Đào tạo'),
('Nguyễn Thị Hương','huongnt@tbu.edu.vn','CBGV-0048','$2a$10$Qg96fOyp68T2F4SFFVee2.CuyoKjbNERRsX3A0AksGtARlC1C.Ay.','STAFF','0966345678','Phòng Tổ chức Cán bộ'),
('Nguyễn Lan Anh','lananh@tbu.edu.vn','21D100123','$2a$10$Qg96fOyp68T2F4SFFVee2.CuyoKjbNERRsX3A0AksGtARlC1C.Ay.','STUDENT','0988654321','Khoa Kinh tế')
ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name, password_hash=EXCLUDED.password_hash, role=EXCLUDED.role;

INSERT INTO procedures (code,name,department,audience,processing_time,fee,description,details)
VALUES
('TT-ĐT-001','Cấp giấy xác nhận sinh viên','Phòng Đào tạo','Sinh viên','1-2 ngày',0,'Cấp giấy xác nhận đang học tập tại trường.','Sinh viên nộp đơn trực tuyến và nhận bản điện tử hoặc bản giấy.'),
('TT-ĐT-002','Xin cấp lại thẻ sinh viên','Phòng Đào tạo','Sinh viên','3 ngày',50000,'Cấp lại thẻ bị mất, hỏng hoặc cần cập nhật.','Đính kèm ảnh 3x4 và biên lai lệ phí.'),
('TT-TCCB-001','Đăng ký nghỉ phép năm','Phòng Tổ chức Cán bộ','CBGV','3 ngày',0,'Giải quyết chế độ nghỉ phép năm.','Đơn cần có ý kiến chấp thuận của trưởng đơn vị.'),
('TT-TCCB-002','Nâng lương trước thời hạn','Phòng Tổ chức Cán bộ','CBGV','15 ngày',0,'Đề nghị xét nâng lương trước thời hạn.','Hồ sơ được thẩm định theo quy định hiện hành.'),
('TT-KHTC-001','Thanh toán công tác phí','Phòng Kế hoạch - Tài chính','CBGV','5 ngày',0,'Thanh toán chi phí công tác hợp lệ.','Nộp quyết định cử đi công tác và chứng từ gốc.'),
('TT-KHCN-001','Đăng ký đề tài nghiên cứu khoa học','Phòng Khoa học Công nghệ','CBGV','10 ngày',0,'Đăng ký và xét duyệt đề tài nghiên cứu.','Hồ sơ gồm thuyết minh và dự toán kinh phí.')
ON CONFLICT (code) DO NOTHING;

INSERT INTO procedure_steps (procedure_id,step_order,name,description,department,duration)
SELECT p.id, s.step_order, s.name, s.description, s.department, s.duration
FROM procedures p
CROSS JOIN (VALUES
 (1,'Nộp hồ sơ trực tuyến','Người nộp điền biểu mẫu và tải tài liệu.','Người nộp','15 phút'),
 (2,'Tiếp nhận và kiểm tra','Cán bộ kiểm tra tính đầy đủ, hợp lệ.','Bộ phận Một cửa','4 giờ'),
 (3,'Thẩm định và phê duyệt','Đơn vị chuyên môn xử lý hồ sơ.','Phòng chuyên môn','1-10 ngày'),
 (4,'Trả kết quả','Thông báo và trả kết quả cho người nộp.','Bộ phận Một cửa','4 giờ')
) AS s(step_order,name,description,department,duration)
WHERE p.code IN ('TT-ĐT-001','TT-TCCB-001') AND NOT EXISTS
(SELECT 1 FROM procedure_steps x WHERE x.procedure_id=p.id);

INSERT INTO forms (code,name,category,department,version,file_type,file_size,file_url)
VALUES
('BM-01','Đơn xin nghỉ phép năm','Nghỉ phép','Phòng Tổ chức Cán bộ','v2.0','DOC','45 KB','/forms/don-xin-nghi-phep.doc'),
('BM-02','Giấy xác nhận sinh viên','Sinh viên','Phòng Đào tạo','v1.0','PDF','120 KB','/forms/xac-nhan-sinh-vien.pdf'),
('BM-03','Đơn cấp lại thẻ sinh viên','Sinh viên','Phòng Đào tạo','v1.0','DOC','38 KB','/forms/cap-lai-the.doc'),
('BM-04','Phiếu thanh toán công tác phí','Tài chính','Phòng Kế hoạch - Tài chính','v2.0','XLSX','82 KB','/forms/cong-tac-phi.xlsx'),
('BM-05','Thuyết minh đề tài nghiên cứu','Nghiên cứu','Phòng Khoa học Công nghệ','v1.0','DOC','210 KB','/forms/thuyet-minh-de-tai.doc'),
('BM-06','Đơn đề nghị nâng lương','Lương','Phòng Tổ chức Cán bộ','v1.0','DOC','42 KB','/forms/nang-luong.doc'),
('BM-07','Phiếu yêu cầu bổ sung hồ sơ','Thủ tục chung','Bộ phận Một cửa','v1.0','PDF','95 KB','/forms/bo-sung-ho-so.pdf'),
('BM-08','Phiếu tiếp nhận và hẹn trả','Thủ tục chung','Bộ phận Một cửa','v1.0','PDF','150 KB','/forms/phieu-hen.pdf')
ON CONFLICT (code) DO NOTHING;

INSERT INTO applications
  (code,applicant_id,procedure_id,department,status,priority,assigned_staff_id,submitted_at,expected_at)
SELECT a.code, u.id, p.id, p.department, a.status, a.priority, s.id,
       now() - a.age_days * interval '1 day', now() + a.due_days * interval '1 day'
FROM (VALUES
 ('HS-2026-000101','Tiếp nhận','green',0,3),
 ('HS-2026-000102','Đang xử lý','yellow',2,1),
 ('HS-2026-000103','Chờ bổ sung','red',4,0),
 ('HS-2026-000104','Hoàn thành','green',7,-2),
 ('HS-2026-000105','Trả kết quả','green',10,-5)
) AS a(code,status,priority,age_days,due_days)
JOIN users u ON u.email='lananh@tbu.edu.vn'
JOIN procedures p ON p.code='TT-ĐT-001'
LEFT JOIN users s ON s.email='thuha@tbu.edu.vn'
ON CONFLICT (code) DO NOTHING;

INSERT INTO application_timeline (application_id,status,staff_id,staff_name,note,created_at)
SELECT a.id, t.status, s.id, s.name, t.note, a.submitted_at + t.offset_hours * interval '1 hour'
FROM applications a
JOIN users s ON s.email='thuha@tbu.edu.vn'
CROSS JOIN (VALUES
 ('Tiếp nhận',0,'Hồ sơ đã được tiếp nhận và ghi nhận trên hệ thống.'),
 ('Đang xử lý',8,'Cán bộ chuyên môn đang kiểm tra và xử lý hồ sơ.'),
 ('Chờ bổ sung',24,'Vui lòng bổ sung bản scan giấy tờ còn thiếu.'),
 ('Hoàn thành',72,'Hồ sơ đã được phê duyệt, chờ trả kết quả.'),
 ('Trả kết quả',96,'Kết quả đã được trả cho người nộp.')
) AS t(status,offset_hours,note)
WHERE a.code IN ('HS-2026-000101','HS-2026-000102','HS-2026-000103','HS-2026-000104','HS-2026-000105')
  AND NOT EXISTS (SELECT 1 FROM application_timeline x WHERE x.application_id=a.id);

INSERT INTO faqs (question,answer,category,display_order)
VALUES
('Nộp hồ sơ trực tuyến như thế nào?','Đăng nhập, chọn thủ tục, điền biểu mẫu và tải tài liệu trước khi bấm Gửi hồ sơ.','Thủ tục chung',1),
('Thời gian xử lý hồ sơ là bao lâu?','Thời hạn được hiển thị tại trang chi tiết của từng thủ tục, không tính ngày nghỉ.','Thủ tục chung',2),
('Tôi có thể theo dõi hồ sơ ở đâu?','Vào mục Tra cứu và nhập mã hồ sơ dạng HS-2026-XXXXXX.','Kỹ thuật',3),
('Hồ sơ bị yêu cầu bổ sung phải làm gì?','Mở thông báo, xem ghi chú cán bộ và tải tài liệu bổ sung trong hồ sơ.','Thủ tục chung',4),
('Làm sao tải biểu mẫu?','Mở Kho biểu mẫu, tìm biểu mẫu cần dùng và bấm Tải về.','Biểu mẫu',5);

INSERT INTO news (title,category,content,excerpt,author_name,status,published_at)
VALUES
('Thông báo lịch nghỉ lễ năm 2026','Thông báo','Bộ phận Một cửa thông báo lịch làm việc và tiếp nhận hồ sơ trong dịp lễ.','Lịch nghỉ lễ và lịch trực hỗ trợ người dùng.','Bộ phận Một cửa','PUBLISHED',now()),
('Hướng dẫn nộp hồ sơ trực tuyến','Hướng dẫn','Các bước nộp hồ sơ trực tuyến trên Cổng dịch vụ hành chính Một cửa điện tử TBU.','Hướng dẫn nhanh cho sinh viên và CBGV.','Phòng Đào tạo','PUBLISHED',now()),
('Tiếp nhận đăng ký đề tài nghiên cứu khoa học','Tin tức','Nhà trường bắt đầu tiếp nhận đề xuất đề tài nghiên cứu khoa học năm học mới.','Thời gian và biểu mẫu đăng ký đề tài.','Phòng KHCN','PUBLISHED',now());

INSERT INTO system_settings (key,value) VALUES
('institution','{"name":"Trường Đại học Thái Bình","department":"Bộ phận Tiếp nhận và Trả kết quả (Một cửa)","address":"Phố Lê Thánh Tông, Phường Trần Hưng Đạo, TP. Thái Bình","hotline":"(0227) 3831 499","email":"motcua@tbu.edu.vn","working_hours":"Thứ 2 - Thứ 6: 7h30-11h30, 13h30-17h00"}'),
('ai','{"model":"gemini-2.0-flash","chunkSize":500,"topK":4,"temperature":0.2,"systemPrompt":"Bạn là Trợ lý AI của Bộ phận Một cửa - Trường Đại học Thái Bình. Trả lời bằng tiếng Việt thân thiện, chính xác."}')
ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value;

COMMIT;
