#!/usr/bin/env python3
"""
Automated Protocol & Pipeline for Adding New Digital SAT Exams
Author: Mike Pham Bá Hồng Sơn - Google for Education Innovator
Usage:
    python3 add_new_test.py \
        --test-id nov2026 \
        --title "Digital SAT Practice Test — November 2026 (INT-C)" \
        --short-title "Tháng 11/2026 (INT-C)" \
        --date "2026-11" \
        --pdf-test "/path/to/Test.pdf" \
        --pdf-key "/path/to/Key.pdf" \
        --drive-id "YOUR_GOOGLE_DRIVE_FILE_ID"
"""

import os
import sys
import argparse
import json
import re
import fitz

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
MANIFEST_JSON = os.path.join(DATA_DIR, "manifest.json")
TESTS_JS = os.path.join(DATA_DIR, "tests.js")

STRATEGY_MAP = {
    "Words in Context": "POOE - Contextual Clues & Tone Matching",
    "Text Structure and Purpose": "Structure & Purpose - Text Mapping",
    "Cross-Text Connections": "Dual-Text Synthesis - Contrast & Agreement",
    "Central Ideas and Details": "Central Idea - Core Thesis Identification",
    "Command of Evidence": "Data & Textual Evidence - Hypothesis Testing",
    "Inferences": "Logical Completion - Restraint & Direct Evidence",
    "Boundaries": "Sentence Boundaries - Independent vs Dependent Clauses",
    "Form, Structure, and Sense": "Grammar - Subject-Verb Agreement & Modifiers",
    "Transitions": "Directional Logic - Contrast vs Continuation vs Cause",
    "Rhetorical Synthesis": "Rhetorical Goal Alignment - Note Selection",
    "Linear equations": "Algebra - Systematic Isolation & Desmos Solve",
    "Linear functions": "Linear Modeling - Slope & Y-Intercept Meaning",
    "Linear inequalities": "Inequality Modeling - Boundary Conditions",
    "Nonlinear functions": "Advanced Math - Quadratic/Exponential Vertex & Factors",
    "Nonlinear equations": "Algebraic Substitution & Graph Intersection",
    "Equivalent expressions": "Algebra - Expansion, Factoring & Exponent Laws",
    "Distributions and measures of center and spread": "Statistics - Mean, Median, Range & Outliers",
    "Ratios, rates": "Proportions - Unit Rates & Dimensional Analysis",
    "Percentages": "Percentages - Multipliers & Percent Change",
    "Probability": "Probability - Part over Whole & Conditional Subsets",
    "Models and scatterplots": "Data Analysis - Line of Best Fit & Trends",
    "Lines, angles, and triangles": "Geometry - Angle Relationships & Triangle Sum",
    "Right triangles and trigonometry": "Trigonometry - SOH CAH TOA & Pythagorean Theorem",
    "Area and volume": "Geometry - Standard Area & Volume Formulas",
    "Circles": "Geometry - Standard Circle Equation & Arc Length"
}

def parse_answer_key(key_pdf_path):
    doc = fitz.open(key_pdf_path)
    full_text = ""
    for page in doc:
        full_text += "\n" + page.get_text()

    key_modules = re.split(r"(Section \d, Module \d: [^\n]+)", full_text)
    keys_by_module = {
        "RW_Module1": {},
        "RW_Module2": {},
        "Math_Module1": {},
        "Math_Module2": {}
    }

    mod_map = {
        "Section 1, Module 1: Reading and Writing": "RW_Module1",
        "Section 1, Module 2: Reading and Writing": "RW_Module2",
        "Section 2, Module 1: Math": "Math_Module1",
        "Section 2, Module 2: Math": "Math_Module2"
    }

    curr_m = None
    for part in key_modules:
        part = part.strip()
        if part in mod_map:
            curr_m = mod_map[part]
        elif curr_m:
            items = re.findall(r"(\d+)\.\s+([A-D]|[\d\/\.\-]+)\s+\[([^\]]+)\]", part)
            for q_num, ans, domain in items:
                keys_by_module[curr_m][int(q_num)] = {
                    "correct_answer": ans.strip(),
                    "topic_raw": domain.strip()
                }

    return keys_by_module

def parse_exam_pdf(test_pdf_path, keys_by_module):
    doc = fitz.open(test_pdf_path)
    page_dict = {i + 1: page.get_text() for i, page in enumerate(doc)}

    # Detect start pages for sections
    sec_starts = {}
    for p_num, content in page_dict.items():
        for line in content.split("\n")[:4]:
            if "Section 1, Module 1" in line: sec_starts["RW_Module1"] = p_num
            elif "Section 1, Module 2" in line: sec_starts["RW_Module2"] = p_num
            elif "Section 2, Module 1" in line: sec_starts["Math_Module1"] = p_num
            elif "Section 2, Module 2" in line: sec_starts["Math_Module2"] = p_num

    rw1_s = sec_starts.get("RW_Module1", 2)
    rw2_s = sec_starts.get("RW_Module2", 16)
    m1_s = sec_starts.get("Math_Module1", 30)
    m2_s = sec_starts.get("Math_Module2", 37)
    total_pages = len(doc)

    modules_def = [
        ("RW_Module1", rw1_s, rw2_s - 1, 27, "Reading & Writing: Module 1", "Reading and Writing", 1),
        ("RW_Module2", rw2_s, m1_s - 1, 27, "Reading & Writing: Module 2", "Reading and Writing", 2),
        ("Math_Module1", m1_s, m2_s - 1, 22, "Math: Module 1", "Math", 1),
        ("Math_Module2", m2_s, total_pages, 22, "Math: Module 2", "Math", 2),
    ]

    all_questions = []
    global_id = 1

    for mod_code, start_p, end_p, total_q, mod_title, section, mod_num in modules_def:
        mod_text = ""
        for p in range(start_p, end_p + 1):
            if p in page_dict:
                mod_text += f"\n[PAGE_{p}]\n" + page_dict[p]

        matches = list(re.finditer(r"\n(\d{1,2})(?:\s*\(Student-produced response\))?\s*\n", mod_text))
        q_spans = []
        expected_q = 1
        for m in matches:
            if int(m.group(1)) == expected_q:
                is_spr = "Student-produced response" in m.group(0)
                q_spans.append((expected_q, m.start(), m.end(), is_spr))
                expected_q += 1
                if expected_q > total_q:
                    break

        for i in range(len(q_spans)):
            q_num, s_start, s_end, is_spr = q_spans[i]
            next_start = q_spans[i+1][1] if i + 1 < len(q_spans) else len(mod_text)
            block = mod_text[s_end:next_start]

            prev_text = mod_text[:s_start]
            p_tag = re.findall(r"\[PAGE_(\d+)\]", prev_text)
            q_page = int(p_tag[-1]) if p_tag else start_p

            clean_block = re.sub(r"\[PAGE_\d+\]", "", block).strip()
            key_info = keys_by_module.get(mod_code, {}).get(q_num, {})
            corr = key_info.get("correct_answer", "")
            topic_raw = key_info.get("topic_raw", "")

            passage, prompt, options, options_raw = "", "", [], ""
            if is_spr:
                prompt = clean_block
                options_raw = "Student-Produced Response (Grid-in)"
            else:
                opt_matches = list(re.finditer(r"(?:^|\n)([A-D])\.\s+(.*?)(?=(?:\n[A-D]\.|\Z))", clean_block, re.DOTALL))
                if len(opt_matches) == 4:
                    stem_part = clean_block[:opt_matches[0].start()].strip()
                    lines = stem_part.split("\n\n")
                    if len(lines) > 1:
                        passage = "\n\n".join(lines[:-1]).strip()
                        prompt = lines[-1].strip()
                    else:
                        passage = ""
                        prompt = stem_part

                    opt_texts = []
                    for om in opt_matches:
                        k = om.group(1)
                        t = om.group(2).strip().replace("\n", " ")
                        options.append({"key": k, "text": t})
                        opt_texts.append(f"{k}. {t}")
                    options_raw = "\n".join(opt_texts)
                else:
                    prompt = clean_block

            # Strategy & Hints
            strat = "POOE - Process of Elimination"
            for k_top, v_strat in STRATEGY_MAP.items():
                if k_top in topic_raw:
                    strat = v_strat
                    break

            corr_opt_text = next((o["text"] for o in options if o["key"] == corr), "")
            distractors = {o["key"]: o["text"] for o in options if o["key"] != corr}

            if "RW" in mod_code:
                t1 = f"Xác định trọng tâm câu hỏi và ngữ cảnh học thuật của đoạn văn cho chủ đề '{topic_raw}'."
                t2 = "Đối chiếu các từ khóa và mối liên kết logic; loại trừ các phương án bẫy hoặc sai phạm vi văn bản."
                t3 = f"Phương án đúng hoàn toàn là [{corr}]: '{corr_opt_text}'."
                stip = f"Mẹo College Board: Với dạng bài '{topic_raw}', luôn bám sát dẫn chứng trực tiếp và quy tắc chuẩn mực."
            else:
                if is_spr:
                    t1 = f"Phân tích yêu cầu đề bài và thiết lập phương trình cho dạng '{topic_raw}'."
                    t2 = "Thực hiện phép tính đại số cẩn thận hoặc nhập phương trình vào Desmos để tìm nghiệm."
                    t3 = f"Nghiệm chính xác cần điền vào ô trống là [{corr}]."
                    stip = "Mẹo Grid-in: Kiểm tra kỹ dấu âm/dương, rút gọn phân số hoặc kiểm tra kết quả làm tròn."
                else:
                    t1 = f"Xác định đại lượng cần tìm và các mối quan hệ cho trước của dạng '{topic_raw}'."
                    t2 = "Áp dụng công thức chuẩn hoặc sử dụng máy tính Desmos để tìm giao điểm/giá trị biểu thức."
                    t3 = f"Kết quả chính xác là phương án [{corr}]: '{corr_opt_text}'."
                    stip = "Mẹo Toán SAT: Luôn đọc kỹ câu hỏi hỏi về x, y, hay một biểu thức kết hợp như (2x + 1)."

            option_exps = {}
            for opt in options:
                k = opt["key"]
                txt = opt["text"]
                if k == corr:
                    option_exps[k] = f"ĐÁP ÁN ĐÚNG. {k} ({txt}) giải quyết chính xác câu hỏi theo ngữ cảnh và quy tắc học thuật."
                else:
                    option_exps[k] = f"Loại {k} — {k} ({txt}) không thỏa mãn dữ kiện bài hoặc chứa lỗi bẫy."

            pooe_b = f"• Đáp án ĐÚNG: {corr}. {corr_opt_text}\n"
            for k, txt in distractors.items():
                pooe_b += f"• Loại {k}. {txt} — Sai lệch dữ kiện hoặc suy diễn ngoài phạm vi.\n"

            q_obj = {
                "id": global_id,
                "master_id": f"M{global_id}",
                "q_number": q_num,
                "q_label": f"Q{q_num}",
                "module_code": mod_code,
                "module_title": mod_title,
                "section": section,
                "module_num": mod_num,
                "topic": topic_raw,
                "passage": passage,
                "prompt": prompt,
                "options": options,
                "options_raw": options_raw,
                "is_grid_in": is_spr,
                "correct_answer": corr,
                "tier1_hint": t1,
                "tier2_hint": t2,
                "tier3_hint": t3,
                "strategic_tip": stip,
                "level1_tip": t1,
                "level2_hint": t2,
                "level3_solution": t3,
                "pdf_page": q_page,
                "difficulty": "Medium",
                "target_clue": f"Từ khóa & phương trình tương ứng chủ đề {topic_raw}",
                "solution_steps": f"Phân tích dữ kiện và áp dụng phương pháp chuẩn cho {topic_raw}.",
                "princeton_strategy": strat,
                "pro_tip": "Luôn quản lý thời gian hợp lý và tận dụng tối đa tính năng Desmos / POOE.",
                "pooe_breakdown": pooe_b,
                "option_explanations": option_exps
            }
            if is_spr:
                q_obj["grid_in_explanation"] = {
                    "correct_answer": corr,
                    "solution_steps": f"Giải theo công thức chủ đề {topic_raw} cho kết quả {corr}.",
                    "trap_errors": "Nhầm lẫn hệ số hoặc sai sót tính toán bước cuối."
                }

            all_questions.append(q_obj)
            global_id += 1

    return all_questions, modules_def

def main():
    parser = argparse.ArgumentParser(description="Add new Digital SAT test to Bluebook App")
    parser.add_argument("--test-id", required=True, help="Test unique code e.g. nov2026")
    parser.add_argument("--title", required=True, help="Full title of the test")
    parser.add_argument("--short-title", required=True, help="Short display title e.g. Tháng 11/2026 (INT-C)")
    parser.add_argument("--date", default="2026-11", help="Year-Month of the test")
    parser.add_argument("--pdf-test", required=True, help="Path to test booklet PDF")
    parser.add_argument("--pdf-key", required=True, help="Path to answer key PDF")
    parser.add_argument("--drive-id", required=True, help="Google Drive File ID for PDF preview")
    parser.add_argument("--poster", default="", help="Poster image filename or empty for default")
    args = parser.parse_args()

    print(f"=== Adding New Digital SAT Test: {args.title} ===")
    keys = parse_answer_key(args.pdf_key)
    print(f"Parsed keys for {sum(len(v) for v in keys.values())} questions.")

    questions, modules_def = parse_exam_pdf(args.pdf_test, keys)
    print(f"Parsed {len(questions)} total questions from test booklet.")

    modules_json = []
    for code, sp, ep, cnt, title, sec, num in modules_def:
        mod_q_ids = [q["id"] for q in questions if q["module_code"] == code]
        modules_json.append({
            "id": code.lower().replace("_", ""),
            "code": code,
            "title": title,
            "section": sec,
            "module_num": num,
            "time_minutes": 32 if "RW" in code else 35,
            "question_count": cnt,
            "pdf_start_page": sp,
            "question_ids": mod_q_ids
        })

    poster_file = args.poster or f"poster_{args.test_id}.png"
    pdf_preview = f"https://drive.google.com/file/d/{args.drive_id}/preview"
    pdf_view = f"https://drive.google.com/file/d/{args.drive_id}/view"

    db_obj = {
        "test_title": args.title,
        "test_id": args.test_id,
        "source_attribution": f"Real Test {args.short_title}",
        "credits": "Curated & Pedagogically Structured by Mike Pham Bá Hong Son - Google for Education Innovator",
        "pdf_path": args.pdf_test,
        "pdf_drive_preview": pdf_preview,
        "pdf_drive_view": pdf_view,
        "excel_path": "",
        "total_questions": len(questions),
        "modules": modules_json,
        "questions": questions,
        "initial_error_logs": [],
        "strategies": []
    }

    out_file = os.path.join(DATA_DIR, f"{args.test_id}.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(db_obj, f, indent=2, ensure_ascii=False)
    print(f"Saved dataset to {out_file}!")

    # Update manifest.json
    manifest = []
    if os.path.exists(MANIFEST_JSON):
        with open(MANIFEST_JSON, "r", encoding="utf-8") as f:
            manifest = json.load(f)

    # Remove existing entry with same id if any
    manifest = [m for m in manifest if m.get("code") != args.test_id and m.get("id") != args.test_id]

    new_entry = {
        "id": args.test_id,
        "code": args.test_id,
        "title": args.title,
        "short_title": args.short_title,
        "badge": "Mới nhất",
        "date": args.date,
        "dataFile": f"data/{args.test_id}.json",
        "pdfDriveId": args.drive_id,
        "pdfPreviewUrl": pdf_preview,
        "pdfViewUrl": pdf_view,
        "poster": poster_file,
        "total_questions": len(questions),
        "storageKey": f"bluebook_{args.test_id}_student_state_v1",
        "description": f"Đề thi Real Test Digital SAT quốc tế {args.short_title} kèm giải thích chi tiết 4 tầng Socratic."
    }
    manifest.insert(0, new_entry)

    with open(MANIFEST_JSON, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    with open(TESTS_JS, "w", encoding="utf-8") as f:
        f.write("/**\n * Digital SAT Bluebook App - Tests Manifest\n */\nwindow.TESTS_MANIFEST = ")
        json.dump(manifest, f, indent=2, ensure_ascii=False)
        f.write(";\n")

    print(f"Registered {args.short_title} in manifest.json and tests.js successfully!")

if __name__ == "__main__":
    main()
