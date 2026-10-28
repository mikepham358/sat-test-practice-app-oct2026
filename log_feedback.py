#!/usr/bin/env python3
import os
import sys
import re
import json
import datetime
import subprocess

APP_DIR = os.path.dirname(os.path.abspath(__file__))
FEEDBACK_FILE = os.path.join(APP_DIR, "feedback.json")
STATIC_FEEDBACK_FILE = os.path.join(APP_DIR, "static", "feedback.json")
FEEDBACK_LOG_MD = os.path.join(APP_DIR, "FEEDBACK_LOG.md")

def parse_feedback_text(text):
    data = {}
    m_id = re.search(r"Mã phản hồi:\s*([A-Za-z0-9\-]+)", text)
    if m_id: data["id"] = m_id.group(1).strip()
    
    m_sender = re.search(r"Người gửi:\s*([^\(\n\r]+)(?:\(([^)]+)\))?", text)
    if m_sender:
        data["student_name"] = m_sender.group(1).strip()
        if m_sender.group(2):
            data["student_email"] = m_sender.group(2).strip()

    m_cat = re.search(r"Phân loại:\s*([^\n\r]+)", text)
    if m_cat: data["category"] = m_cat.group(1).strip()

    m_prio = re.search(r"Mức độ:\s*([^\n\r]+)", text)
    if m_prio: data["priority"] = m_prio.group(1).strip()

    m_ctx = re.search(r"Vị trí / Ngữ cảnh:\s*([^\n\r]+)", text)
    if m_ctx: data["context_label"] = m_ctx.group(1).strip()

    m_time = re.search(r"Thời gian:\s*([^\n\r]+)", text)
    if m_time:
        data["date_str"] = m_time.group(1).strip()

    m_cnt = re.search(r"Nội dung phản hồi:\s*([\s\S]+?)(?=\(Gửi từ|\Z)", text)
    if m_cnt:
        data["content"] = m_cnt.group(1).strip()

    return data

def update_all(new_item):
    if not os.path.exists(FEEDBACK_FILE):
        feedbacks = []
    else:
        with open(FEEDBACK_FILE, "r", encoding="utf-8") as f:
            feedbacks = json.load(f)

    # Check existing by id
    fid = new_item.get("id")
    found = False
    for fb in feedbacks:
        if fb.get("id") == fid:
            fb.update(new_item)
            found = True
            break
    if not found:
        feedbacks.append(new_item)

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
        item_id = item.get("id", f"FB-{idx}")
        d = item.get("date_str", "")
        sender = item.get("student_name", "Học sinh")
        mail = item.get("student_email", "")
        sender_str = f"**{sender}**" + (f"<br><code>{mail}</code>" if mail else "")
        cat = item.get("category", "Góp ý")
        prio = item.get("priority", "Bình thường")
        ctx = item.get("context_label", "Hệ thống")
        cnt = item.get("content", "").replace("\n", "<br>")
        stt = item.get("status", "⏳ Đang xử lý")
        lines.append(f"| {idx} | `{item_id}` | {d} | {sender_str} | {cat} | {prio} | {ctx} | {cnt} | {stt} |")

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

    # Commit and push
    try:
        sender_label = new_item.get("student_name", "Student")
        msg = f"docs(feedback): log feedback {fid} from {sender_label}"
        subprocess.run(["git", "add", "feedback.json", "static/feedback.json", "FEEDBACK_LOG.md"], cwd=APP_DIR, check=True)
        subprocess.run(["git", "commit", "-m", msg], cwd=APP_DIR, check=True)
        subprocess.run(["git", "push", "origin", "main"], cwd=APP_DIR, check=True)
        print(f"🎉 Successfully logged {fid} and pushed to GitHub main branch!")
    except Exception as e:
        print(f"⚠️ Git push notice: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--paste":
        print("Dán nội dung phản hồi từ email/app (kết thúc bằng Ctrl+D hoặc dòng trống):")
        text = sys.stdin.read()
        parsed = parse_feedback_text(text)
        if not parsed.get("id"):
            now = datetime.datetime.now()
            parsed["id"] = f"FB-{now.strftime('%Y%m%d')}-099"
        if not parsed.get("status"):
            parsed["status"] = "✅ Đã tiếp nhận & Cập nhật"
        print("Parsed data:", parsed)
        update_all(parsed)
    else:
        print("Cách dùng:")
        print("  1. Dán nội dung text email: python3 log_feedback.py --paste")
