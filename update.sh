#!/bin/bash
  cd /root/BotZiVPN
    timedatectl set-timezone Asia/Jakarta || echo -e "${red}Failed to set timezone to Jakarta${neutral}"
sudo apt remove nodejs -y
sudo apt purge nodejs -y
sudo apt autoremove -y
    if ! dpkg -s nodejs >/dev/null 2>&1; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - || echo -e "${red}Failed to download Node.js setup${neutral}"
        apt-get install -y nodejs || echo -e "${red}Failed to install Node.js${neutral}"
    else
        echo -e "${green}Node.js is already installed, skipping...${neutral}"
    fi

    if [ ! -f /root/BotZiVPN/app.js ]; then
        git clone https://github.com/ziflazz-sketch/BotZIVPN.git /root/BotZiVPN
    fi
apt install jq sqlite3 zip -y
apt install npm pm2 -y
npm install -g npm@latest
npm install -g pm2

    if ! npm list --prefix /root/BotZiVPN express telegraf axios moment sqlite3 >/dev/null 2>&1; then
        npm install --prefix /root/BotZiVPN sqlite3 express crypto telegraf axios dotenv
    fi

    if [ -n "$(ls -A /root/BotZiVPN)" ]; then
        chmod +x /root/BotZiVPN/*
    fi
 wget --connect-timeout=1 --timeout=30 -O .gitattributes "https://raw.githubusercontent.com/ziflazz-sketch/BotZIVPN/main/.gitattributes"
 wget --connect-timeout=1 --timeout=30 -O README.md "https://raw.githubusercontent.com/ziflazz-sketch/BotZIVPN/main/README.md"
 wget --connect-timeout=1 --timeout=30 -O app.js "https://raw.githubusercontent.com/ziflazz-sketch/BotZIVPN/main/app.js"
 wget --connect-timeout=1 --timeout=30 -O cek-port.sh "https://raw.githubusercontent.com/ziflazz-sketch/BotZIVPN/main/cek-port.sh"
 wget --connect-timeout=1 --timeout=30 -O ecosystem.config.js "https://raw.githubusercontent.com/ziflazz-sketch/BotZIVPN/main/ecosystem.config.js"
 wget --connect-timeout=1 --timeout=30 -O package.json "https://raw.githubusercontent.com/ziflazz-sketch/BotZIVPN/main/package.json"
 wget --connect-timeout=1 --timeout=30 -O ss.png "https://raw.githubusercontent.com/ziflazz-sketch/BotZIVPN/main/ss.png"
 wget --connect-timeout=1 --timeout=30 -O ss2.png "https://raw.githubusercontent.com/ziflazz-sketch/BotZIVPN/main/ss2.png"
 wget --connect-timeout=1 --timeout=30 -O start "https://raw.githubusercontent.com/ziflazz-sketch/BotZIVPN/main/start"
 wget --connect-timeout=1 --timeout=30 -O update.sh "https://raw.githubusercontent.com/ziflazz-sketch/BotZIVPN/main/update.sh"
 wget --connect-timeout=1 --timeout=30 -O /root/BotZiVPN/modules/reseller.js "https://raw.githubusercontent.com/ziflazz-sketch/BotZIVPN/main/modules/reseller.js"
 wget --connect-timeout=1 --timeout=30 -O /root/BotZiVPN/modules/create.js "https://raw.githubusercontent.com/ziflazz-sketch/BotZIVPN/main/modules/create.js"
 wget --connect-timeout=1 --timeout=30 -O /root/BotZiVPN/modules/del.js "https://raw.githubusercontent.com/ziflazz-sketch/BotZIVPN/main/modules/del.js"
 wget --connect-timeout=1 --timeout=30 -O /root/BotZiVPN/modules/renew.js "https://raw.githubusercontent.com/ziflazz-sketch/BotZIVPN/main/modules/renew.js"
 wget --connect-timeout=1 --timeout=30 -O /root/BotZiVPN/modules/trial.js "https://raw.githubusercontent.com/ziflazz-sketch/BotZIVPN/main/modules/trial.js"

# stop dulu servicenya
systemctl stop sellzivpn.service

# nonaktifkan supaya tidak jalan saat boot
systemctl disable sellzivpn.service

# hapus file service dari systemd
rm -f /etc/systemd/system/sellzivpn.service

# reload systemd biar bersih
systemctl daemon-reload
systemctl reset-failed


pm2 start ecosystem.config.js
pm2 save

cat >/usr/bin/backup_sellzivpn <<'EOF'
#!/bin/bash
set -euo pipefail

VARS_FILE="/root/BotZiVPN/.vars.json"
DB_FOLDER="/root/BotZiVPN"
TMP_DIR=$(mktemp -d /tmp/backup_sellzivpn.XXXXXX)
TS=$(date +%F-%H%M%S)
ARCHIVE_NAME="backup-sellzivpn-$TS.zip"
ARCHIVE_PATH="$TMP_DIR/$ARCHIVE_NAME"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

if [ ! -f "$VARS_FILE" ]; then
  echo "❌ File $VARS_FILE tidak ditemukan"
  exit 1
fi

BOT_TOKEN=$(jq -r '.BOT_TOKEN // empty' "$VARS_FILE")
USER_ID=$(jq -r '.USER_ID // empty' "$VARS_FILE")

if [ -z "$BOT_TOKEN" ] || [ -z "$USER_ID" ]; then
  echo "❌ BOT_TOKEN atau USER_ID kosong di $VARS_FILE"
  exit 1
fi

command -v sqlite3 >/dev/null 2>&1 || { echo "❌ sqlite3 belum terinstall"; exit 1; }
command -v zip >/dev/null 2>&1 || { echo "❌ zip belum terinstall"; exit 1; }

if [ ! -f "$DB_FOLDER/sellzivpn.db" ]; then
  echo "❌ File sellzivpn.db tidak ditemukan"
  exit 1
fi

sqlite3 "$DB_FOLDER/sellzivpn.db" "PRAGMA wal_checkpoint(TRUNCATE);" >/dev/null 2>&1 || true
sqlite3 "$DB_FOLDER/sellzivpn.db" ".backup '$TMP_DIR/sellzivpn.db'"
sqlite3 "$TMP_DIR/sellzivpn.db" "PRAGMA integrity_check;" | grep -qx "ok" || {
  echo "❌ Integrity check backup gagal"
  exit 1
}

for FILE in trial.db ressel.db .vars.json; do
  if [ -f "$DB_FOLDER/$FILE" ]; then
    cp -f "$DB_FOLDER/$FILE" "$TMP_DIR/$FILE"
  fi
done

(
  cd "$TMP_DIR"
  zip -q "$ARCHIVE_PATH" sellzivpn.db trial.db ressel.db .vars.json 2>/dev/null || true
)

if [ ! -f "$ARCHIVE_PATH" ]; then
  echo "❌ Gagal membuat arsip backup"
  exit 1
fi

curl -s --connect-timeout 5 --max-time 120   -F chat_id="$USER_ID"   -F caption="📦 Backup terbaru ZIFLAZZ ($TS)"   -F document=@"$ARCHIVE_PATH"   "https://api.telegram.org/bot$BOT_TOKEN/sendDocument" >/dev/null 2>&1 || {
    echo "❌ Gagal mengirim arsip backup ke Telegram"
    exit 1
  }

USERS=$(sqlite3 "$TMP_DIR/sellzivpn.db" "SELECT COUNT(*) FROM users;" 2>/dev/null || echo 0)
TX=$(sqlite3 "$TMP_DIR/sellzivpn.db" "SELECT COUNT(*) FROM transactions;" 2>/dev/null || echo 0)
SERVERS=$(sqlite3 "$TMP_DIR/sellzivpn.db" "SELECT COUNT(*) FROM Server;" 2>/dev/null || echo 0)

cat <<MSG
✅ Backup terbaru berhasil dibuat dan dikirim.
📦 Arsip: $ARCHIVE_NAME
👥 Users: $USERS
💳 Transactions: $TX
🌐 Server: $SERVERS
📁 File: sellzivpn.db, trial.db, ressel.db, .vars.json
MSG
EOF

# bikin cron job tiap 1 jam
cat >/etc/cron.d/backup_sellzivpn <<'EOF'
SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
0 0 * * * root /usr/bin/backup_sellzivpn
EOF

chmod +x /usr/bin/backup_sellzivpn
service cron restart

    echo -e "${orange}─────────────────────────────────────────${neutral}"
    echo -e "   ${green}.:::. BOT TELEGRAM UPDATE .:::.   ${neutral}"
    echo -e "${orange}─────────────────────────────────────────${neutral}"
# INPUT UMUM
read -p "Masukkan token bot: " token
while [ -z "$token" ]; do
  echo "Token tidak boleh kosong!"
  read -p "Masukkan token bot: " token
done

read -p "Masukkan admin ID: " adminid
read -p "Masukkan nama store: " namastore
read -p "Masukkan ID GROUP NOTIF: " groupid

# PAYMENT
 echo ""
 echo "Payment Gateway: GoPay"
 read -p "Masukkan GOPAY_KEY: " GOPAY_KEY

 rm -f /root/BotZiVPN/.vars.json
 cat > /root/BotZiVPN/.vars.json <<EOF
{
  "BOT_TOKEN": "$token",
  "USER_ID": "$adminid",
  "NAMA_STORE": "$namastore",
  "GROUP_ID": "$groupid",
  "PORT": "6969",
  "PAYMENT": "GOPAY",
  "GOPAY_KEY": "$GOPAY_KEY"
}
EOF

 echo ""
 echo "✅ Setup selesai!"


cd 