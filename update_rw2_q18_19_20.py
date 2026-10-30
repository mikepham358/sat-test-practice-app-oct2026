import json
import openpyxl

NEW_DATA = {
    18: {
        "id": 45,
        "master_id": "M45",
        "q_number": 18,
        "module_code": "RW_Module2",
        "topic": "Standard English Conventions (Punctuation & Prepositional Phrases)",
        "difficulty": "Medium",
        "passage": "During the late nineteenth century, agricultural chemist George Washington Carver revolutionized farming practices in the American ______ promoting systematic crop rotation techniques that replenished essential nitrogen in depleted soils.",
        "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options_raw": "A. South, by\nB. South by\nC. South; by\nD. South: by",
        "correct_answer": "B",
        "princeton_strategy": "Grammar - Prepositions & Essential Modifiers",
        "tier1_hint": "Xác định chức năng ngữ pháp của cụm 'by promoting...': Đây là cụm giới từ chỉ phương thức (prepositional phrase of means) bổ nghĩa trực tiếp cho động từ 'revolutionized' (cải cách bằng cách nào?), đi liền ngay sau địa danh 'the American South'.",
        "tier2_hint": "Cụm giới từ chỉ cách thức bổ nghĩa thiết yếu đi liền sau danh từ không cần dấu phẩy ngăn cách. Hãy loại bỏ các phương án dùng dấu chấm phẩy (;) hoặc dấu hai chấm (:) vì vế sau không phải mệnh đề độc lập.",
        "tier3_hint": "Cấu trúc câu hoàn chỉnh: 'George Washington Carver revolutionized farming practices in the American South by promoting...'. Không có lý do ngữ pháp để đặt dấu phẩy hay dấu ngắt câu giữa 'South' và 'by'. Chọn phương án không có dấu câu: 'South by'.",
        "strategic_tip": "Mẹo Princeton Review: Đừng lạm dụng dấu phẩy (Comma Splatter)! Cụm giới từ bắt đầu bằng 'by + V-ing' bổ nghĩa liền kề cho hành động không bao giờ cần dấu phẩy ngăn cách.",
        "level1_tip": "Xác định chức năng ngữ pháp của cụm 'by promoting...' đi liền sau 'the American South'.",
        "level2_hint": "Cụm giới từ chỉ cách thức đi liền kề động từ và tân ngữ không cần dấu ngắt câu.",
        "level3_solution": "Chọn B. South by (không dùng dấu câu ngăn cách thừa).",
        "target_clue": "Động từ 'revolutionized' liên kết trực tiếp với phương thức thực hiện 'by promoting...'. Cụm 'the American South' là tân ngữ của giới từ 'in', tiếp nối liền mạch với giới từ 'by'.",
        "solution_steps": "1. Phân tích cấu trúc câu: 'George Washington Carver' (Chủ ngữ) + 'revolutionized' (Động từ) + 'farming practices' (Tân ngữ) + 'in the American South' (cụm giới từ nơi chốn) + 'by promoting...' (cụm giới từ phương thức).\n2. Cụm 'by promoting...' bổ nghĩa thiết yếu cho động từ 'revolutionized' để trả lời cho câu hỏi 'cải cách bằng cách nào?'. Do đó không được dùng dấu ngắt câu ngăn tách liên kết ngữ pháp tự nhiên.\n3. Loại C và D vì ';' và ':' không thể đứng trước một cụm giới từ phụ thuộc. Loại A vì dấu phẩy gây ngắt quãng không cần thiết. Chọn B.",
        "pooe_breakdown": "• Đáp án ĐÚNG: B. South by — Nối liền mạch cụm giới từ chỉ phương thức 'by promoting...' mà không dùng dấu câu thừa thãi.\n• Loại A. South, by — Dấu phẩy không cần thiết và ngắt quãng sai giữa danh từ nơi chốn và cụm giới từ bổ nghĩa cách thức.\n• Loại C. South; by — Dấu chấm phẩy (;) bắt buộc phải nối 2 mệnh đề độc lập (Independent Clauses), trong khi 'by promoting...' chỉ là cụm giới từ.\n• Loại D. South: by — Dấu hai chấm (:) không được dùng để ngắt giữa vị ngữ và cụm giới từ bổ nghĩa đi liền.",
        "pro_tip": "Mẹo Princeton Review: Đừng lạm dụng dấu phẩy (Comma Splatter)! Cụm giới từ bắt đầu bằng 'by + V-ing' bổ nghĩa liền kề cho hành động không bao giờ cần dấu phẩy ngăn cách.",
        "option_explanations": {
            "A": "Loại A (South, by) — Lỗi dấu phẩy thừa (Unnecessary Comma). Cụm giới từ chỉ phương tiện/cách thức 'by promoting...' bổ nghĩa trực tiếp cho động từ 'revolutionized' đi liền kề danh từ 'South', không cần dấu phẩy ngăn cách.",
            "B": "ĐÁP ÁN ĐÚNG: B (South by) — Chuẩn ngữ pháp tiếng Anh. Cụm 'in the American South' kết hợp liền mạch với cụm giới từ 'by promoting systematic crop rotation techniques...' mà không có bất kỳ dấu câu nào gây ngắt quãng mạch câu.",
            "C": "Loại C (South; by) — Lỗi chấm phẩy sai quy tắc (Semicolon Error). Dấu chấm phẩy chỉ dùng để liên kết hai mệnh đề độc lập hoàn chỉnh, trong khi 'by promoting...' chỉ là một cụm phân từ/giới từ phụ thuộc.",
            "D": "Loại D (South: by) — Lỗi hai chấm sai quy tắc (Colon Error). Không dùng dấu hai chấm ngay trước một giới từ để ngắt mạch diễn đạt thiết yếu của câu."
        }
    },
    19: {
        "id": 46,
        "master_id": "M46",
        "q_number": 19,
        "module_code": "RW_Module2",
        "topic": "Standard English Conventions (Boundaries & Sentence Structure)",
        "difficulty": "Hard",
        "passage": "Named for the year in which it was detected by English astronomers, SN 2016aps was a supernova (the explosion of a massive ______ in the constellation Draco, 3.6 billion light-years from Earth, the transient yet powerful blast propelled particles and debris into space at extremely high speeds.",
        "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options_raw": "A. star). Occurring\nB. star) occurring\nC. star) and occurring\nD. star), occurring",
        "correct_answer": "A",
        "princeton_strategy": "Grammar - Sentence Boundaries & Comma Splices",
        "tier1_hint": "Đếm số mệnh đề độc lập (Independent Clauses): Vế đầu 'SN 2016aps was a supernova (...)' là một câu hoàn chỉnh. Vế sau 'the transient yet powerful blast propelled particles...' cũng là một mệnh đề hoàn chỉnh có chủ ngữ và vị ngữ riêng.",
        "tier2_hint": "Nếu không có dấu chấm kết thúc câu 1, hai mệnh đề độc lập sẽ bị dính vào nhau tạo thành lỗi câu ghép sai quy tắc (Comma Splice / Run-on sentence).",
        "tier3_hint": "Cần dấu chấm câu '.' để ngắt kết thúc câu thứ nhất sau dấu đóng ngoặc đơn: 'star).'. Từ 'Occurring' viết hoa bắt đầu một cụm phân từ mở đầu bổ nghĩa cho mệnh đề độc lập thứ hai: 'Occurring in the constellation Draco..., the transient yet powerful blast propelled...'.",
        "strategic_tip": "Mẹo Princeton Review: Khi thấy các phương án có dấu chấm (.) tách câu đối đầu với các phương án chỉ dùng dấu phẩy (,) hoặc nối lửng, hãy luôn kiểm tra lỗi Comma Splice giữa 2 mệnh đề độc lập!",
        "level1_tip": "Phát hiện 2 mệnh đề độc lập riêng biệt: 'SN 2016aps was...' và 'the transient blast propelled...'.",
        "level2_hint": "Hai mệnh đề độc lập không thể nối với nhau chỉ bằng dấu phẩy mà cần dấu chấm câu tách rời.",
        "level3_solution": "Chọn A. star). Occurring (Dấu chấm kết thúc câu 1, chữ 'Occurring' viết hoa mở đầu câu 2).",
        "target_clue": "Mệnh đề 1: 'SN 2016aps was a supernova (the explosion of a massive star).' đã đầy đủ S-V-O. Mệnh đề 2: '[Occurring in the constellation Draco...], the transient yet powerful blast (S) propelled (V) particles...' cũng là một câu hoàn chỉnh.",
        "solution_steps": "1. Phân tích mệnh đề 1: 'Named for..., SN 2016aps was a supernova (the explosion of a massive star)'. Đây là một Independent Clause trọn vẹn.\n2. Phân tích mệnh đề 2: '...in the constellation Draco, 3.6 billion light-years from Earth, the transient yet powerful blast propelled particles and debris...'. Trong đó 'the blast propelled...' là Independent Clause thứ hai.\n3. Nếu chọn B, C, D thì hai mệnh đề độc lập sẽ bị nối bằng dấu phẩy ở giữa ('Draco, 3.6 billion... Earth, the transient blast...'), vi phạm nghiêm trọng lỗi Comma Splice.\n4. Do đó bắt buộc phải dùng dấu chấm sau ngoặc đơn để ngắt thành 2 câu riêng biệt: 'star). Occurring...'. Chọn A.",
        "pooe_breakdown": "• Đáp án ĐÚNG: A. star). Occurring — Dấu chấm ngắt câu hợp lệ ngăn chặn lỗi Comma Splice, cho phép cụm phân từ 'Occurring in...' mở đầu câu tiếp theo.\n• Loại B. star) occurring — Tạo thành lỗi câu chạy chữ (Run-on sentence) nối 2 mệnh đề độc lập không có liên từ hay dấu câu kết thúc.\n• Loại C. star) and occurring — Dùng liên từ 'and' kết hợp cụm phân từ lửng lơ không kết nối được 2 mệnh đề độc lập chính.\n• Loại D. star), occurring — Lỗi Comma Splice kinh điển; hai mệnh đề độc lập hoàn chỉnh bị nối chỉ bằng dấu phẩy.",
        "pro_tip": "Mẹo Princeton Review: Khi thấy các phương án có dấu chấm (.) tách câu đối đầu với các phương án chỉ dùng dấu phẩy (,) hoặc nối lửng, hãy luôn kiểm tra lỗi Comma Splice giữa 2 mệnh đề độc lập!",
        "option_explanations": {
            "A": "ĐÁP ÁN ĐÚNG: A (star). Occurring) — Cấu trúc câu chuẩn xác. Dấu chấm kết thúc mệnh đề độc lập thứ nhất 'SN 2016aps was a supernova (...)'. Chữ 'Occurring' viết hoa mở đầu cụm phân từ (participial phrase) bổ nghĩa cho chủ ngữ 'the transient yet powerful blast' của câu thứ hai.",
            "B": "Loại B (star) occurring) — Lỗi câu chạy chữ không dấu ngắt (Run-on Sentence). Câu có 2 cụm chủ-vị độc lập nhưng không có dấu câu ngăn tách.",
            "C": "Loại C (star) and occurring) — Lỗi ngữ pháp. Không thể dùng 'and' để kết nối một danh từ trong ngoặc với một phân từ ngoài ngoặc để nối sang mệnh đề sau.",
            "D": "Loại D (star), occurring) — Lỗi phẩy nối hai mệnh đề độc lập (Comma Splice). Dấu phẩy và cụm phân từ xen giữa không thể kết nối hợp lệ hai mệnh đề độc lập 'SN 2016aps was a supernova' và 'the blast propelled particles'."
        }
    },
    20: {
        "id": 47,
        "master_id": "M47",
        "q_number": 20,
        "module_code": "RW_Module2",
        "topic": "Standard English Conventions (Dangling & Misplaced Modifiers)",
        "difficulty": "Hard",
        "passage": "Originating during the Cretaceous period, ______",
        "prompt": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "options_raw": "A. entomologists have extensively examined fossilized resin deposits excavated in northern Myanmar.\nB. the fossilized amber specimens excavated in northern Myanmar preserve unprecedented anatomical details of early arthropods.\nC. paleontological excavation in northern Myanmar has uncovered numerous ancient arthropods.\nD. arthropods were trapped and entombed within sticky conifer secretions.",
        "correct_answer": "B",
        "princeton_strategy": "Grammar - Dangling & Misplaced Modifiers",
        "tier1_hint": "Quy tắc bổ ngữ lơ lửng (Dangling Modifier): Cụm mở đầu 'Originating during the Cretaceous period,' (Có nguồn gốc từ kỷ Phấn trắng,) là một cụm phân từ bổ nghĩa. Danh từ đứng ngay sau dấu phẩy BẮT BUỘC phải là chủ thể có nguồn gốc từ kỷ Phấn trắng.",
        "tier2_hint": "Tự đặt câu hỏi: CÁI GÌ hoặc AI có nguồn gốc từ kỷ Phấn trắng? Các nhà côn trùng học (entomologists)? Cuộc khai quật (excavation)? Hay các mẫu hổ phách hóa thạch (fossilized amber specimens)?",
        "tier3_hint": "Chỉ có 'the fossilized amber specimens' (các mẫu hổ phách hóa thạch của nhựa cây cổ đại) mới có nguồn gốc từ kỷ Phấn trắng (hàng chục triệu năm trước). Các nhà khoa học hay cuộc khai quật là các thực thể ở thời hiện đại. Do đó, chủ ngữ đứng sát dấu phẩy bắt buộc phải là 'the fossilized amber specimens'.",
        "strategic_tip": "Mẹo Princeton Review: Đối với câu hỏi Dangling Modifier, bước 1 là đọc cụm mở đầu trước dấu phẩy, bước 2 tự hỏi 'Ai/Cái gì làm hành động này?', bước 3 nhìn ngay danh từ đầu tiên sau dấu phẩy ở 4 phương án để chọn đáp án ăn khớp logic 100%!",
        "level1_tip": "Nhận diện cụm phân từ mở đầu: 'Originating during the Cretaceous period,'.",
        "level2_hint": "Chủ ngữ đứng ngay sau dấu phẩy phải là thực thể hình thành trong kỷ Phấn trắng.",
        "level3_solution": "Chọn B. the fossilized amber specimens (mẫu hổ phách hóa thạch).",
        "target_clue": "Cụm phân từ 'Originating during the Cretaceous period' mô tả niên đại địa chất hình thành của các mẫu hổ phách (amber specimens).",
        "solution_steps": "1. Cụm mở đầu: 'Originating during the Cretaceous period,' (Có nguồn gốc từ kỷ Phấn trắng).\n2. Xét chủ ngữ sau dấu phẩy của từng phương án:\n   - Phương án A: 'entomologists' (các nhà côn trùng học) -> Vô lý vì con người không sinh ra từ kỷ Phấn trắng.\n   - Phương án C: 'paleontological excavation' (cuộc khai quật) -> Vô lý vì hoạt động khai quật diễn ra ở thời hiện đại.\n   - Phương án D: 'arthropods were trapped' -> Cấu trúc bị động không làm nổi bật chủ thể trực tiếp của niên đại tích tụ nhựa cây mẫu vật.\n   - Phương án B: 'the fossilized amber specimens' (các mẫu vật hổ phách hóa thạch) -> Hoàn toàn chính xác về mặt niên đại hình thành.\n3. Chọn B.",
        "pooe_breakdown": "• Đáp án ĐÚNG: B. the fossilized amber specimens... — Chủ ngữ 'the fossilized amber specimens' khớp logic hoàn hảo với bổ ngữ 'Originating during the Cretaceous period'.\n• Loại A. entomologists... — Lỗi bổ ngữ lơ lửng (Dangling Modifier); biến các nhà côn trùng học thành sinh vật có nguồn gốc từ kỷ Phấn trắng.\n• Loại C. paleontological excavation... — Lỗi bổ ngữ lơ lửng; cuộc khai quật thời hiện đại không thể có nguồn gốc từ kỷ Phấn trắng.\n• Loại D. arthropods were trapped... — Không làm rõ đối tượng trực tiếp hình thành trong kỷ Phấn trắng được nói đến trong toàn văn bản.",
        "pro_tip": "Mẹo Princeton Review: Đối với câu hỏi Dangling Modifier, bước 1 là đọc cụm mở đầu trước dấu phẩy, bước 2 tự hỏi 'Ai/Cái gì làm hành động này?', bước 3 nhìn ngay danh từ đầu tiên sau dấu phẩy ở 4 phương án để chọn đáp án ăn khớp logic 100%!",
        "option_explanations": {
            "A": "Loại A (entomologists...) — Lỗi bổ ngữ lơ lửng (Dangling Modifier). Nếu đặt 'entomologists' sau dấu phẩy, câu sẽ mang nghĩa phi lý là 'các nhà côn trùng học có nguồn gốc từ kỷ Phấn trắng' (kỷ nguyên của khủng long).",
            "B": "ĐÁP ÁN ĐÚNG: B (the fossilized amber specimens...) — Chuẩn xác ngữ pháp. Chủ ngữ 'the fossilized amber specimens' (mẫu hổ phách hóa thạch) là đối tượng duy nhất có niên đại hình thành từ kỷ Phấn trắng, liên kết logic tuyệt đối với cụm phân từ mở đầu.",
            "C": "Loại C (paleontological excavation...) — Lỗi bổ ngữ lơ lửng (Dangling Modifier). Hoạt động khai quật khảo cổ là sự kiện khoa học ở thời hiện đại, không thể có nguồn gốc từ kỷ Phấn trắng.",
            "D": "Loại D (arthropods were trapped...) — Cấu trúc câu bị động làm sai lệch tiêu điểm bổ nghĩa của cụm phân từ mở đầu, khiến ngữ nghĩa câu trở nên rời rạc."
        }
    }
}

def update_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    count = 0
    for q in data.get('questions', []):
        q_num = q.get('q_number')
        if q.get('module_code') == 'RW_Module2' and q_num in NEW_DATA:
            new_info = NEW_DATA[q_num]
            for k, v in new_info.items():
                q[k] = v
            count += 1
            print(f"[{file_path}] Updated Q{q_num} (ID {q.get('id')})")
            
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Successfully saved {count} questions to {file_path}")

def update_excel_explanations(file_path):
    wb = openpyxl.load_workbook(file_path)
    
    # 1. Master Sheet
    if 'Master_All_98_Explanations' in wb.sheetnames:
        ws = wb['Master_All_98_Explanations']
        for r in range(5, 103):
            mid = ws.cell(r, 1).value
            mod = ws.cell(r, 2).value
            q_val = ws.cell(r, 3).value
            for q_num, info in NEW_DATA.items():
                if mid == info["master_id"] or (mod == 'RW_Module2' and q_val in [q_num, str(q_num), f"Q{q_num}"]):
                    ws.cell(r, 4).value = info["topic"]
                    ws.cell(r, 5).value = info["difficulty"]
                    ws.cell(r, 6).value = info["passage"]
                    ws.cell(r, 7).value = info["prompt"]
                    ws.cell(r, 8).value = info["options_raw"]
                    ws.cell(r, 9).value = info["correct_answer"]
                    ws.cell(r, 10).value = info["princeton_strategy"]
                    ws.cell(r, 11).value = info["target_clue"]
                    ws.cell(r, 12).value = info["solution_steps"]
                    ws.cell(r, 13).value = info["pooe_breakdown"]
                    ws.cell(r, 14).value = info["pro_tip"]
                    print(f"Updated Master_All_98_Explanations row {r} for {mid}")

    # 2. RW_Module2_Explanations Sheet
    if 'RW_Module2_Explanations' in wb.sheetnames:
        ws = wb['RW_Module2_Explanations']
        for r in range(5, ws.max_row + 1):
            q_val = ws.cell(r, 1).value
            for q_num, info in NEW_DATA.items():
                if q_val in [q_num, str(q_num), f"Q{q_num}"]:
                    ws.cell(r, 2).value = info["correct_answer"]
                    ws.cell(r, 3).value = info["target_clue"]
                    ws.cell(r, 4).value = info["solution_steps"]
                    ws.cell(r, 5).value = info["pooe_breakdown"]
                    ws.cell(r, 6).value = info["topic"]
                    ws.cell(r, 7).value = info["difficulty"]
                    ws.cell(r, 8).value = info["passage"]
                    ws.cell(r, 9).value = info["prompt"]
                    ws.cell(r, 10).value = info["options_raw"]
                    ws.cell(r, 11).value = info["princeton_strategy"]
                    ws.cell(r, 12).value = info["pro_tip"]
                    print(f"Updated RW_Module2_Explanations row {r} for Q{q_num}")

    wb.save(file_path)
    print(f"Successfully saved {file_path}")

def update_excel_template(file_path):
    wb = openpyxl.load_workbook(file_path)
    if 'RW_Module2' in wb.sheetnames:
        ws = wb['RW_Module2']
        for r in range(1, ws.max_row + 1):
            q_val = ws.cell(r, 1).value
            for q_num, info in NEW_DATA.items():
                if q_val in [q_num, str(q_num), f"Q{q_num}"]:
                    ws.cell(r, 2).value = info["topic"]
                    ws.cell(r, 3).value = info["passage"]
                    ws.cell(r, 4).value = info["prompt"]
                    ws.cell(r, 5).value = info["options_raw"]
                    print(f"Updated {file_path} sheet RW_Module2 row {r} for Q{q_num}")
                    
    if 'Master_All_98_Questions' in wb.sheetnames:
        ws = wb['Master_All_98_Questions']
        for r in range(1, ws.max_row + 1):
            mid = ws.cell(r, 1).value
            for q_num, info in NEW_DATA.items():
                if mid == info["master_id"]:
                    ws.cell(r, 3).value = info["topic"]
                    ws.cell(r, 4).value = info["passage"]
                    ws.cell(r, 5).value = info["prompt"]
                    ws.cell(r, 6).value = info["options_raw"]
                    print(f"Updated {file_path} sheet Master_All_98_Questions row {r} for {mid}")
                    
    wb.save(file_path)
    print(f"Successfully saved {file_path}")

if __name__ == '__main__':
    update_json_file('SAT Coach/BluebookOct2026App/database.json')
    update_json_file('SAT Coach/BluebookOct2026App/static/database.json')
    update_excel_explanations('SAT Coach/Real Tests/Oct 2026/Explanations.xlsx')
    update_excel_template('SAT Coach/BluebookOct2026App/template.xlsx')
    update_excel_template('SAT Coach/BluebookOct2026App/static/template.xlsx')
