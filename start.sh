#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

PORT=8085

# Check if port is already in use, increment if needed
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; do
    PORT=$((PORT+1))
done

echo "=========================================================="
echo "📘 Digital SAT Bluebook App (October 2026 - Real Test B)"
echo "=========================================================="
echo "📍 Thư mục:  $DIR"
echo "🌐 URL chạy cục bộ: http://localhost:$PORT"
echo "👥 Bộ nhớ:  100% localStorage (Mỗi học sinh/máy độc lập)"
echo "=========================================================="

# Ensure database is generated
if [ ! -f "database.json" ]; then
    echo "⚙️ Đang trích xuất dữ liệu từ đề thi October 2026..."
    python3 extract_data.py
fi

# Open browser
(sleep 1 && open "http://localhost:$PORT") &

# Start server
python3 server.py $PORT
