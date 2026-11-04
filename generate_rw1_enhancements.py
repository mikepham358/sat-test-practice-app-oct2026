import docx, re, json

doc = docx.Document('/Users/mike/Library/CloudStorage/GoogleDrive-mikepham358@gmail.com/My Drive/A Vinschool by Mike Pham/SAT Coach/Real Tests/Sep 2026/Mermaid Sep26 SAT.docx')
lines = [p.text for p in doc.paragraphs][:330]

with open('SAT Coach/BluebookOct2026App/data/sep2026.json') as f:
    d = json.load(f)

q_splits = []
for i, l in enumerate(lines):
    cleaned = l.replace('\uec03', '').replace('\uec02', '').strip()
    m = re.match(r'^Câu\s+(\d+):?\s*(.*)', cleaned)
    if m:
        q_splits.append((int(m.group(1)), i, m.group(2).strip()))

custom_options_data = {
    16: {
        "A": "works — Chủ ngữ chính là tên của một người duy nhất 'Liana Burghardt' (ngôi thứ 3 số ít). Mệnh đề quan hệ xen giữa hai dấu phẩy ', whose research focuses mainly on plants,' chỉ là thông tin bổ sung, không làm thay đổi số lượng của chủ ngữ. Động từ thì hiện tại đơn miêu tả nghề nghiệp bắt buộc phải chia số ít có đuôi 's' (works).",
        "B": "work — Động từ ở dạng nguyên mẫu hoặc số nhiều, vi phạm quy tắc hòa hợp chủ vị với chủ ngữ số ít 'Liana Burghardt'.",
        "C": "are working — Dùng trợ động từ số nhiều 'are', sai về hòa hợp chủ vị với chủ ngữ số ít; đồng thời thì hiện tại tiếp diễn không phù hợp để miêu tả nghề nghiệp/nghiên cứu khoa học thường trực.",
        "D": "have worked — Dùng trợ động từ số nhiều 'have' vi phạm hòa hợp chủ vị, và thì hiện tại hoàn thành không phản ánh thói quen làm việc thường trực ở hiện tại."
    },
    17: {
        "A": "Sereysothea. The — Khối văn bản đứng trước ('In 2018, she created Silenced, a tribute...') và đứng sau ('The performance pairs large video...') là hai mệnh đề độc lập (Independent Clauses) hoàn chỉnh có đủ Chủ - Vị. Khi hai câu độc lập đứng cạnh nhau mà không có liên từ phối hợp (FANBOYS), bắt buộc phải dùng dấu chấm (.) để tách thành hai câu riêng biệt, triệt tiêu lỗi Run-on.",
        "B": "Sereysothea the — Không dùng dấu câu giữa hai mệnh đề độc lập, phạm lỗi Fused Sentence / Run-on nghiêm trọng.",
        "C": "Sereysothea but the — Thêm liên từ tương phản 'but' làm sai lệch logic ngữ nghĩa, vì hai câu bổ trợ nối tiếp thông tin chứ không hề đối lập nhau.",
        "D": "Sereysothea, the — Dùng dấu phẩy đơn độc nối hai mệnh đề độc lập phạm lỗi Comma Splice kinh điển của ngữ pháp SAT."
    },
    18: {
        "D": "Mo, — Mệnh đề phụ quan hệ không xác định 'whose chemical symbol is Mo' cắt ngang giữa chủ ngữ 'Molybdenum' và vị ngữ chính 'is classified'. Tác giả đã mở đầu mệnh đề phụ bằng một dấu phẩy sau 'Molybdenum', nên bắt buộc phải đóng lại bằng một dấu phẩy ngay sau 'Mo' để tạo thành cặp dấu phẩy bao bọc nhất quán.",
        "A": "Mo — Thiếu dấu phẩy đóng, làm cụm thông tin bổ sung bị dính liền vào vị ngữ chính của câu.",
        "B": "Mo: — Dấu hai chấm không bao giờ kết đôi với dấu phẩy phía trước; chỉ dùng sau mệnh đề độc lập hoàn chỉnh.",
        "C": "Mo— — Dấu gạch ngang đơn độc không thể kết đôi với dấu phẩy mở đầu trước đó. Phải nhất quán (cặp phẩy hoặc cặp gạch ngang)."
    },
    19: {
        "D": "the dictionary preserved knowledge of the Hopi language and was considered a model... — Cụm phân từ mở đầu 'Containing almost 30,000 entries' (Chứa gần 30.000 mục từ) là một cụm bổ nghĩa lơ lửng (Modifier). Danh từ đứng ngay sau dấu phẩy bắt buộc phải là thực thể có khả năng vật lý 'chứa 30.000 mục từ' — chính là cuốn từ điển ('the dictionary').",
        "A": "knowledge of the Hopi language was preserved... — Lỗi Dangling Modifier: 'Kiến thức' (Knowledge) là khái niệm trừu tượng, không thể tự nó 'chứa 30.000 mục từ'.",
        "B": "future lexicographers considered the dictionary... — Lỗi Dangling Modifier: 'Các nhà làm từ điển tương lai' không thể tự 'chứa 30.000 mục từ'.",
        "C": "the dictionary's preservation of knowledge... — Lỗi Dangling Modifier: 'Sự bảo tồn' (preservation) là hành động trừu tượng, không phải là vật thể chứa mục từ."
    },
    20: {
        "D": "tip. Mimicking — Vế trước '...relies on a modified dorsal spine... at its tip' là một câu hoàn chỉnh trọn vẹn. Vế sau 'Mimicking potential food items... the appendage evolved to function...' là một câu hoàn chỉnh độc lập mới bắt đầu bằng cụm V-ing bổ nghĩa cho 'the appendage'. Phải dùng dấu chấm (.) để dứt điểm câu trước một cách rành mạch.",
        "A": "tip, mimicking — Dùng dấu phẩy sẽ khiến cụm 'mimicking' bị kéo dính vào câu trước, bổ nghĩa sai lệch cho 'tip' (cái đỉnh) thay vì bổ nghĩa cho 'the appendage'.",
        "B": "tip mimicking — Không có dấu câu tạo lỗi Run-on.",
        "C": "tip and mimicking — Dùng liên từ 'and' kết nối khập khiễng giữa mệnh đề độc lập và cụm phân từ, vi phạm cấu trúc song hành."
    },
    25: {
        "A": "Ole Bull was a Norwegian violinist who once owned a Stradivarius violin. — Đưa 'Ole Bull' lên làm chủ ngữ chính và giải thích trực tiếp ông ấy là ai ('a Norwegian violinist') theo đúng yêu cầu mục tiêu 'introduce Ole Bull to a new audience'.",
        "B": "The Ole Bull Stradivarius is named after Ole Bull. — Tập trung giới thiệu về cây đàn vĩ cầm (The Ole Bull Stradivarius) thay vì giới thiệu về con người Ole Bull theo yêu cầu đề bài.",
        "C": "Of the 1,000 or so violins Antonio Stradivari made... — Chỉ nói về số lượng đàn còn tồn tại của Stradivari, không hề nhắc đến cái tên Ole Bull.",
        "D": "Born in 1644, Antonio Stradivari was an Italian instrument maker... — Giới thiệu tiểu sử của Antonio Stradivari, lạc đề hoàn toàn so với yêu cầu giới thiệu Ole Bull."
    },
    26: {
        "D": "When participants were asked to identify the correct version of Snoopy, 84% selected the unaltered image. — Chứa con số kết quả nghiên cứu cụ thể ('84% selected the unaltered image'), đáp ứng hoàn hảo yêu cầu 'present a finding from the study' (trình bày một phát hiện/kết quả từ nghiên cứu).",
        "A": "In a 2021 study, researchers asked participants to identify the correct version of Snoopy. — Chỉ mô tả phương pháp/cách thức tiến hành (Method), không đưa ra kết quả (Finding) nào.",
        "B": "Participants were asked to identify the correct version of Snoopy, who is a cartoon dog... — Chỉ mô tả phương pháp và nhân vật hoạt hình Snoopy, không đưa ra kết quả nghiên cứu.",
        "C": "Snoopy is a cartoon dog with a black patch on its ear, but in one of the altered versions... — Chỉ mô tả chi tiết thiết kế bối cảnh thí nghiệm, không đưa ra kết quả nghiên cứu."
    }
}

enhanced_questions = []

for idx in range(len(q_splits)):
    qnum, start_line, topic = q_splits[idx]
    end_line = q_splits[idx+1][1] if idx + 1 < len(q_splits) else len(lines)
    chunk = lines[start_line:end_line]
    q_data = d['questions'][qnum - 1]
    assert q_data['id'] == qnum
    
    correct_ans = q_data['correct_answer']
    
    mermaid_lines = []
    in_mermaid = False
    guiding_lines = []
    in_guiding = False
    
    for raw_l in chunk:
        l = raw_l.replace('\uec03', '').replace('\uec02', '')
        t = l.strip()
        if re.match(r'^(flowchart|graph)\s+(TD|LR|TB|RL)', t):
            in_mermaid = True
        if in_mermaid:
            if t.startswith('Câu hỏi định hướng'):
                in_mermaid = False
                in_guiding = True
                continue
            else:
                mermaid_lines.append(l)
        elif in_guiding:
            guiding_lines.append(l)
            
    m_code = '\n'.join([x for x in mermaid_lines if x.strip()]).strip()
    
    # Parse options from guiding lines
    opt_map = {}
    current_key = None
    for gl in guiding_lines:
        gt = gl.strip()
        m_opt = re.match(r'^([A-D])\.\s*(.*)', gt)
        if m_opt:
            current_key = m_opt.group(1)
            opt_map[current_key] = m_opt.group(2).strip()
        elif current_key and gt:
            opt_map[current_key] += ' ' + gt
            
    # Apply custom options if present
    if qnum in custom_options_data:
        for k, v in custom_options_data[qnum].items():
            opt_map[k] = v
            
    # Build option_explanations
    option_explanations = {}
    for opt_obj in q_data['options']:
        k = opt_obj['key']
        raw_exp = opt_map.get(k, "")
        if not raw_exp:
            raw_exp = f"{opt_obj['text']} không phù hợp với phân tích logic của câu."
        if k == correct_ans:
            option_explanations[k] = f"✅ ĐÁP ÁN ĐÚNG. {raw_exp}"
        else:
            option_explanations[k] = f"❌ TẠI SAO SAI. {raw_exp}"
            
    # Build pooe_breakdown
    pooe_lines = []
    pooe_lines.append(f"• Đáp án ĐÚNG: [{correct_ans}] — {opt_map.get(correct_ans, '')}")
    for opt_obj in q_data['options']:
        k = opt_obj['key']
        if k != correct_ans:
            pooe_lines.append(f"• Loại [{k}] — {opt_map.get(k, '')}")
    pooe_breakdown = '\n'.join(pooe_lines)
    
    # Extract nodes from Mermaid for 4-tier hints
    match_a = re.search(r'A\["([^"]+)"\]', m_code)
    node_a = match_a.group(1).replace('<br>', ' ').strip() if match_a else ""
    
    # Extract middle and final nodes
    node_labels = []
    for line in m_code.splitlines():
        matches = re.findall(r'\["([^"]+)"\]|\{\{?"([^"]+)"\}\}?', line)
        for m in matches:
            t = (m[0] or m[1]).replace('<br>', ' ').strip()
            if t and t not in node_labels:
                node_labels.append(t)
                
    middle_clues = []
    for n in node_labels:
        if n != node_a and not any(n.startswith(prefix) for prefix in ['Từ cần điền', 'Cấu trúc:', 'Chức năng:', 'Lợi ích', 'Chiến thuật:', 'Quy tắc:', 'Quy tắc', 'Chốt phương pháp']):
            middle_clues.append(n)
            
    final_solution = node_labels[-1] if len(node_labels) > 1 else ""
    
    # Tier 1 Hint: Context & Thinking Direction
    tier1 = f"💡 <strong>Định hướng tư duy & Bối cảnh:</strong> {node_a if node_a else topic}. Đọc kỹ ngữ cảnh để xác định chính xác mục tiêu và mối quan hệ ngữ nghĩa cốt lõi."
    
    # Tier 2 Hint: Structural Clues & Elimination
    if middle_clues:
        clues_str = " | ".join(middle_clues[:3])
        tier2 = f"🔍 <strong>Manh mối cấu trúc & Phân tích loại trừ:</strong> Manh mối chính: {clues_str}. Hãy tự vấn: Phương án nào làm đảo lộn logic, lạc đề hoặc vi phạm cấu trúc ngữ pháp cần thiết?"
    else:
        wrong_keys = [k for k in ['A', 'B', 'C', 'D'] if k != correct_ans]
        tier2 = f"🔍 <strong>Manh mối cấu trúc & Phân tích loại trừ:</strong> Đối chiếu kỹ các phương án [{', '.join(wrong_keys)}] để tìm ra điểm bẫy (sai phạm trù, mâu thuẫn bối cảnh hoặc cấu trúc câu)."
        
    # Tier 3 Hint: Method Lock & Full Solution
    tier3 = f"🎯 <strong>Chốt phương pháp & Đáp án:</strong> {final_solution if final_solution else 'Đối chiếu với quy tắc ngữ pháp và suy luận logic cốt lõi.'} Lựa chọn chính xác duy nhất là <strong>[{correct_ans}]</strong>."
    
    # Tier 4: Strategic Tip
    strat = q_data.get('strategic_tip') or f"Chiến thuật College Board cho {topic}: Luôn loại bỏ các phương án cực đoan hoặc làm thay đổi logic ban đầu của văn bản."
    
    # Assign updates
    q_data['mermaid_diagram'] = m_code
    q_data['tier1_hint'] = tier1
    q_data['level1_tip'] = tier1
    q_data['tier2_hint'] = tier2
    q_data['level2_hint'] = tier2
    q_data['tier3_hint'] = tier3
    q_data['level3_solution'] = tier3
    q_data['option_explanations'] = option_explanations
    q_data['pooe_breakdown'] = pooe_breakdown
    
    enhanced_questions.append(q_data)

# Save back to data/sep2026.json and static/data/sep2026.json
with open('SAT Coach/BluebookOct2026App/data/sep2026.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, ensure_ascii=False, indent=2)

with open('SAT Coach/BluebookOct2026App/static/data/sep2026.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, ensure_ascii=False, indent=2)

print(f"Successfully updated 27 questions in data/sep2026.json and static/data/sep2026.json!")

