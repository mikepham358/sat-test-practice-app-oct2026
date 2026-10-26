#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

PORT=8085

echo "=========================================================="
echo "🚀 CLOUDFLARE TUNNEL - DIGITAL SAT BLUEBOOK APP"
echo "=========================================================="
echo "🎯 Đề thi: Digital SAT Real Test B (Tháng 10, 2026)"
echo "👥 Học sinh: Mỗi em truy cập trên thiết bị riêng (Phone/Laptop)"
echo "💾 Dữ liệu: 100% localStorage - KHÔNG TRÙNG LẶP / KHÔNG GHI ĐÈ"
echo "=========================================================="

# Ensure database is generated
if [ ! -f "database.json" ]; then
    echo "⚙️ Đang trích xuất dữ liệu từ template..."
    python3 extract_data.py
fi

# Locate or download cloudflared
CLOUDFLARED_BIN=""
if command -v cloudflared &> /dev/null; then
    CLOUDFLARED_BIN="cloudflared"
elif [ -f "$DIR/bin/cloudflared" ]; then
    CLOUDFLARED_BIN="$DIR/bin/cloudflared"
else
    echo "📦 Đang tải cloudflared (bản standalone siêu nhẹ cho macOS)..."
    mkdir -p "$DIR/bin"
    ARCH=$(uname -m)
    if [ "$ARCH" = "arm64" ]; then
        URL="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-arm64.tgz"
    else
        URL="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-amd64.tgz"
    fi
    curl -sL -o "$DIR/bin/cloudflared.tgz" "$URL"
    tar -xzf "$DIR/bin/cloudflared.tgz" -C "$DIR/bin"
    rm -f "$DIR/bin/cloudflared.tgz"
    chmod +x "$DIR/bin/cloudflared"
    CLOUDFLARED_BIN="$DIR/bin/cloudflared"
fi

# Check if local server is already running on PORT
SERVER_PID=""
if ! lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚡ Khởi động máy chủ Bluebook App tại cổng $PORT..."
    python3 server.py $PORT > /dev/null 2>&1 &
    SERVER_PID=$!
    sleep 1
else
    echo "✅ Máy chủ Bluebook App đã hoạt động sẵn tại http://localhost:$PORT"
fi

# Cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Đang dừng Cloudflare Tunnel..."
    if [ -n "$SERVER_PID" ]; then
        kill "$SERVER_PID" 2>/dev/null
    fi
    exit 0
}
trap cleanup SIGINT SIGTERM

echo ""
echo "🌐 Đang tạo đường dẫn HTTPS công khai miễn phí qua Cloudflare..."
echo "📋 Hãy copy link 'https://...trycloudflare.com' dưới đây để gửi cho học sinh:"
echo "----------------------------------------------------------"

# Launch Cloudflare tunnel
"$CLOUDFLARED_BIN" tunnel --url "http://localhost:$PORT"
