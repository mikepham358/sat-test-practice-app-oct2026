import os
import sys
import json
import re
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
import datetime
import shutil
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

APP_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(APP_DIR, "static")
DATABASE_FILE = os.path.join(APP_DIR, "database.json")
CONFIG_FILE = os.path.join(APP_DIR, "email_config.json")
SUBMISSIONS_DIR = os.path.join(APP_DIR, "submissions")
os.makedirs(SUBMISSIONS_DIR, exist_ok=True)

# Ensure database exists
if not os.path.exists(DATABASE_FILE):
    print("Database file not found, running extract_data.py...")
    import extract_data
    extract_data.extract_all()

with open(DATABASE_FILE, "r", encoding="utf-8") as f:
    DB = json.load(f)

def load_email_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "teacher_email": "mikepham358@gmail.com",
        "smtp_host": "smtp.gmail.com",
        "smtp_port": 465,
        "smtp_user": "mikepham358@gmail.com",
        "smtp_pass": ""
    }

def generate_student_excel(payload):
    import openpyxl
    local_template = os.path.join(APP_DIR, "template.xlsx")
    excel_path = local_template if os.path.exists(local_template) else DB.get("excel_path", "")
    if not os.path.exists(excel_path):
        excel_path = "/Users/mike/Library/CloudStorage/GoogleDrive-mikepham358@gmail.com/My Drive/A Vinschool by Mike Pham/26-27 Grand Plan /Study Plan/Module /Template - October 2026.xlsx"

    wb = openpyxl.load_workbook(excel_path, data_only=False)

    student_name = payload.get("student_name", "Student").strip() or "Hoc_Sinh"
    user_attempts = payload.get("attempts", {})  # { "1": { attempts: ["B"], status: "..." } }
    error_logs = payload.get("error_logs", [])

    # Personalize Performance_Summary header
    if "Performance_Summary" in wb.sheetnames:
        ws_perf = wb["Performance_Summary"]
        ws_perf.cell(1, 1, f"BẢNG TỔNG HỢP KẾT QUẢ: {student_name.upper()} (OCTOBER 2026 TEST)")
        ws_perf.cell(3, 1, f"Học sinh: {student_name} | Thời gian làm bài: {datetime.datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")

    # Build question lookup by ID
    q_map = {q["id"]: q for q in DB["questions"]}

    # Clear existing attempt inputs first to ensure clean state
    for mod in ["RW_Module1", "RW_Module2", "Math_Module1", "Math_Module2"]:
        if mod in wb.sheetnames:
            ws = wb[mod]
            for r in range(5, ws.max_row + 1):
                ws.cell(r, 6, None)
                ws.cell(r, 8, None)
                ws.cell(r, 10, None)

    if "Master_All_98_Questions" in wb.sheetnames:
        ws_m = wb["Master_All_98_Questions"]
        for r in range(5, ws_m.max_row + 1):
            ws_m.cell(r, 7, None)
            ws_m.cell(r, 9, None)
            ws_m.cell(r, 11, None)

    # Populate student attempts
    for qid_str, q_state in user_attempts.items():
        try:
            qid = int(qid_str)
        except ValueError:
            continue
        q_info = q_map.get(qid)
        if not q_info:
            continue

        attempts = q_state.get("attempts", [])
        if isinstance(attempts, (int, float, str)):
            attempts = [str(attempts)]
        elif not isinstance(attempts, list):
            attempts = []

        # 1. Populate Module Sheet
        mod_code = q_info["module_code"]
        if mod_code in wb.sheetnames:
            ws = wb[mod_code]
            q_label = str(q_info["q_label"]).strip()
            for r in range(5, ws.max_row + 1):
                val = str(ws.cell(r, 1).value or "").strip()
                if val == q_label:
                    if len(attempts) >= 1 and attempts[0]:
                        ws.cell(r, 6, str(attempts[0]).strip().upper())
                    if len(attempts) >= 2 and attempts[1]:
                        ws.cell(r, 8, str(attempts[1]).strip().upper())
                    if len(attempts) >= 3 and attempts[2]:
                        ws.cell(r, 10, str(attempts[2]).strip().upper())
                    break

        # 2. Populate Master_All_98_Questions Sheet
        if "Master_All_98_Questions" in wb.sheetnames:
            ws_m = wb["Master_All_98_Questions"]
            master_id = f"M{qid}"
            for r in range(5, ws_m.max_row + 1):
                val = str(ws_m.cell(r, 1).value or "").strip()
                if val == master_id or r == (qid + 4):
                    if len(attempts) >= 1 and attempts[0]:
                        ws_m.cell(r, 7, str(attempts[0]).strip().upper())
                    if len(attempts) >= 2 and attempts[1]:
                        ws_m.cell(r, 9, str(attempts[1]).strip().upper())
                    if len(attempts) >= 3 and attempts[2]:
                        ws_m.cell(r, 11, str(attempts[2]).strip().upper())
                    break

    # 3. Populate SAT_Error_Log_Tracker Sheet
    if "SAT_Error_Log_Tracker" in wb.sheetnames:
        ws_err = wb["SAT_Error_Log_Tracker"]
        if error_logs:
            # Clear old rows 16 to 40
            for r in range(16, max(40, ws_err.max_row + 1)):
                for c in range(1, 11):
                    ws_err.cell(r, c, None)

            # Write student error logs
            for idx, e in enumerate(error_logs):
                r = 16 + idx
                ws_err.cell(r, 1, e.get("date", datetime.datetime.now().strftime("%Y-%m-%d")))
                ws_err.cell(r, 2, e.get("module", ""))
                ws_err.cell(r, 3, f"{e.get('q_label', '')}: {e.get('skill', '')}")
                ws_err.cell(r, 4, e.get("root_cause", "Bẫy SAT"))
                ws_err.cell(r, 5, e.get("trap_detail", ""))
                ws_err.cell(r, 6, e.get("socratic_analysis", ""))
                ws_err.cell(r, 7, e.get("student_notes", ""))
                ws_err.cell(r, 8, e.get("vocabulary", ""))
                ws_err.cell(r, 9, e.get("status", "Đang theo dõi"))
                ws_err.cell(r, 10, e.get("takeaway", ""))

            # Update summary counts in row 3
            total_e = len(error_logs)
            pending_e = sum(1 for e in error_logs if e.get("status") == "Chưa xử lý")
            tracking_e = sum(1 for e in error_logs if e.get("status") == "Đang theo dõi")
            resolved_e = sum(1 for e in error_logs if e.get("status") == "Đã triệt tiêu")
            rate_e = f"{round((resolved_e / total_e) * 100)}%" if total_e > 0 else "0.0%"

            ws_err.cell(3, 5, total_e)
            ws_err.cell(3, 6, pending_e)
            ws_err.cell(3, 7, tracking_e)
            ws_err.cell(3, 8, resolved_e)
            ws_err.cell(3, 9, rate_e)

    safe_name = re.sub(r'[^a-zA-Z0-9_\-]', '_', student_name) or "Student"
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    export_filename = f"October_2026_SAT_{safe_name}_{timestamp}.xlsx"

    import io
    buf = io.BytesIO()
    wb.save(buf)
    content = buf.getvalue()
    return content, export_filename, safe_name

def send_submission_email(student_name, student_email, summary, excel_bytes, excel_filename):
    config = load_email_config()
    teacher_email = config.get("teacher_email", "mikepham358@gmail.com")
    smtp_pass = config.get("smtp_pass", "").strip()
    smtp_host = config.get("smtp_host", "smtp.gmail.com")
    smtp_port = int(config.get("smtp_port", 465))
    smtp_user = config.get("smtp_user", teacher_email).strip()

    recipients = [teacher_email]
    if student_email and student_email != teacher_email and "@" in student_email:
        recipients.append(student_email)

    if not smtp_pass:
        return False, "Chưa thiết lập mật khẩu ứng dụng Gmail (smtp_pass) trong email_config.json. File đã được lưu vào thư mục submissions/ trên máy của Thầy Mike Pham Bá Hong Son.", recipients

    msg = MIMEMultipart()
    msg['From'] = f"Digital SAT Bluebook <{smtp_user}>"
    msg['To'] = ", ".join(recipients)
    msg['Subject'] = f"📘 [Digital SAT Oct 2026] Báo cáo kết quả bài làm: {student_name}"

    answered = summary.get("answered", 0)
    total = summary.get("total", 98)
    l1 = summary.get("l1_correct", 0)
    l2 = summary.get("l2_correct", 0)
    l3 = summary.get("l3_correct", 0)
    score_pct = summary.get("score_pct", 0)
    time_spent = summary.get("time_spent", "N/A")

    html_content = f"""
    <html>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 650px; margin: 0 auto; padding: 20px;">
        <div style="background: #0f172a; color: #ffffff; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h2 style="margin: 0 0 6px 0; color: #38bdf8;">📘 BÁO CÁO KẾT QUẢ DIGITAL SAT (BLUEBOOK)</h2>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Đề thi: October 2026 Practice Test B</p>
        </div>
        <div style="border: 1px solid #e2e8f0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px; background: #ffffff;">
            <h3 style="margin-top: 0; color: #0284c7; border-bottom: 2px solid #e0f2fe; padding-bottom: 8px;">Thông Tin Học Sinh</h3>
            <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Họ và tên:</strong></td><td style="font-size: 16px; font-weight: bold; color: #0f172a;">{student_name}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748b;"><strong>Email học sinh:</strong></td><td>{student_email or "Chưa cung cấp"}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748b;"><strong>Thời gian nộp:</strong></td><td>{datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S")}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748b;"><strong>Thời gian làm bài:</strong></td><td>{time_spent}</td></tr>
            </table>

            <h3 style="color: #0284c7; border-bottom: 2px solid #e0f2fe; padding-bottom: 8px;">Tổng Kết Điểm & Lần Thử</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 12px; color: #64748b;">Số câu đã làm</div>
                    <div style="font-size: 20px; font-weight: bold; color: #0f172a;">{answered} / {total}</div>
                </div>
                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 12px; color: #166534;">Hiệu suất điểm</div>
                    <div style="font-size: 20px; font-weight: bold; color: #15803d;">{score_pct}%</div>
                </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
                <tr style="background: #f1f5f9; text-align: left;">
                    <th style="padding: 8px 12px; border: 1px solid #e2e8f0;">Cấp độ thử</th>
                    <th style="padding: 8px 12px; border: 1px solid #e2e8f0;">Số câu đúng</th>
                    <th style="padding: 8px 12px; border: 1px solid #e2e8f0;">Hiệu suất</th>
                </tr>
                <tr>
                    <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">✅ Lần 1 (Đúng ngay lần đầu)</td>
                    <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #16a34a;">{l1}</td>
                    <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">100%</td>
                </tr>
                <tr>
                    <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">⚡ Lần 2 (Sau gợi ý Tầng 1)</td>
                    <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #d97706;">{l2}</td>
                    <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">66.7%</td>
                </tr>
                <tr>
                    <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">💡 Lần 3 (Sau gợi ý Tầng 2)</td>
                    <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #2563eb;">{l3}</td>
                    <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">33.3%</td>
                </tr>
            </table>

            <p style="margin: 0; font-size: 13px; color: #64748b;">
                📎 <em>File Excel ghi nhận chi tiết kết quả từng câu hỏi đã được đính kèm cùng email này.</em>
            </p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #94a3b8; margin-top: 16px;">
            Hệ thống Luyện thi Digital SAT Bluebook — Lớp học Thầy Mike Pham Bá Hong Son (Google for Education Innovator)
        </div>
    </body>
    </html>
    """

    msg.attach(MIMEText(html_content, 'html', 'utf-8'))

    # Attach Excel
    part = MIMEApplication(excel_bytes, Name=excel_filename)
    part['Content-Disposition'] = f'attachment; filename="{excel_filename}"'
    msg.attach(part)

    try:
        if smtp_port == 465:
            with smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=15) as server:
                server.login(smtp_user, smtp_pass)
                server.sendmail(smtp_user, recipients, msg.as_string())
        else:
            with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as server:
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.sendmail(smtp_user, recipients, msg.as_string())
        return True, "Email đã được gửi thành công đến cả Thầy Mike Pham Bá Hong Son và Học sinh!", recipients
    except Exception as e:
        return False, f"Lỗi gửi email qua SMTP: {str(e)}", recipients

class BluebookAppHandler(BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, HEAD')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Range')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_HEAD(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        if path == "/pdf":
            pdf_path = DB["pdf_path"]
            if os.path.exists(pdf_path):
                file_size = os.path.getsize(pdf_path)
                self.send_response(200)
                self.send_header('Content-Type', 'application/pdf')
                self.send_header('Content-Length', str(file_size))
                self.send_header('Accept-Ranges', 'bytes')
                self.end_headers()
            else:
                self.send_error(404, "PDF not found")
            return

        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        if path == "/pdf":
            self.serve_pdf(DB["pdf_path"])
            return

        if path == "/api/data":
            try:
                with open(DATABASE_FILE, "r", encoding="utf-8") as f:
                    db_fresh = json.load(f)
                self.send_json(db_fresh)
            except Exception as e:
                self.send_json(DB)
            return

        if path.startswith("/api/download-submission"):
            parsed_qs = urllib.parse.parse_qs(parsed_url.query)
            filename = parsed_qs.get("file", [""])[0]
            clean_name = os.path.basename(filename)
            file_path = os.path.join(SUBMISSIONS_DIR, clean_name)
            if os.path.exists(file_path):
                with open(file_path, "rb") as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                self.send_header("Content-Disposition", f'attachment; filename="{clean_name}"')
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                return
            else:
                self.send_error(404, "File not found")
                return

        # Static files
        self.serve_static(path)

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else "{}"
        
        try:
            payload = json.loads(body)
        except Exception:
            payload = {}

        if path == "/api/export-excel":
            self.handle_export_excel(payload)
            return

        if path == "/api/submit-test":
            self.handle_submit_test(payload)
            return

        self.send_error(404, "Endpoint not found")

    # --- PDF STREAMING WITH HTTP RANGE SUPPORT ---

    def serve_pdf(self, pdf_path):
        if not os.path.exists(pdf_path):
            self.send_error(404, "PDF file not found")
            return

        file_size = os.path.getsize(pdf_path)
        range_header = self.headers.get('Range', None)

        if range_header:
            match = re.match(r'bytes=(\d+)-(\d*)', range_header)
            if match:
                start = int(match.group(1))
                end = int(match.group(2)) if match.group(2) else file_size - 1
                end = min(end, file_size - 1)
                length = end - start + 1

                self.send_response(206)
                self.send_header('Content-Type', 'application/pdf')
                self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
                self.send_header('Content-Length', str(length))
                self.send_header('Accept-Ranges', 'bytes')
                self.end_headers()

                with open(pdf_path, 'rb') as f:
                    f.seek(start)
                    chunk_size = 64 * 1024
                    bytes_remaining = length
                    while bytes_remaining > 0:
                        read_bytes = min(chunk_size, bytes_remaining)
                        data = f.read(read_bytes)
                        if not data:
                            break
                        self.wfile.write(data)
                        bytes_remaining -= len(data)
                return

        self.send_response(200)
        self.send_header('Content-Type', 'application/pdf')
        self.send_header('Content-Length', str(file_size))
        self.send_header('Accept-Ranges', 'bytes')
        self.end_headers()
        with open(pdf_path, 'rb') as f:
            shutil.copyfileobj(f, self.wfile)

    # --- PERSONALIZED EXCEL EXPORT & SUBMISSION ---

    def handle_export_excel(self, payload):
        try:
            content, export_filename, safe_name = generate_student_excel(payload)

            self.send_response(200)
            self.send_header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            self.send_header("Content-Disposition", f'attachment; filename="{export_filename}"')
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_json({"error": f"Failed to export excel: {str(e)}"}, 500)

    def handle_submit_test(self, payload):
        try:
            student_name = payload.get("student_name", "Student").strip() or "Hoc_Sinh"
            student_email = payload.get("student_email", "").strip()
            summary = payload.get("summary", {})

            # 1. Generate Excel in memory
            content, export_filename, safe_name = generate_student_excel(payload)

            # 2. Save file copy to submissions folder on teacher's machine
            save_path = os.path.join(SUBMISSIONS_DIR, export_filename)
            with open(save_path, "wb") as f:
                f.write(content)

            # 3. Dispatch Email to teacher and student
            sent, msg, recipients = send_submission_email(student_name, student_email, summary, content, export_filename)

            self.send_json({
                "success": True,
                "email_sent": sent,
                "message": msg,
                "recipients": recipients,
                "filename": export_filename,
                "download_url": f"/api/download-submission?file={urllib.parse.quote(export_filename)}"
            })
        except Exception as e:
            self.send_json({"success": False, "error": f"Failed to submit test: {str(e)}"}, 500)

    # --- UTILS ---

    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def serve_static(self, path):
        if path == "/" or path == "":
            path = "/index.html"
        clean_path = path.lstrip("/")
        file_path = os.path.join(STATIC_DIR, clean_path)
        if not os.path.exists(file_path):
            file_path = os.path.join(APP_DIR, clean_path)

        if not os.path.exists(file_path) or os.path.isdir(file_path):
            self.send_error(404, "File not found")
            return

        mime = "application/octet-stream"
        if file_path.endswith(".html"):
            mime = "text/html; charset=utf-8"
        elif file_path.endswith(".css"):
            mime = "text/css; charset=utf-8"
        elif file_path.endswith(".js"):
            mime = "application/javascript; charset=utf-8"
        elif file_path.endswith(".json"):
            mime = "application/json; charset=utf-8"
        elif file_path.endswith(".png"):
            mime = "image/png"
        elif file_path.endswith(".svg"):
            mime = "image/svg+xml"

        with open(file_path, "rb") as f:
            content = f.read()

        self.send_response(200)
        self.send_header('Content-Type', mime)
        self.send_header('Content-Length', str(len(content)))
        self.end_headers()
        self.wfile.write(content)

def run(port=8085):
    server_address = ('', port)
    httpd = HTTPServer(server_address, BluebookAppHandler)
    print(f"🚀 Bluebook SAT Practice Engine running at: http://localhost:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8085
    run(port)
