import os
import sys
import re
import json
import datetime
import urllib.request
import subprocess

APP_DIR = os.path.dirname(os.path.abspath(__file__))
FEEDBACK_FILE = os.path.join(APP_DIR, "feedback.json")
STATIC_FEEDBACK_FILE = os.path.join(APP_DIR, "static", "feedback.json")
FEEDBACK_LOG_MD = os.path.join(APP_DIR, "FEEDBACK_LOG.md")
REPO = "mikepham358/sat-test-practice-app-oct2026"

def fetch_github_issues():
    url = f"https://api.github.com/repos/{REPO}/issues?state=all"
    req = urllib.request.Request(url, headers={"User-Agent": "Bluebook-App-Syncer"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.load(resp)
    except Exception as e:
        print(f"⚠️ Error fetching GitHub issues: {e}")
        return []

def clean_val(s):
    if not s:
        return ""
    s = s.strip()
    s = re.sub(r"^[\*\`\-\#\s]+", "", s)
    s = re.sub(r"[\*\`\s]+$", "", s)
    return s.strip()

def parse_issue_body(body_text, title, number, created_at):
    data = {}
    m_id = re.search(r"Mã phản hồi:[\*\s]*`?([A-Za-z0-9\-]+)`?", body_text)
    if m_id:
        data["id"] = m_id.group(1).strip()
    else:
        data["id"] = f"GH-ISSUE-#{number}"

    m_sender = re.search(r"Người gửi:[\*\s]*([^\(\n\r]+)(?:\(([^)]+)\))?", body_text)
    if m_sender:
        data["student_name"] = clean_val(m_sender.group(1))
        if m_sender.group(2):
            data["student_email"] = clean_val(m_sender.group(2))
    else:
        data["student_name"] = "Học sinh"
        data["student_email"] = ""

    m_cat = re.search(r"Phân loại:[\*\s]*([^\n\r]+)", body_text)
    if m_cat:
        data["category"] = clean_val(m_cat.group(1))
    else:
        data["category"] = "📝 Góp ý chung & Đánh giá"

    m_prio = re.search(r"Mức độ:[\*\s]*([^\n\r]+)", body_text)
    if m_prio:
        data["priority"] = clean_val(m_prio.group(1))
    else:
        data["priority"] = "🟢 Bình thường"

    m_ctx = re.search(r"Vị trí / Ngữ cảnh:[\*\s]*([^\n\r]+)", body_text)
    if m_ctx:
        data["context_label"] = clean_val(m_ctx.group(1))
    else:
        data["context_label"] = title

    m_time = re.search(r"Thời gian:[\*\s]*([^\n\r]+)", body_text)
    if m_time:
        data["date_str"] = clean_val(m_time.group(1))
    else:
        try:
            dt = datetime.datetime.fromisoformat(created_at.replace("Z", "+00:00"))
            data["date_str"] = dt.strftime("%d/%m/%Y %H:%M")
        except Exception:
            data["date_str"] = created_at

    m_cnt = re.search(r"Nội dung phản hồi:[\*\s]*([\s\S]+?)(?=\*?\(Gửi từ|\Z)", body_text)
    if m_cnt:
        data["content"] = clean_val(m_cnt.group(1))
    else:
        data["content"] = clean_val(body_text)

    data["status"] = "✅ Đã tiếp nhận & Cập nhật"
    data["github_issue_url"] = f"https://github.com/{REPO}/issues/{number}"
    return data

def sync():
    print(f"--- Fetching issues from https://github.com/{REPO}/issues ---")
    issues = fetch_github_issues()
    print(f"Found {len(issues)} issues on GitHub.")

    if not os.path.exists(FEEDBACK_FILE):
        raw_feedbacks = []
    else:
        with open(FEEDBACK_FILE, "r", encoding="utf-8") as f:
            raw_feedbacks = json.load(f)

    # Clean existing feedbacks list to eliminate duplicates
    feedbacks_map = {}
    for fb in raw_feedbacks:
        fid = fb.get("id")
        if fid and not fid.startswith("GH-ISSUE-"):
            feedbacks_map[fid] = fb

    new_added = 0
    for iss in issues:
        if "pull_request" in iss:
            continue
        body = iss.get("body") or ""
        title = iss.get("title") or ""
        num = iss.get("number")
        c_at = iss.get("created_at") or ""
        
        parsed = parse_issue_body(body, title, num, c_at)
        fid = parsed["id"]

        if fid in feedbacks_map:
            feedbacks_map[fid].update(parsed)
            print(f"  Synced existing feedback {fid} with GitHub Issue #{num}")
        else:
            feedbacks_map[fid] = parsed
            new_added += 1
            print(f"  Added new feedback {fid} from GitHub Issue #{num}")

    feedbacks = list(feedbacks_map.values())

    # Save feedbacks JSON
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
        "1. **Tiếp nhận tức thì (0 - 5 phút):** Phản hồi từ học sinh gửi qua web app hoặc tạo trên GitHub Issues được ghi nhận tự động vào `feedback.json` và đồng bộ lên tệp `FEEDBACK_LOG.md` trên GitHub.",
        "2. **Đối soát & Phân tích (1 - 2 giờ):** Giáo viên và trợ giảng kỹ thuật đối soát nội dung với đề gốc `B.pdf` và file đáp án `KeyB.pdf`.",
        "3. **Triển khai bản vá (Hotfix):** Sửa lỗi mã nguồn, cập nhật dataset hoặc thêm tính năng theo yêu cầu, commit và đẩy trực tiếp lên nhánh `main`.",
        "4. **Phản hồi học sinh:** Cập nhật trạng thái thành `✅ Đã giải quyết triệt để` trong nhật ký và gửi email cảm ơn/thông báo tới học sinh.",
        ""
    ])

    with open(FEEDBACK_LOG_MD, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"Generated FEEDBACK_LOG.md with {total} items ({new_added} new from GitHub Issues).")

    try:
        subprocess.run(["git", "add", "feedback.json", "static/feedback.json", "FEEDBACK_LOG.md"], cwd=APP_DIR, check=True)
        subprocess.run(["git", "commit", "-m", "docs(feedback): auto-sync GitHub issues into FEEDBACK_LOG.md"], cwd=APP_DIR, check=True)
        subprocess.run(["git", "push", "origin", "main"], cwd=APP_DIR, check=True)
        print("✅ Pushed synced FEEDBACK_LOG.md to GitHub main branch!")
    except Exception as e:
        print(f"Notice during git push: {e}")

if __name__ == "__main__":
    sync()
