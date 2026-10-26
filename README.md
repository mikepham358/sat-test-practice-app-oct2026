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

## 🚀 Hướng Dẫn Cài Đặt & Triển Khai (Deployment Guide)

Bất kỳ giáo viên, học sinh hoặc lập trình viên nào cũng có thể tải về và triển khai ứng dụng này trên máy tính của mình chỉ trong 3 phút:

### 1. Yêu cầu hệ thống (Prerequisites)
- **Python**: Phiên bản `3.8` trở lên (Kiểm tra bằng lệnh: `python3 --version`).
- **Trình duyệt**: Google Chrome, Safari, Microsoft Edge, hoặc Mozilla Firefox hiện đại.
- *Hoàn toàn không cần cài đặt cơ sở dữ liệu (Database), không cần Docker hay môi trường Node.js/npm phức tạp.*

---

### 2. Tải mã nguồn về máy (Clone hoặc Tải ZIP)

Mở Terminal (trên macOS/Linux) hoặc Command Prompt / PowerShell (trên Windows) và chạy:

```bash
# Clone dự án từ GitHub
git clone https://github.com/mikepham358/sat-test-practice-app-oct2026.git

# Di chuyển vào thư mục dự án
cd sat-test-practice-app-oct2026
```

*(Hoặc bấm vào nút **Code** màu xanh ở đầu trang GitHub $\rightarrow$ chọn **Download ZIP**, sau đó giải nén ra thư mục trên máy tính).*

---

### 3. Cài đặt thư viện bổ trợ (Tùy chọn)

Nếu bạn muốn sử dụng tính năng xuất file Excel bài làm cá nhân hóa tự động cho học sinh:
```bash
pip install openpyxl
```

---

### 4. Khởi chạy ứng dụng

Tùy theo nhu cầu sử dụng và hệ điều hành, bạn có thể lựa chọn 1 trong 2 cách sau:

#### 💻 Cách 1: Chạy nội bộ trên máy cá nhân (Localhost)
*Phù hợp cho học sinh tự luyện tập hoặc giáo viên chiếu đề bài trên máy chiếu lớp học:*

- **Trên macOS / Linux:**
  ```bash
  ./start.sh
  ```
  *(Script sẽ tự động tìm cổng mạng khả dụng và mở trình duyệt tại `http://localhost:8085`).*

- **Trên Windows:**
  ```cmd
  python server.py 8085
  ```
  Sau đó mở trình duyệt và truy cập: `http://localhost:8085`

---

#### 🌐 Cách 2: Phát sóng Online miễn phí cho cả lớp vào thi (Cloudflare Tunnel)
*Phù hợp cho buổi kiểm tra trực tuyến hoặc giao bài tập về nhà cho 20–50+ học sinh cùng làm bài từ xa trên điện thoại, iPad, laptop:*

- **Trên macOS / Linux:**
  ```bash
  ./tunnel.sh
  ```
- **Cơ chế hoạt động:**
  1. Script tự động tải công cụ Cloudflare siêu nhẹ (nếu chưa có) và kết nối máy chủ nội bộ ra Internet.
  2. Màn hình Terminal sẽ hiển thị đường dẫn HTTPS công khai miễn phí:
     ```text
     https://xxxx-xxxx-xxxx.trycloudflare.com
     ```
  3. Thầy/Cô chỉ việc copy đường link này gửi vào Zalo / Google Classroom / Messenger cho học sinh.
  4. Học sinh nhấn vào link là vào làm bài ngay lập tức:
     - **Không cần tạo tài khoản hay đăng nhập.**
     - **Kết nối HTTPS bảo mật**, vượt qua mọi tường lửa mạng trường học và 4G/5G.
     - **Bộ nhớ độc lập 100% (`localStorage`):** Cả lớp làm cùng lúc trên 1 đường link mà hoàn toàn không bị trùng lặp hay ghi đè dữ liệu của nhau.

---

### 5. Cấu hình Email Giáo viên nhận bảng điểm (`email_config.json`)

Mở file `email_config.json` để thay đổi địa chỉ email của Thầy/Cô:
```json
{
  "teacher_email": "thay_co@gmail.com",
  "smtp_host": "smtp.gmail.com",
  "smtp_port": 465,
  "smtp_user": "thay_co@gmail.com",
  "smtp_pass": "xxxx xxxx xxxx xxxx"
}
```
> 💡 **Ghi chú về gửi mail tự động qua Gmail:**
> - `smtp_pass` là **Mật khẩu ứng dụng (App Password)** gồm 16 ký tự do Google cấp (xem hướng dẫn tạo tại [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)).
> - *Nếu chưa điền `smtp_pass`*: Ứng dụng vẫn hoạt động bình thường 100% thông qua tính năng tự động kích hoạt trình duyệt Mail (`mailto:`) trên thiết bị cá nhân của học sinh kèm tùy chọn tải trực tiếp file Excel về máy.

---

## 📁 Cấu Trúc Mã Nguồn

```text
sat-test-practice-app-oct2026/
├── .gitignore            # Loại trừ file nhị phân nặng, file rác và bài làm học sinh
├── LICENSE               # Giấy phép MIT License và Điều khoản giáo dục
├── start.sh              # Script 1-click chạy máy chủ cục bộ (macOS/Linux)
├── tunnel.sh             # Script 1-click phát sóng qua Cloudflare Tunnel
├── server.py             # Máy chủ Python HTTP (Hỗ trợ PDF streaming HTTP 206 & Export Excel)
├── extract_data.py       # Script trích xuất và map câu hỏi từ PDF và Excel v5
├── database.json         # Cơ sở dữ liệu 98 câu hỏi với 4 tầng phản hồi Socratic
├── email_config.json     # Cấu hình email giáo viên nhận kết quả
├── bin/
│   └── cloudflared       # File thực thi Cloudflare Tunnel độc lập (tự tải)
├── static/
│   ├── index.html        # Giao diện thi Digital SAT Bluebook & Google UX Landing Page
│   ├── styles.css        # Phong cách Luxury Minimalist + Obsidian Dark Header
│   ├── app.js            # Trình quản lý trạng thái 4 tầng phản hồi + localStorage
│   └── poster.png        # Poster đề thi chất lượng cao
└── README.md             # Hướng dẫn chi tiết
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


