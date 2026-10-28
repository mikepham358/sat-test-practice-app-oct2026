import json
import datetime
import os

APP_DIR = os.path.dirname(os.path.abspath(__file__))
FEEDBACK_FILE = os.path.join(APP_DIR, "feedback.json")
STATIC_FEEDBACK_FILE = os.path.join(APP_DIR, "static", "feedback.json")
FEEDBACK_LOG_MD = os.path.join(APP_DIR, "FEEDBACK_LOG.md")

with open(FEEDBACK_FILE, "r", encoding="utf-8") as f:
    feedbacks = json.load(f)

# Ensure FB-20261028-393 is properly formatted
found = False
for fb in feedbacks:
    if fb.get("id") == "FB-20261028-393":
        found = True
        fb["student_name"] = "Mai"
        fb["student_email"] = "pbhs92@gmail.com"
        fb["category"] = "📝 Góp ý chung & Đánh giá"
        fb["priority"] = "🟢 Bình thường"
        fb["context_label"] = "Math: Module 1 • Câu 17 (Mã #71) • Trang 33"
        fb["content"] = "Thanks teacher."
        fb["status"] = "✅ Đã tiếp nhận & Cập nhật"
        break

if not found:
    feedbacks.append({
        "id": "FB-20261028-393",
        "timestamp": "2026-10-28T10:01:16",
        "date_str": "28/10/2026 10:01",
        "student_name": "Mai",
        "student_email": "pbhs92@gmail.com",
        "category": "📝 Góp ý chung & Đánh giá",
        "priority": "🟢 Bình thường",
        "context_label": "Math: Module 1 • Câu 17 (Mã #71) • Trang 33",
        "content": "Thanks teacher.",
        "status": "✅ Đã tiếp nhận & Cập nhật"
    })

# Save JSON
with open(FEEDBACK_FILE, "w", encoding="utf-8") as f:
    json.dump(feedbacks, f, ensure_ascii=False, indent=2)

with open(STATIC_FEEDBACK_FILE, "w", encoding="utf-8") as f:
    json.dump(feedbacks, f, ensure_ascii=False, indent=2)

total = len(feedbacks)
cats = {}
for x in feedbacks:
    c = x.get("category", "Khác")
    cats[c] = cats.get(c, 0) + 1
cats_str = " • ".join([f"**{k}:** {v}" for k, v in cats.items()])
resolved = sum(1 for x in feedbacks if "đã" in x.get("status", "").lower() or "triệt tiêu" in x.get("status", "").lower() or "tiếp nhận" in x.get("status", "").lower())
resolved_pct = round((resolved / total) * 100, 1) if total > 0 else 0

lines = [
    "# 📋 Nhật Ký Phản Hồi & Đóng Góp Ý Kiến (Feedback Logbook)",
    "",
    "> **Dự án:** Digital SAT Bluebook Practice App • Vinschool SAT Team  ",
    "> **Giáo viên phụ trách:** Mike Pham Bá Hong Son (Google for Education Innovator) — [mikepham358@gmail.com](mailto:mikepham358@gmail.com)  ",
    "> **Trạng thái đồng bộ:** 🟢 Tự động cập nhật trực tiếp qua GitHub Repository & App Engine  ",
    f"> **Cập nhật lần cuối:** {datetime.datetime.now().strftime('%d/%m/%Y %H:%M:%S')}",
    "",
    "---",
    "",
    "## 📊 Bảng Thống Kê Tổng Quan Phản Hồi (Summary Metrics)",
    "",
    "| Chỉ Số Đánh Giá | Giá Trị Hiện Tại | Ghi Chú |",
    "| :--- | :---: | :--- |",
    f"| **Tổng số phản hồi nhận được** | **{total}** | Gồm đóng góp câu hỏi, kỹ thuật & tính năng |",
    f"| **Số phản hồi đã giải quyết triệt để** | **{resolved}** | Đã sửa code, dataset hoặc triển khai |",
    f"| **Tỷ lệ xử lý thành công** | **{resolved_pct}%** | Cam kết hỗ trợ học sinh tối đa |",
    f"| **Phân loại phản hồi** | {cats_str} | Tự động phân nhóm |",
    "",
    "---",
    "",
    "## 📝 Danh Sách Nhật Ký Phản Hồi Chi Tiết (Detailed Feedback Log)",
    "",
    "| STT | Mã FB | Thời Gian | Học Sinh / Người Gửi | Phân Loại | Mức Độ | Vị Trí / Ngữ Cảnh | Nội Dung Phản Hồi Chi Tiết | Trạng Thái Xử Lý |",
    "| :---: | :---: | :---: | :--- | :--- | :---: | :--- | :--- | :---: |"
]

for idx, item in enumerate(feedbacks, start=1):
    fid = item.get("id", f"FB-{idx}")
    d = item.get("date_str", "")
    sender = item.get("student_name", "Học sinh")
    mail = item.get("student_email", "")
    sender_str = f"**{sender}**" + (f"<br><code>{mail}</code>" if mail else "")
    cat = item.get("category", "Góp ý")
    prio = item.get("priority", "Bình thường")
    ctx = item.get("context_label", "Hệ thống")
    cnt = item.get("content", "").replace("\n", "<br>")
    stt = item.get("status", "⏳ Đang xử lý")
    lines.append(f"| {idx} | `{fid}` | {d} | {sender_str} | {cat} | {prio} | {ctx} | {cnt} | {stt} |")

lines.extend([
    "",
    "---",
    "",
    "## 💡 Quy Trình Tiếp Nhận & Giải Quyết Phản Hồi (SLA Protocol)",
    "",
    "1. **Tiếp nhận tức thì (0 - 5 phút):** Phản hồi từ học sinh gửi qua web app được ghi nhận tự động vào `feedback.json` và đồng bộ lên tệp `FEEDBACK_LOG.md` trên GitHub.",
    "2. **Đối soát & Phân tích (1 - 2 giờ):** Giáo viên và trợ giảng kỹ thuật đối soát nội dung với đề gốc `B.pdf` và file đáp án `KeyB.pdf`.",
    "3. **Triển khai bản vá (Hotfix):** Sửa lỗi mã nguồn, cập nhật dataset hoặc thêm tính năng theo yêu cầu, commit và đẩy trực tiếp lên nhánh `main`.",
    "4. **Phản hồi học sinh:** Cập nhật trạng thái thành `✅ Đã giải quyết triệt để` trong nhật ký và gửi email cảm ơn/thông báo tới học sinh.",
    ""
])

with open(FEEDBACK_LOG_MD, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"Successfully generated FEEDBACK_LOG.md with {total} items.")
