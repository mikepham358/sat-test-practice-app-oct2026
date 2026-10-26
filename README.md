# 📘 Digital SAT Bluebook Practice App — October 2026 (INT-B)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Author](https://img.shields.io/badge/Author-Mike%20Pham%20Bá%20Hong%20Son%20(Google%20for%20Education%20Innovator)-4285F4.svg)](#)
[![Digital SAT](https://img.shields.io/badge/Exam-Digital%20SAT%202026-orange.svg)](https://hocsat.com/)
[![College Board Bluebook](https://img.shields.io/badge/UI-College%20Board%20Bluebook-0056b3.svg)](https://bluebook.collegeboard.org/)

> **Tác giả:** Mike Pham Bá Hong Son - Google for Education Innovator  
> Ứng dụng luyện thi **Digital SAT** theo giao diện chuẩn **College Board Bluebook**, kết nối trực tiếp file đề PDF gốc và bộ câu hỏi 98 câu (Reading & Writing + Math), hỗ trợ chia sẻ cho cả lớp học làm bài độc lập qua Cloudflare Tunnel.  
> 
> 📚 **Nguồn tài liệu tham khảo & câu hỏi:** Dữ liệu đề thi và câu hỏi được tổng hợp và tham khảo từ [hocsat.com](https://hocsat.com/).

---

## 🌟 Tính Năng Nổi Bật

### 1. Giao diện chuẩn College Board Bluebook
- **Thanh điều hướng trên (Top Bar):**
  - Chuyển đổi Module: `Reading & Writing Module 1 (27q)`, `Reading & Writing Module 2 (27q)`, `Math Module 1 (22q)`, `Math Module 2 (22q)` hoặc `Tất cả 98 câu`.
  - **Đồng hồ đếm ngược (Countdown Timer):** 32 phút cho mỗi Module RW, 35 phút cho mỗi Module Math. Có nút **Hide/Show** như kỳ thi thật.
  - **Bộ công cụ thi chuẩn:**
    - 📊 **Desmos Graphing Calculator:** Máy tính đồ họa chính thức tích hợp sẵn dạng cửa sổ nổi có thể kéo/thả.
    - 📐 **SAT Math Reference Sheet:** Bảng công thức hình học chuẩn của College Board (hình hộp chữ nhật, hình trụ, nón, cầu, tam giác đặc biệt $30^\circ-60^\circ-90^\circ$, $45^\circ-45^\circ-90^\circ$, radian).
    - 📝 **Scratchpad (Bảng nháp vẽ tay):** Vẽ tự do, chọn màu, chỉnh nét bút, tẩy xoá.
    - 📕 **Sổ tay lỗi sai & Chiến lược làm bài:** Xem lại các câu sai theo phương pháp phân tích 4 cấp độ.
    - 📥 **Xuất Excel Cá Nhân:** Tải về file `.xlsx` ghi nhận toàn bộ kết quả của riêng học sinh.

### 2. Giao diện làm bài chia đôi (Split View)
- **Bên trái:** Trình đọc file PDF đề gốc (`B.pdf`) với tính năng tự động nhảy trang đúng câu hỏi (`Sync Page`).
- **Bên phải:** Thẻ câu hỏi Digital SAT:
  - Nút **Mark for Review** (`🔖`) đánh dấu câu cần xem lại.
  - Nút **Eliminator Mode** (`[ABC]` gạch bỏ đáp án loại trừ).
  - Hỗ trợ câu trắc nghiệm (MCQ) và câu điền số **Student-Produced Response (Grid-in)** cho phần Math (hỗ trợ cả phân số `a/b` và số thập phân).
  - Hệ thống chấm điểm 3 cấp độ (Lần 1: 100%, Lần 2: 66.7%, Lần 3: 33.3%) kèm gợi ý socratic theo từng lần thử.

### 3. Trang mở đầu (Onboarding & Hướng dẫn thi)
- **Bước 1: Điền thông tin học sinh:** Bắt buộc nhập Họ & tên và Email (kèm mục tiêu điểm số). Dữ liệu này được lưu trong `localStorage` của học sinh.
- **Bước 2: Hướng dẫn thi chuẩn Bluebook:** Hiển thị tóm tắt quy tắc từng Module, cách tra số trang đề PDF Google Drive, dùng máy tính Desmos, và cách nộp bài.

### 4. Nút "🏁 Hoàn thành bài thi" & Gửi báo cáo Email
- Nút bấm nổi bật ở thanh công cụ trên cùng.
- **Bảng tổng kết:** Thống kê chi tiết số câu đã làm (trên tổng 98 câu), số câu đúng Lần 1 (100%), Lần 2 (66.7%), Lần 3 (33.3%), tỷ lệ hiệu suất điểm và cảnh báo câu chưa làm.
- **Tự động gửi báo cáo & File Excel:**
  - File Excel bài làm chi tiết được lưu tự động vào thư mục `submissions/` trên máy của Thầy Mike Pham Bá Hong Son.
  - Gửi email kèm file Excel báo cáo đồng thời về:
    1. 👨‍🏫 **Thầy Mike Pham Bá Hong Son (Google for Education Innovator):** `mikepham358@gmail.com` (mặc định)
    2. 🎓 **Học sinh:** Địa chỉ email học sinh đã nhập ban đầu.
- **Cấu hình gửi email tự động (`email_config.json`):**
  Để máy chủ tự động gửi mail qua Gmail, Thầy chỉ cần mở file `email_config.json` và điền Mật khẩu ứng dụng Gmail (16 ký tự) vào trường `smtp_pass`:
  ```json
  {
    "teacher_email": "mikepham358@gmail.com",
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 465,
    "smtp_user": "mikepham358@gmail.com",
    "smtp_pass": "xxxx xxxx xxxx xxxx"
  }
  ```
  *(Nếu chưa điền mật khẩu, bài làm vẫn được lưu 100% nguyên vẹn vào thư mục `submissions/` trên máy tính của Thầy và học sinh có nút tải trực tiếp file về máy).*

---

## 👥 Cơ Chế Cách Ly 100% Học Sinh (`localStorage`)

Khi nhiều học sinh cùng vào làm bài qua mạng:
- **Toàn bộ tiến độ được lưu trên trình duyệt của từng học sinh (`localStorage`):**
  - Câu trả lời, số lần thử, điểm số.
  - Trạng thái đồng hồ đếm ngược.
  - Các đáp án bị gạch trừ (`Eliminator`).
  - Cờ đánh dấu (`Mark for Review`).
  - Bản vẽ nháp (`Scratchpad`).
- **Không bao giờ bị trùng lặp dữ liệu:** Học sinh A hoàn toàn không nhìn thấy và không thể ghi đè lên bài của học sinh B.
- **Xuất bảng điểm riêng biệt:** Khi học sinh bấm **"Xuất Bảng Điểm Excel Cá Nhân"**, trình duyệt chỉ gửi dữ liệu bài làm của riêng em đó lên máy chủ để tạo file Excel tải về máy cá nhân của em.

---

## 🚀 Hướng Dẫn Sử Dụng

### Cách 1: Chạy cục bộ trên máy của Thầy (Localhost)
Dành cho Thầy tự luyện tập hoặc dùng trên lớp chiếu máy chiếu:
```bash
cd "/Users/mike/Library/CloudStorage/GoogleDrive-mikepham358@gmail.com/My Drive/A Vinschool by Mike Pham/SAT Coach/BluebookOct2026App"
./start.sh
```
Trình duyệt sẽ tự động mở tại địa chỉ: `http://localhost:8085`.

---

### Cách 2: Phát sóng cho học sinh cả lớp làm bài (Cloudflare Tunnel - Miễn phí)
Dành cho buổi học có 20–50 học sinh dùng laptop, iPad, hoặc điện thoại:
```bash
cd "/Users/mike/Library/CloudStorage/GoogleDrive-mikepham358@gmail.com/My Drive/A Vinschool by Mike Pham/SAT Coach/BluebookOct2026App"
./tunnel.sh
```
1. Script sẽ khởi động ứng dụng và kết nối đến Cloudflare.
2. Trên màn hình Terminal sẽ xuất hiện đường link công khai:
   ```text
   https://xxxx-xxxx-xxxx.trycloudflare.com
   ```
3. Thầy chỉ cần copy đường link này gửi lên nhóm Zalo / Google Classroom.
4. Học sinh bấm vào link là bắt đầu làm bài ngay lập tức:
   - Không cần tạo tài khoản hay đăng nhập.
   - Kết nối HTTPS an toàn, vượt qua mọi tường lửa và mạng 4G/Wifi.
   - Mỗi em có một bảng điểm và lịch sử làm bài hoàn toàn độc lập.

---

## 📁 Cấu Trúc Mã Nguồn

```text
BluebookOct2026App/
├── .gitignore            # Loại trừ file nhị phân nặng, file rác và bài làm học sinh
├── start.sh              # Script 1-click chạy máy chủ cục bộ
├── tunnel.sh             # Script 1-click phát sóng qua Cloudflare Tunnel
├── server.py             # Máy chủ Python HTTP (Hỗ trợ PDF streaming HTTP 206 & Export Excel)
├── extract_data.py       # Script trích xuất và map câu hỏi từ PDF và Excel v5
├── database.json         # Cơ sở dữ liệu 98 câu hỏi với 4 tầng phản hồi Socratic
├── bin/
│   └── cloudflared       # File thực thi Cloudflare Tunnel độc lập (tự tải)
├── static/
│   ├── index.html        # Giao diện thi Digital SAT Bluebook & Google UX Landing Page
│   ├── styles.css        # Phong cách Luxury Minimalist + Obsidian Dark Header
│   └── app.js            # Trình quản lý trạng thái 4 tầng phản hồi + localStorage
└── README.md             # Hướng dẫn chi tiết
```

---

## 🐙 Hướng Dẫn Đẩy Dự Án Lên GitHub

Thầy có thể lưu trữ dự án lên GitHub chỉ với các bước đơn giản sau:

### 1. Tạo kho lưu trữ (Repository) trên GitHub
- Vào [github.com/new](https://github.com/new).
- Đặt tên Repository (Ví dụ: `sat-bluebook-oct2026`).
- Chọn **Public** hoặc **Private** tùy ý.
- **Không** tích chọn bất kỳ ô nào (README, .gitignore).
- Bấm **Create repository**.

### 2. Chạy lệnh đẩy mã nguồn từ máy Mac
Mở Terminal và gõ:

```bash
cd "/Users/mike/Library/CloudStorage/GoogleDrive-mikepham358@gmail.com/My Drive/A Vinschool by Mike Pham/SAT Coach/BluebookOct2026App"

# Khởi tạo Git
git init

# Thêm tất cả tệp (.gitignore đã tự động loại bỏ file nặng và bài nộp riêng tư)
git add .

# Tạo commit đầu tiên
git commit -m "feat: initial release of Digital SAT Bluebook Oct 2026 App"

# Chuyển nhánh chính thành main
git branch -M main

# Liên kết với kho GitHub của Thầy (thay username và repo của Thầy vào)
git remote add origin https://github.com/<YOUR_USERNAME>/sat-bluebook-oct2026.git

# Đẩy lên GitHub
git push -u origin main
```

---

## 📚 Nguồn Tài Liệu & Lời Cảm Ơn (Credits & Attribution)

- **Nguồn tài liệu:** Toàn bộ dữ liệu đề thi, câu hỏi và tài liệu tham khảo trong ứng dụng này được tổng hợp và tham khảo từ hệ thống **[Học SAT](https://hocsat.com/)** (`https://hocsat.com/`).
- **Lời cảm ơn:** Trân trọng cảm ơn đội ngũ phát triển **Học SAT** đã xây dựng và chia sẻ nguồn tài liệu Digital SAT chất lượng cho cộng đồng giáo viên và học sinh.
- **Mục đích sử dụng:** Ứng dụng được thiết kế nhằm mục đích phi thương mại, phục vụ nghiên cứu, giảng dạy, ôn luyện thi nội bộ và nâng cao trải nghiệm làm bài tương tác chuẩn Bluebook cho học sinh.

---

## ⚖️ Giấy Phép & Bản Quyền (License & Disclaimer)

- **Mã nguồn (Source Code):** Phát hành theo giấy phép **[MIT License](LICENSE)**. Bạn được toàn quyền sử dụng, sửa đổi, phân phối và tích hợp vào các dự án cá nhân hoặc giảng dạy.
- **Tài liệu câu hỏi & Thương hiệu:**
  - Nội dung câu hỏi và đề thi thuộc bản quyền của các tác giả/đơn vị liên quan (tham khảo từ [hocsat.com](https://hocsat.com/)).
  - SAT® là nhãn hiệu đã đăng ký của College Board, tổ chức này không liên kết và không tài trợ cho dự án mã nguồn mở này.


