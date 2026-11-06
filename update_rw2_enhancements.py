import re, json

# 1. Load latest exported Google Doc text
with open('/tmp/latest_mermaid.txt', 'r', encoding='utf-8') as f:
    raw_lines = f.readlines()

lines = [l.strip() for l in raw_lines]

# Find question splits in Section 3 (starting after line 720)
q_splits = []
for i in range(720, len(lines)):
    line = lines[i]
    m = re.match(r'^Câu\s+(\d+):?\s*(.*)', line)
    if m:
        q_splits.append((int(m.group(1)), i, m.group(2).strip()))

assert len(q_splits) == 27, f"Expected 27 question splits, got {len(q_splits)}"

import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load sep2026.json
data_path = os.path.join(BASE_DIR, 'data/sep2026.json')
with open(data_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Custom definitions for Q10 (table breakdown) and Q16-Q27 (Module 2 actual questions)
custom_data = {
    10: {
        "options": {
            "B": "female that was 17 years old — Dựa trên bảng số liệu về gấu ở Vườn quốc gia Katmai, con số cân nặng nhỏ nhất (lowest approximate weight) là 300 pounds (ID 192). Dóng thẳng sang các cột còn lại ta thấy đây là gấu cái (female) và 17 tuổi (17 years old).",
            "A": "male that was 12 years old — Con gấu đực 12 tuổi (ID 24) có trọng lượng xấp xỉ 575 pounds, không phải là con số nhỏ nhất.",
            "C": "male that was 10 years old — Con gấu đực 10 tuổi (ID 480) có trọng lượng xấp xỉ 750 pounds, là con gấu nặng nhất trong toàn bộ bảng.",
            "D": "female that was 11 years old — Con gấu cái 11 tuổi (ID 854) có trọng lượng xấp xỉ 350 pounds, lớn hơn mức cân nặng nhỏ nhất là 300 pounds."
        }
    },
    16: {
        "mermaid": """flowchart TD
    A["Cấu trúc câu song hành (Parallelism): <br> '...a root begins to grow downward into the soil, <br> and the first shoot starts ______ upward.'"] --> B{"Phân tích vị trí điền khuyết"}
    B --> C["Vế 1: Động từ 'begins' đi kèm to-infinitive: 'to grow'"]
    B --> D["Vế 2: Động từ 'starts' cũng cần dạng tương ứng: 'to grow'"]
    C & D -.-> E["Quy tắc song hành & Cụm động từ: <br> 'starts to grow' tạo sự nhịp nhàng và chuẩn mực ngữ pháp."]
    E -.-> F["Đáp án đúng: to grow (B)"]""",
        "tier1": "💡 <strong>Định hướng tư duy & Bối cảnh:</strong> Nhận diện cấu trúc song hành (Parallel Structure) được nối bởi liên từ 'and': vế 1 là 'begins to grow downward', vế 2 là 'starts ______ upward'.",
        "tier2": "🔍 <strong>Manh mối cấu trúc & Phân tích loại trừ:</strong> Động từ 'starts' ở hiện tại đơn cần kết hợp với dạng nguyên mẫu có 'to' (to grow). Loại các phương án chia thì hoàn thành hoặc chia thừa động từ (had grown, has grown, starts grows).",
        "tier3": "🎯 <strong>Chốt phương pháp & Đáp án:</strong> Cấu trúc song hành hoàn chỉnh bắt buộc phải dùng <strong>[B] to grow</strong>.",
        "options": {
            "B": "to grow — Cấu trúc song hành hoàn hảo: 'begins to grow downward... and starts to grow upward'. Động từ 'starts' ở đây kết hợp với to-infinitive 'to grow' tương đồng với 'begins to grow' ở mệnh đề trước.",
            "A": "had grown — Chia thì quá khứ hoàn thành làm phá vỡ tính đồng nhất về thời gian với thì hiện tại đơn 'absorbs', 'splits', 'begins'.",
            "C": "has grown — Chia thì hiện tại hoàn thành, không tạo được cấu trúc song hành sau động từ 'starts'.",
            "D": "grows — Sau động từ đã chia 'starts', không thể đặt trực tiếp một động từ chia thì 'starts grows'. Bắt buộc phải là dạng nguyên mẫu có to."
        }
    },
    17: {
        "mermaid": """flowchart TD
    A["Chủ ngữ của câu: 'Nonmetallic elements' <br> (Danh từ số nhiều)"] --> B{"Phân tích thành phần câu"}
    B --> C["Vế so sánh phía sau: '...than metallic elements do' <br> (dùng trợ động từ 'do' ở hiện tại đơn số nhiều)"]
    B --> D["Câu đang thiếu ĐỘNG TỪ CHÍNH (Finite Verb) làm vị ngữ!"]
    C & D -.-> E["Động từ chính chia thì hiện tại số nhiều: 'attract' <br> (Các dạng V-ing, to-V là non-finite không làm vị ngữ được)."]
    E -.-> F["Đáp án đúng: attract (B)"]""",
        "tier1": "💡 <strong>Định hướng tư duy & Bối cảnh:</strong> Xác định thành phần nòng cốt của câu. Chủ ngữ 'Nonmetallic elements' cần một động từ chính (finite verb) hoàn chỉnh làm vị ngữ.",
        "tier2": "🔍 <strong>Manh mối cấu trúc & Phân tích loại trừ:</strong> Vế sau có 'than metallic elements do' ở hiện tại đơn số nhiều. Các dạng phân từ hay nguyên mẫu (attracting, having attracted, to attract) không thể làm vị ngữ chính.",
        "tier3": "🎯 <strong>Chốt phương pháp & Đáp án:</strong> Động từ chính chia số nhiều ở thì hiện tại đơn là <strong>[B] attract</strong>.",
        "options": {
            "B": "attract — Động từ chính (finite verb) chia thì hiện tại đơn số nhiều, tương ứng hoàn hảo với chủ ngữ số nhiều 'Nonmetallic elements' và trợ động từ 'do' ở vế đối chiếu.",
            "A": "attracting — Phân từ hiện tại V-ing (non-finite) không thể đứng đơn độc làm động từ chính của câu, gây lỗi thiếu vị ngữ (Sentence Fragment).",
            "C": "having attracted — Phân từ hoàn thành (non-finite), không thể đóng vai trò làm vị ngữ chia thì cho câu.",
            "D": "to attract — Động từ nguyên mẫu có 'to' (infinitive), không thể chia thì làm động từ chính."
        }
    },
    18: {
        "mermaid": """flowchart TD
    A["Mệnh đề quan hệ: '..., items that ______ greatly in demand.'"] --> B{"Xác định Chủ ngữ & Thì"}
    B --> C["Đại từ 'that' thay thế cho danh từ đứng trước: 'items' (Số nhiều)"]
    B --> D["Bối cảnh lịch sử thời cổ đại: 'reigned from 247 BCE to 224 CE', 'profited' <br> ➔ Bắt buộc chia THÌ QUÁ KHỨ."]
    C & D -.-> E["Động từ to-be quá khứ số nhiều: 'were'"]
    E -.-> F["Đáp án đúng: were (C)"]""",
        "tier1": "💡 <strong>Định hướng tư duy & Bối cảnh:</strong> Đại từ quan hệ 'that' thay thế trực tiếp cho danh từ 'items' (số nhiều). Toàn bộ câu đang kể về Đế chế Parthia thời cổ đại (thì quá khứ).",
        "tier2": "🔍 <strong>Manh mối cấu trúc & Phân tích loại trừ:</strong> 'items' là danh từ số nhiều nên to-be phải ở dạng số nhiều. Bối cảnh quá khứ loại các thì hiện tại (is, has been). 'was' là số ít nên bị loại.",
        "tier3": "🎯 <strong>Chốt phương pháp & Đáp án:</strong> To-be ở quá khứ số nhiều phù hợp duy nhất là <strong>[C] were</strong>.",
        "options": {
            "C": "were — Đại từ 'that' bổ nghĩa cho danh từ số nhiều 'items'. Trong bối cảnh lịch sử quá khứ (profited, reigned), to-be bắt buộc phải chia ở dạng quá khứ số nhiều 'were'.",
            "A": "was — To-be số ít 'was' vi phạm quy tắc hòa hợp chủ vị với danh từ số nhiều 'items'.",
            "B": "is — Thì hiện tại đơn số ít, sai cả về thì lịch sử (247 BCE) lẫn số lượng chủ ngữ.",
            "D": "has been — Trợ động từ số ít 'has' sai với 'items', và thì hiện tại hoàn thành không dùng cho đế chế đã suy tàn trong quá khứ."
        }
    },
    19: {
        "mermaid": """flowchart TD
    A["Cụm giải thích xen giữa hai dấu gạch ngang (Em-dash Appositive): <br> '...uses red cedar—a durable and flexible ______ craft baskets...'"] --> B{"Quy tắc Cặp dấu đối xứng"}
    B --> C["Phía trước đã mở bằng DẤU GẠCH NGANG sau 'red cedar—'"]
    B --> D["Phía sau phải ĐÓNG bằng DẤU GẠCH NGANG sau 'material—' <br> trước khi nối vào mục đích 'to craft baskets...'"]
    C & D -.-> E["Quy tắc cặp dấu gạch ngang: red cedar — [a durable and flexible material] — to craft..."]
    E -.-> F["Đáp án đúng: material—to (C)"]""",
        "tier1": "💡 <strong>Định hướng tư duy & Bối cảnh:</strong> Nhận diện cụm thông tin bổ nghĩa (appositive) được bắt đầu bằng một dấu gạch ngang 'red cedar—'.",
        "tier2": "🔍 <strong>Manh mối cấu trúc & Phân tích loại trừ:</strong> Cặp dấu phải đồng nhất: mở bằng gạch ngang thì bắt buộc phải đóng bằng gạch ngang ('material—'). Dấu hai chấm (:), chấm phẩy (;), hay dấu chấm (.) đều phá vỡ cấu trúc câu.",
        "tier3": "🎯 <strong>Chốt phương pháp & Đáp án:</strong> Dấu gạch ngang đóng khép lại cụm phụ ngữ là <strong>[C] material—to</strong>.",
        "options": {
            "C": "material—to — Cụm 'a durable and flexible material' là thành phần chú thích xen ngang được mở đầu bằng dấu gạch ngang 'red cedar—'. Theo quy tắc cặp dấu đối xứng, bắt buộc phải dùng dấu gạch ngang tương ứng ('material—') để khép lại cụm phụ ngữ trước khi tiếp tục câu.",
            "A": "material: to — Dấu hai chấm (:) không bao giờ kết đôi với dấu gạch ngang mở đầu phía trước.",
            "B": "material; to — Dấu chấm phẩy (;) chỉ dùng ngăn cách hai mệnh đề độc lập, không dùng trước cụm infinitive 'to craft'.",
            "D": "material. To — Biến vế sau thành câu què thiếu vị ngữ (Sentence Fragment)."
        }
    },
    20: {
        "mermaid": """flowchart TD
    A["Chủ ngữ: 'the lions of the Mapogo [coalition]'"] --> B{"Cụm liệt kê xen ngang (Parenthetical list)"}
    B --> C["Cụm liệt kê: '...including Kinky Tail, Mr. T, and Makhulu—' <br> được ĐÓNG bằng DẤU GẠCH NGANG '—' trước động từ 'thrived'"]
    B --> D["Quy tắc cặp dấu: Cụm này bắt buộc phải MỞ bằng DẤU GẠCH NGANG 'coalition—'"]
    C & D -.-> E["Cặp gạch ngang hoàn chỉnh: Mapogo coalition — [including...] — thrived within..."]
    E -.-> F["Đáp án đúng: coalition— (A)"]""",
        "tier1": "💡 <strong>Định hướng tư duy & Bối cảnh:</strong> Nhìn về phía sau cụm liệt kê, ta thấy dấu gạch ngang 'Makhulu—' ngay trước động từ chính 'thrived'.",
        "tier2": "🔍 <strong>Manh mối cấu trúc & Phân tích loại trừ:</strong> Cụm phụ ngữ xen giữa chủ ngữ và vị ngữ được đóng bằng gạch ngang thì ở đầu cụm bắt buộc phải mở bằng gạch ngang. Dùng dấu phẩy hoặc chấm phẩy sẽ bị lệch pha dấu câu.",
        "tier3": "🎯 <strong>Chốt phương pháp & Đáp án:</strong> Mở đầu cụm chú thích bằng dấu gạch ngang tương ứng là <strong>[A] coalition—</strong>.",
        "options": {
            "A": "coalition— — Cụm liệt kê 'including Kinky Tail, Mr. T, and Makhulu' là cụm giải thích được đóng bằng dấu gạch ngang '—' trước động từ 'thrived'. Phía trước cụm này ('coalition—') bắt buộc phải mở đầu bằng dấu gạch ngang để tạo thành cặp dấu chuẩn mực.",
            "B": "coalition, — Mở bằng phẩy nhưng đóng bằng gạch ngang là lỗi cọc cạch dấu câu (mismatched punctuation).",
            "C": "coalition — Không có dấu câu làm cụm chú thích dính chặt vào danh từ, sai cấu trúc.",
            "D": "coalition; — Dấu chấm phẩy không được dùng xen giữa chủ ngữ và vị ngữ chính của câu."
        }
    },
    21: {
        "mermaid": """flowchart TD
    A["Mệnh đề 1: 'This comprehensive resource was first published in 2003, <br> revolutionizing the field of economic research.'"] --> B{"Phân tích mệnh đề 2"}
    B --> C["Mệnh đề 2: 'Before its release, gaps in historical records hindered researchers...' <br> (Một câu độc lập hoàn chỉnh có đủ Chủ và Vị)"]
    C & D -.-> E["Ranh giới hai câu độc lập: <br> Bắt buộc phải ngắt bằng DẤU CHẤM (.) trước 'Before'."]
    E -.-> F["Đáp án đúng: 2003, revolutionizing... Before (B)"]""",
        "tier1": "💡 <strong>Định hướng tư duy & Bối cảnh:</strong> Phân tích ranh giới giữa hai mệnh đề độc lập. Mệnh đề 2 bắt đầu bằng cụm trạng ngữ thời gian 'Before its release, gaps in historical records hindered...'.",
        "tier2": "🔍 <strong>Manh mối cấu trúc & Phân tích loại trừ:</strong> Mệnh đề phân từ ', revolutionizing...' bổ nghĩa cho hành động xuất bản năm 2003. Sau đó bắt buộc phải có dấu chấm để kết thúc câu. Không dùng dấu phẩy (lỗi Comma Splice) hoặc bỏ dấu (lỗi Run-on).",
        "tier3": "🎯 <strong>Chốt phương pháp & Đáp án:</strong> Cấu trúc chuẩn ngữ pháp là <strong>[B] 2003, revolutionizing... Before</strong>.",
        "options": {
            "B": "2003, revolutionizing the field of economic research. Before — Cụm phân từ ', revolutionizing...' bổ nghĩa hoàn hảo cho việc xuất bản cuốn sách năm 2003. Sau đó, một dấu chấm (.) là bắt buộc để kết thúc câu, mở ra câu độc lập hoàn chỉnh mới 'Before its release, gaps in historical records hindered researchers...'.",
            "A": "2003. Revolutionizing... — Cắt dấu chấm ngay sau 2003 biến cụm 'Revolutionizing...' thành một câu què (fragment).",
            "C": "2003, revolutionizing... before — Thiếu dấu chấm ngắt câu giữa hai mệnh đề độc lập tạo lỗi Run-on.",
            "D": "2003, revolutionizing... , before — Dùng dấu phẩy nối hai mệnh đề độc lập phạm lỗi Comma Splice."
        }
    },
    22: {
        "mermaid": """flowchart TD
    A["Hành động 1: Rùa con mổ vỏ trứng và chui ra khỏi tổ cát <br> ('broke free from their eggs and emerged from their sandy nest')"] --> B{"Trình tự thời gian (Chronological Order)"}
    B --> C["Hành động 2: Chúng bắt đầu cuộc hành trình băng qua bãi biển về phía đại dương <br> ('they began their journey across the beach toward the ocean')"]
    C & D -.-> D["Từ nối diễn tả sự việc xảy ra TIẾP THEO: <br> 'Then,' (Sau đó / Tiếp đó)"]
    D -.-> E["Đáp án đúng: Then, (C)"]""",
        "tier1": "💡 <strong>Định hướng tư duy & Bối cảnh:</strong> Xác định mối quan hệ logic giữa hai câu: hành động 1 (nở và chui khỏi tổ cát) và hành động 2 (bắt đầu bò về phía biển).",
        "tier2": "🔍 <strong>Manh mối cấu trúc & Phân tích loại trừ:</strong> Đây là chuỗi diễn tiến theo trình tự thời gian (sequence). 'For example' (ví dụ), 'Previously' (trước đó), 'Instead' (thay vào đó) đều làm sai lệch logic.",
        "tier3": "🎯 <strong>Chốt phương pháp & Đáp án:</strong> Từ nối diễn đạt trình tự tiếp nối phù hợp nhất là <strong>[C] Then,</strong>.",
        "options": {
            "C": "Then, (Sau đó) — Thể hiện trình tự thời gian tự nhiên: rùa biển nở và chui lên khỏi tổ cát, sau đó (then) chúng bắt đầu hành trình bò về phía biển.",
            "A": "For example, (Ví dụ) — Hành động bò ra biển không phải là một ví dụ minh họa cho hành vi chui ra khỏi tổ trứng.",
            "B": "Previously, (Trước đó) — Hành trình bò ra biển diễn ra sau khi nở chứ không thể xảy ra 'trước đó'.",
            "D": "Instead, (Thay vào đó) — Không có sự thay thế hay mâu thuẫn đối lập giữa hai hành vi nối tiếp nhau này."
        }
    },
    23: {
        "mermaid": """flowchart TD
    A["Hành động: Phục vụ trên chiến hạm USS Mohican trong thời kỳ Nội chiến Hoa Kỳ"] --> B{"Mối quan hệ Nhân quả / Hành động mang lại kết quả"}
    B --> C["Kết quả đạt được: Ghi tên mình vào lịch sử Hoa Kỳ <br> là một trong số ít binh sĩ gốc Hoa tham chiến"]
    C & D -.-> D["Từ nối chỉ kết quả thông qua hành động: <br> 'in doing so,' (nhờ làm như vậy / bằng hành động đó)"]
    D -.-> E["Đáp án đúng: in doing so, (C)"]""",
        "tier1": "💡 <strong>Định hướng tư duy & Bối cảnh:</strong> Xem xét hành động phục vụ trong Hải quân (vế trước) và kết quả được ghi danh vào lịch sử nước Mỹ (vế sau).",
        "tier2": "🔍 <strong>Manh mối cấu trúc & Phân tích loại trừ:</strong> 'in doing so' có nghĩa là 'chính nhờ hành động đó'. Các từ nối 'usually' (thường thường), 'in any case' (dù sao đi nữa), 'for instance' (ví dụ) không thể hiện mối quan hệ nhân quả tích cực này.",
        "tier3": "🎯 <strong>Chốt phương pháp & Đáp án:</strong> Cụm từ nối hệ quả phương thức chuẩn xác là <strong>[C] in doing so,</strong>.",
        "options": {
            "C": "in doing so, (nhờ làm như vậy / bằng hành động đó) — Thể hiện mối quan hệ nhân quả trực tiếp: chính nhờ việc phục vụ trên chiến hạm USS Mohican mà Joseph Daily đã ghi tên mình vào lịch sử.",
            "A": "usually, (thường thường) — Việc ghi danh vào lịch sử của một cá nhân là sự kiện độc nhất, không thể miêu tả bằng tính chất thường xuyên lặp lại.",
            "B": "in any case, (dù sao đi nữa) — Dùng để chuyển ý nhượng bộ, không khớp với kết quả tích cực mang tính nhân quả.",
            "D": "for instance, (ví dụ) — Việc được ghi danh vào lịch sử là hệ quả vinh dự của hành động phục vụ, không phải là ví dụ minh họa."
        }
    },
    24: {
        "mermaid": """flowchart TD
    A["Ví dụ 1: Máy bay phản lực Cessna 310 có mũi thuôn mượt (streamlined) <br> lướt gió dễ dàng (tính khí động học cao)"] --> B{"Mối quan hệ Tương phản / Đối chiếu"}
    B --> C["Ví dụ 2: Xe tải đầu kéo hình hộp (boxy semitruck) <br> bị cản gió nhiều hơn (ít tính khí động học)"]
    C & D -.-> D["Từ nối đối chiếu hai mặt tương phản: <br> 'On the other hand,' (Mặt khác)"]
    D -.-> E["Đáp án đúng: On the other hand, (B)"]""",
        "tier1": "💡 <strong>Định hướng tư duy & Bối cảnh:</strong> So sánh hai đối tượng phương tiện: câu trước là chiếc phi cơ thuôn nhọn lướt gió tốt, câu sau là chiếc xe tải cồng kềnh hình hộp cản gió nhiều.",
        "tier2": "🔍 <strong>Manh mối cấu trúc & Phân tích loại trừ:</strong> Hai ví dụ mang tính chất đối nghịch nhau hoàn toàn về độ khí động học (aerodynamic). Cần một từ nối thể hiện sự tương phản rõ rệt: 'On the other hand'. Loại 'Specifically' (cụ thể), 'In conclusion' (kết luận), 'As a result' (kết quả).",
        "tier3": "🎯 <strong>Chốt phương pháp & Đáp án:</strong> Cụm từ nối tương phản đối lập chính xác là <strong>[B] On the other hand,</strong>.",
        "options": {
            "B": "On the other hand, (Mặt khác) — Đặt hai đối tượng trái ngược vào thế đối chiếu: một bên là máy bay thuôn mượt lướt gió tốt, mặt khác (on the other hand) là xe tải hình hộp cản gió nhiều.",
            "A": "Specifically, (Cụ thể là) — Chiếc xe tải cản gió nhiều không phải là sự cụ thể hóa cho việc chiếc máy bay lướt gió dễ dàng.",
            "C": "In conclusion, (Tóm lại) — Câu này chỉ đang đưa ra một đối tượng so sánh đối lập, không phải là kết luận tổng quát của đoạn.",
            "D": "As a result, (Kết quả là) — Chiếc xe tải bị cản gió không phải là hệ quả do chiếc máy bay lướt gió tạo ra."
        }
    },
    25: {
        "mermaid": """flowchart TD
    A["Câu trước nêu địa điểm cụ thể: <br> 'the Sun-Earth L1 Lagrange point—a position directly between Earth and the Sun'"] --> B{"Mối quan hệ Quy chiếu Không gian"}
    B --> C["Câu sau mô tả tính chất vật lý TẠI VỊ TRÍ ĐÓ: <br> lực hấp dẫn đạt trạng thái cân bằng đặc biệt"]
    C & D -.-> D["Từ nối quy chiếu không gian nơi chốn: <br> 'There,' (Tại đó / Tại nơi đó)"]
    D -.-> E["Đáp án đúng: There, (A)"]""",
        "tier1": "💡 <strong>Định hướng tư duy & Bối cảnh:</strong> Để ý cuối câu trước kết thúc bằng một vị trí không gian cụ thể: 'the Sun-Earth L1 Lagrange point—a position directly between Earth and the Sun'.",
        "tier2": "🔍 <strong>Manh mối cấu trúc & Phân tích loại trừ:</strong> Câu sau mô tả trạng thái cân bằng lực hấp dẫn diễn ra ngay tại vị trí đó. 'There' (tại nơi đó) quy chiếu chính xác về địa điểm vừa được xác định.",
        "tier3": "🎯 <strong>Chốt phương pháp & Đáp án:</strong> Trạng từ chỉ nơi chốn liên kết phù hợp nhất là <strong>[A] There,</strong>.",
        "options": {
            "A": "There, (Tại nơi đó) — Trạng từ chỉ nơi chốn quy chiếu trực tiếp về vị trí vừa được nhắc đến ở câu trước: điểm Lagrange L1 giữa Trái Đất và Mặt Trời.",
            "B": "For example, (Ví dụ) — Trạng thái cân bằng hấp dẫn không phải là một ví dụ minh họa cho vị trí điểm L1, mà là đặc tính vật lý diễn ra tại đó.",
            "C": "Admittedly, (Phải thừa nhận rằng) — Dùng cho sự nhượng bộ, không phù hợp khi giải thích cơ chế khoa học.",
            "D": "Regardless, (Bất kể thế nào) — Dùng khi phủ nhận một rào cản, không có tính gắn kết với thông tin địa điểm trước đó."
        }
    },
    26: {
        "mermaid": """flowchart TD
    A["Yêu cầu mục tiêu (Goal): <br> GIẢI THÍCH tàu thương mại là gì VÀ ĐƯA RA VÍ DỤ. <br> ('explain what a merchant vessel is and provide examples')"] --> B{"Lọc dữ liệu từ Notes"}
    B --> C["Định nghĩa: 'A merchant vessel is any ship hired to carry cargo or passengers.'"]
    B --> D["Ví dụ minh họa: 'bulk carriers, cruise liners, and oil tankers.'"]
    C & D -.-> E["Chiến thuật: Lựa chọn đúng BẮT BUỘC phải chứa đồng thời cả hai vế: <br> (1) Định nghĩa ('is any ship...') + (2) Ví dụ ('like bulk carriers...')"]
    E -.-> F["Đáp án đúng: B"]""",
        "tier1": "💡 <strong>Định hướng tư duy & Bối cảnh:</strong> Đề bài yêu cầu đồng thời 2 mục tiêu: (1) giải thích tàu thương mại là gì (explain what a merchant vessel is) VÀ (2) cung cấp ví dụ (provide examples).",
        "tier2": "🔍 <strong>Manh mối cấu trúc & Phân tích loại trừ:</strong> Lựa chọn A chỉ nói về số lượng tàu và tải trọng ở Cyprus. Lựa chọn C chỉ nói về tàu đăng ký ở Cyprus. Lựa chọn D chỉ nói về đơn vị đo DWT. Chỉ có B tích hợp cả định nghĩa và ví dụ.",
        "tier3": "🎯 <strong>Chốt phương pháp & Đáp án:</strong> Câu đáp ứng đầy đủ cả định nghĩa và ví dụ là <strong>[B]</strong>.",
        "options": {
            "B": "A merchant vessel is any ship hired to carry cargo or passengers—like bulk carriers, cruise liners, and oil tankers. — Đáp ứng đầy đủ 100% hai yêu cầu của đề bài: vừa định nghĩa bản chất tàu thương mại ('any ship hired to carry cargo or passengers'), vừa cung cấp ví dụ minh họa cụ thể ('like bulk carriers, cruise liners, and oil tankers').",
            "A": "In total, Cyprus’s 1,051 merchant vessels... — Chỉ nêu số liệu tải trọng tàu ở Cyprus năm 2021, không hề định nghĩa cũng như không đưa ra ví dụ các loại tàu.",
            "C": "There were a total of 1,051 ships hired to carry cargo or passengers registered in Cyprus in 2021. — Tập trung vào số lượng tàu đăng ký ở Cyprus, không đưa ra ví dụ các loại tàu.",
            "D": "The carrying capacity of bulk carriers, cruise liners, and oil tankers is measured in deadweight tonnage. — Nói về đơn vị đo tải trọng (DWT), không định nghĩa tàu thương mại là gì."
        }
    },
    27: {
        "mermaid": """flowchart TD
    A["Yêu cầu mục tiêu (Goal): <br> NHẤN MẠNH SỰ KHÁC BIỆT giữa quintidi và decadi. <br> ('emphasize a difference between quintidi and decadi')"] --> B{"Tìm điểm khác biệt trong Notes"}
    B --> C["Quintidi: Đặt tên vinh danh ĐỘNG VẬT (animal - ví dụ: con bò 'ox')"]
    B --> D["Decadi: Đặt tên vinh danh NÔNG CỤ (agricultural tool - ví dụ: cái nia sảy 'winnowing fan')"]
    C & D -.-> E["Chiến thuật: Câu trả lời chuẩn phải đặt cả 2 ngày cạnh nhau <br> với từ nối tương phản đối chiếu (whereas / while)"]
    E -.-> F["Đáp án đúng: D"]""",
        "tier1": "💡 <strong>Định hướng tư duy & Bối cảnh:</strong> Mục tiêu đề bài: nhấn mạnh sự khác biệt giữa hai ngày 'quintidi' và 'decadi' trong lịch Cộng hòa Pháp.",
        "tier2": "🔍 <strong>Manh mối cấu trúc & Phân tích loại trừ:</strong> Trong Notes, quintidi được đặt theo tên động vật (animal - con bò bœuf), còn decadi được đặt theo tên nông cụ (agricultural tool - cái nia van). Câu đúng phải so sánh đối chiếu trực tiếp cả 2 đối tượng bằng từ nối tương phản 'whereas'.",
        "tier3": "🎯 <strong>Chốt phương pháp & Đáp án:</strong> Lựa chọn nêu bật sự tương phản đối chiếu giữa quintidi và decadi là <strong>[D]</strong>.",
        "options": {
            "D": "Each quintidi in the calendar honored an animal, such as the ox, whereas each decadi honored an agricultural tool, such as the winnowing fan. — Nêu bật sự khác biệt bản chất một cách trọn vẹn bằng liên từ đối lập 'whereas': một bên vinh danh loài vật (ox), một bên vinh danh nông cụ (winnowing fan).",
            "A": "Each decadi was named after an agricultural tool... — Chỉ nói riêng về ngày decadi, không hề nhắc đến quintidi để tạo ra sự so sánh hay khác biệt.",
            "B": "There were ten days in each week... — Chỉ nêu số ngày trong tuần và sự tồn tại của hai ngày này, không nói lên sự khác biệt giữa chúng.",
            "C": "One quintidi during the month of Vendémiaire was named after an animal... — Chỉ nói riêng về ngày quintidi, không nhắc đến decadi."
        }
    }
}

# Process all 27 questions in RW Module 2 (IDs 28 to 54)
rw2_start_id = 28
updated_count = 0

for idx in range(len(q_splits)):
    qnum, start_line, topic = q_splits[idx]
    target_id = rw2_start_id + idx
    
    # Locate question object in sep2026.json
    q_data = None
    for q in data['questions']:
        if q['id'] == target_id:
            q_data = q
            break
            
    assert q_data is not None, f"Could not find question id={target_id}"
    correct_ans = q_data['correct_answer']
    
    # If custom override exists (for Q10 or Q16-Q27)
    if qnum in custom_data and "mermaid" in custom_data[qnum]:
        override = custom_data[qnum]
        m_code = override["mermaid"]
        tier1 = override["tier1"]
        tier2 = override["tier2"]
        tier3 = override["tier3"]
        opt_map = override["options"]
    else:
        # Parse from latest_mermaid.txt chunk
        end_line = q_splits[idx+1][1] if idx + 1 < len(q_splits) else len(lines)
        chunk = raw_lines[start_line:end_line]
        
        mermaid_lines = []
        in_mermaid = False
        guiding_lines = []
        in_guiding = False
        
        for raw_l in chunk:
            l = raw_l.replace('\uec03', '').replace('\uec02', '').strip()
            if re.match(r'^(flowchart|graph)\s+(TD|LR|TB|RL)', l):
                in_mermaid = True
            if in_mermaid:
                if 'Câu hỏi định hướng' in l or 'Câu hỏi phân tích' in l or 'Định hướng phân tích' in l:
                    in_mermaid = False
                    in_guiding = True
                    continue
                else:
                    mermaid_lines.append(raw_l.replace('\uec03', '').replace('\uec02', ''))
            elif in_guiding:
                guiding_lines.append(raw_l.replace('\uec03', '').replace('\uec02', ''))
                
        m_code = ''.join(mermaid_lines).strip()
        
        # Options from guiding lines
        opt_map = {}
        current_key = None
        for gl in guiding_lines:
            gt = gl.strip()
            m_opt = re.match(r'^\*?\s*([A-D])\.\s*(.*)', gt)
            if m_opt:
                current_key = m_opt.group(1)
                opt_map[current_key] = m_opt.group(2).strip()
            elif current_key and gt:
                opt_map[current_key] += ' ' + gt
                
        # Check custom options (e.g. Q10)
        if qnum in custom_data and "options" in custom_data[qnum]:
            for k, v in custom_data[qnum]["options"].items():
                opt_map[k] = v
                
        # Extract node A and middle clues from Mermaid
        match_a = re.search(r'A\["([^"]+)"\]', m_code)
        node_a = match_a.group(1).replace('<br>', ' ').strip() if match_a else ""
        
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

    # Build option_explanations
    option_explanations = {}
    for opt_obj in q_data['options']:
        k = opt_obj['key']
        raw_exp = opt_map.get(k, "")
        if not raw_exp:
            raw_exp = f"{opt_obj['text']} không phù hợp với phân tích logic của câu."
        if raw_exp.startswith("✅") or raw_exp.startswith("❌"):
            option_explanations[k] = raw_exp
        elif k == correct_ans:
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
    
    # Assign fields to question
    q_data['mermaid_diagram'] = m_code
    q_data['tier1_hint'] = tier1
    q_data['level1_tip'] = tier1
    q_data['tier2_hint'] = tier2
    q_data['level2_hint'] = tier2
    q_data['tier3_hint'] = tier3
    q_data['level3_solution'] = tier3
    q_data['option_explanations'] = option_explanations
    q_data['pooe_breakdown'] = pooe_breakdown
    
    updated_count += 1
    print(f"Updated Q{qnum} (id={target_id}): mermaid_len={len(m_code)}, opts={len(option_explanations)}")

assert updated_count == 27, f"Expected 27 updated questions, got {updated_count}"

# Save to data/sep2026.json and static/data/sep2026.json
with open(os.path.join(BASE_DIR, 'data/sep2026.json'), 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open(os.path.join(BASE_DIR, 'static/data/sep2026.json'), 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("\nSUCCESS! Successfully updated all 27 questions of RW Module 2 in both JSON files!")
