<div align="center">

# ⚡ Bot ZiVPN ZIFLAZZ

Bot Telegram auto order untuk layanan **ZiVPN / SSH UDP** dengan fitur **create akun, trial, renew, hapus akun, top up saldo, reseller, cek server, bonus top up, akun saya, dan backup admin yang lebih akurat**.

<p>
  <img src="https://img.shields.io/badge/Node.js-18%2B-3C873A?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Telegram-Bot-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram" />
  <img src="https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/Payment-GoPay_QRIS-00AA13?style=for-the-badge" alt="GoPay QRIS" />
</p>

<p>
  <img src="./ss.png" alt="Preview Bot ZiVPN" width="720" />
</p>

</div>

---

## ✨ Highlights

- 🔐 **Create akun ZiVPN / SSH UDP otomatis**
- 🎁 **Trial akun** dengan tampilan hasil yang rapi
- ♻️ **Renew akun** langsung dari bot
- ❌ **Hapus akun** langsung ke server
- 💰 **Top up saldo** dengan **GoPay QRIS otomatis**
- 👥 **Sistem reseller** dan **broadcast reseller**
- 📶 **Cek server otomatis** dari database
- 🎁 **Bonus top up** yang bisa diatur admin
- 📂 **Akun Saya** untuk melihat akun aktif
- ⚙️ **Admin tools** untuk kelola user, saldo, server, dan broadcast

---

## 📚 Daftar Isi

- [🚀 Instalasi Otomatis](#-instalasi-otomatis)
- [🔄 Update Source](#-update-source)
- [💳 Metode Pembayaran](#-metode-pembayaran)
- [🧩 Fitur Utama](#-fitur-utama)
- [🗂️ Struktur Singkat Project](#️-struktur-singkat-project)
- [🛠️ Backup, Restore, dan Update Database](#️-backup-restore-dan-update-database)
- [❗ Troubleshooting](#-troubleshooting)
- [❓ FAQ](#-faq)
- [🖼️ Preview Tambahan](#️-preview-tambahan)

---

## 🚀 Instalasi Otomatis

Jalankan command berikut di **VPS baru**:

```bash
sysctl -w net.ipv6.conf.all.disable_ipv6=1 && sysctl -w net.ipv6.conf.default.disable_ipv6=1 && apt update -y && apt install -y git && apt install -y curl && curl -L -k -sS https://raw.githubusercontent.com/ziflazz-sketch/BotZIVPN/main/start -o start && bash start sellzivpn && [ $? -eq 0 ] && rm -f start
```

### Keterangan
- Script akan mengambil source dari repository GitHub
- Instalasi ini cocok untuk **fresh VPS**
- Untuk bot yang **sudah aktif**, gunakan metode **update source** di bawah

---

## 🔄 Update Source

Gunakan command ini untuk update source dari repository:

```bash
curl -s --connect-timeout 1 --max-time 3 -sL https://raw.githubusercontent.com/ziflazz-sketch/BotZIVPN/main/update.sh -o update.sh && chmod +x update.sh && bash update.sh
```

### Versi aman untuk bot yang sudah aktif

Jika bot sudah berjalan dan ingin update source tanpa kehilangan data utama:

```bash
cd /root && cp -r BotZiVPN BotZiVPN-backup-$(date +%F-%H%M%S) && rm -rf BotZiVPN-new && git clone https://github.com/ziflazz-sketch/BotZIVPN.git BotZiVPN-new && cp /root/BotZiVPN/.vars.json /root/BotZiVPN-new/ 2>/dev/null && cp /root/BotZiVPN/sellzivpn.db /root/BotZiVPN-new/ 2>/dev/null && cp /root/BotZiVPN/ressel.db /root/BotZiVPN-new/ 2>/dev/null && cp /root/BotZiVPN/trial.db /root/BotZiVPN-new/ 2>/dev/null && cd /root/BotZiVPN-new && npm install && cd /root && mv BotZiVPN BotZiVPN-old-running && mv BotZiVPN-new BotZiVPN && pm2 restart sellzivpn --update-env && pm2 logs --lines 50
```

> **Catatan:** file data utama yang tetap dipertahankan:
> - `.vars.json`
> - `sellzivpn.db`
> - `ressel.db`
> - `trial.db`

---

## 💳 Metode Pembayaran

### Auto Payment
Bot mendukung **GoPay QRIS otomatis**.

#### Konfigurasi penting
Isi konfigurasi payment di file `.vars.json`:

```json
"PAYMENT": "GOPAY",
"GOPAY_KEY": "ISI_TOKEN_GOPAY_KAMU"
```

### Ringkasan alur payment
- Bot generate QRIS GoPay otomatis
- User scan dan bayar
- Bot cek status pembayaran otomatis
- Jika sukses, saldo user bertambah otomatis

### Catatan
- Pastikan `GOPAY_KEY` valid
- Jika `GROUP_ID` salah, notifikasi grup bisa gagal
- Pending deposit lama sebaiknya tidak dipakai untuk testing setelah migrasi besar

---

## 🧩 Fitur Utama

| Fitur | Keterangan |
|---|---|
| Create Akun | Membuat akun ZiVPN / SSH UDP otomatis |
| Trial Akun | Trial akun dengan durasi yang diatur bot |
| Renew Akun | Perpanjang akun langsung dari bot |
| Hapus Akun | Hapus akun ke server |
| Akun Saya | Menampilkan akun aktif milik user |
| Top Up Saldo | Top up saldo otomatis via GoPay QRIS |
| Bonus Top Up | Bonus saldo berdasarkan persen dari admin |
| Reseller | Pendaftaran dan pengelolaan reseller |
| Broadcast Reseller | Kirim pesan khusus reseller |
| Cek Server | Cek status server dari database |
| Help Admin | Command admin untuk saldo, broadcast, dan server |

---

## 🗂️ Struktur Singkat Project

```text
BotZiVPN/
├── app.js
├── start
├── update.sh
├── ecosystem.config.js
├── package.json
├── .vars.json
├── sellzivpn.db
├── ressel.db
├── trial.db
└── modules/
    ├── create.js
    ├── renew.js
    ├── del.js
    ├── trial.js
    ├── reseller.js
    └── zivpnApi.js
```

### File penting
- `app.js` → inti bot Telegram
- `modules/` → logic create, trial, renew, delete
- `.vars.json` → konfigurasi bot
- `sellzivpn.db` → database utama
- `ressel.db` → daftar reseller
- `trial.db` → data trial user

---

# 🛠️ Backup, Restore, dan Update Database


## 0) Backup Terbaru dari `/helpadmin`

Command **`/backup`** pada bot sudah diperbarui agar mengambil **snapshot data terbaru saat command dijalankan**.

### Isi file backup
- `sellzivpn.db`
- `ressel.db`
- `trial.db`
- `.vars.json`

### Cara kerja `/backup`
1. Bot menjalankan checkpoint SQLite terlebih dahulu
2. Bot membuat snapshot database terbaru
3. Bot mengumpulkan file penting lainnya
4. Semua file dikemas menjadi **1 file ZIP**
5. File ZIP dikirim ke admin

### Catatan penting
- Backup ini lebih akurat daripada sekadar copy file database mentah
- Cocok dipakai untuk simpan backup harian atau sebelum update source besar
- Tetap disarankan melakukan restore dengan bot dalam kondisi **stop**

---

## 1) Restore `sellzivpn.db` via Termius

Panduan ini dipakai untuk restore backup database `sellzivpn.db` dengan aman agar bot tidak restart loop dan meminimalkan risiko database korup.

### Hal penting sebelum restore
- Stop bot terlebih dahulu
- Upload file backup dengan **nama sementara**
- Cek integritas file backup sebelum dipakai
- Backup file database aktif sebelum mengganti file

### Nama file yang disarankan
- `sellzivpn.db` → database aktif
- `sellzivpn.restore.db` → file backup yang baru diupload
- `sellzivpn.db.bak-TANGGAL` → backup database sebelumnya

### Langkah lengkap restore

#### 1. Stop bot
```bash
pm2 stop sellzivpn
```

#### 2. Upload file backup via Termius
Upload ke folder berikut:

```text
/root/BotZiVPN/
```

Lalu beri nama file backup yang baru diupload, misalnya:

```text
sellzivpn.restore.db
```

#### 3. Masuk ke folder bot
```bash
cd /root/BotZiVPN
```

#### 4. Cek file backup
```bash
ls -lh sellzivpn*.db
```

#### 5. Install `sqlite3` jika belum ada
```bash
apt update -y && apt install -y sqlite3
```

#### 6. Cek integritas file backup
```bash
sqlite3 sellzivpn.restore.db "PRAGMA integrity_check;"
```

Jika hasilnya:

```text
ok
```

berarti file sehat dan aman dipakai.

#### 7. Backup database aktif
```bash
cp sellzivpn.db sellzivpn.db.bak-$(date +%F-%H%M%S)
```

#### 8. Hapus file pendamping SQLite jika ada
```bash
rm -f sellzivpn.db-wal sellzivpn.db-shm
```

#### 9. Ganti database aktif
```bash
mv sellzivpn.restore.db sellzivpn.db
```

#### 10. Jalankan bot lagi
```bash
pm2 start sellzivpn
```

Atau jika proses PM2 sudah ada:

```bash
pm2 restart sellzivpn
```

#### 11. Cek isi database aktif
```bash
python3 - << 'PY'
import sqlite3

db = sqlite3.connect('sellzivpn.db')
cur = db.cursor()
for table in ['users','transactions','Server','pending_deposits']:
    try:
        cur.execute(f"SELECT COUNT(*) FROM {table}")
        print(table, cur.fetchone()[0])
    except Exception as e:
        print(table, 'ERROR:', e)
PY
```

#### 12. Cek log bot
```bash
pm2 logs --lines 50
```

### Versi singkat — tinggal copy paste
> Pastikan file backup sudah diupload ke `/root/BotZiVPN/sellzivpn.restore.db`

```bash
pm2 stop sellzivpn && cd /root/BotZiVPN && apt update -y && apt install -y sqlite3 && sqlite3 sellzivpn.restore.db "PRAGMA integrity_check;" && cp sellzivpn.db sellzivpn.db.bak-$(date +%F-%H%M%S) && rm -f sellzivpn.db-wal sellzivpn.db-shm && mv sellzivpn.restore.db sellzivpn.db && pm2 start sellzivpn && pm2 logs --lines 50
```

---

## 2) Restore `ressel.db`

Gunakan langkah berikut jika ingin mengganti daftar reseller:

```bash
pm2 stop sellzivpn && cd /root/BotZiVPN && cp ressel.db ressel.db.bak-$(date +%F-%H%M%S) && cp /root/ressel.db /root/BotZiVPN/ressel.db && pm2 start sellzivpn
```

---

## 3) Restore `trial.db`

Gunakan langkah berikut jika ingin mengganti data trial user:

```bash
pm2 stop sellzivpn && cd /root/BotZiVPN && cp trial.db trial.db.bak-$(date +%F-%H%M%S) && cp /root/trial.db /root/BotZiVPN/trial.db && pm2 start sellzivpn
```

---

## 4) Cek Database Aktif

Untuk memastikan bot membaca database yang benar:

```bash
cd /root/BotZiVPN && python3 - << 'PY'
import sqlite3

db = sqlite3.connect('sellzivpn.db')
cur = db.cursor()
for table in ['users','transactions','Server','pending_deposits','app_settings']:
    try:
        cur.execute(f"SELECT COUNT(*) FROM {table}")
        print(table, cur.fetchone()[0])
    except Exception as e:
        print(table, 'ERROR:', e)
PY
```

---

## 5) Jika Bot Restart Loop / Database Korup

Jika muncul error seperti:

```text
SQLITE_CORRUPT: database disk image is malformed
```

lakukan langkah berikut:

```bash
pm2 stop sellzivpn
cd /root/BotZiVPN
ls -lh sellzivpn*.db
```

Jika masih ada file backup sehat seperti `sellzivpn-latest-migrated.db`, restore ulang dengan cara:

```bash
cp sellzivpn.db sellzivpn.db.corrupt-$(date +%F-%H%M%S)
cp sellzivpn-latest-migrated.db sellzivpn.db
rm -f sellzivpn.db-wal sellzivpn.db-shm
pm2 start sellzivpn
pm2 logs --lines 50
```

Jika hanya punya file database yang rusak dan ingin mencoba recovery:

```bash
apt update -y && apt install -y sqlite3
cd /root/BotZiVPN
sqlite3 sellzivpn.db ".recover" | sqlite3 sellzivpn-recovered.db
sqlite3 sellzivpn-recovered.db "PRAGMA integrity_check;"
```

Jika hasil recovery sehat, pakai file itu sebagai database aktif.

---

## 6) Backup Manual Database Aktif

Disarankan rutin backup database aktif:

```bash
mkdir -p /root/backup-bot && cd /root/BotZiVPN && cp sellzivpn.db /root/backup-bot/sellzivpn.db.$(date +%F-%H%M%S)
```

---

## ❗ Troubleshooting

### Payment sukses tapi saldo tidak masuk
Periksa:
- `GOPAY_KEY`
- koneksi internet VPS
- log PM2
- status pending deposit

### Trial / Create timeout
Periksa:
- domain server
- auth server
- API backend port `5888`
- status server dari menu cek server

### Error `chat not found`
Biasanya `GROUP_ID` salah atau bot belum masuk ke grup target.

### Users/statistik tiba-tiba kosong
Biasanya bot membaca file `sellzivpn.db` yang salah atau file database kecil/kosong.

### Bot restart loop setelah restore
Biasanya file database restore korup atau diganti saat bot masih online.

---

## ❓ FAQ

### Apakah `ressel.db` aman dipakai di source terbaru?
Ya, selama format file tetap daftar ID reseller per baris.

### Apakah `trial.db` aman dipakai di source terbaru?
Ya, format JSON trial tetap bisa dipakai di source terbaru.

### Apakah `sellzivpn.db` lama bisa dipakai di source terbaru?
Bisa, asalkan struktur database sudah sesuai atau source mendukung migrasi yang diperlukan.

### Kenapa restore database harus stop PM2 dulu?
Agar SQLite tidak menulis file saat database sedang diganti, yang bisa menyebabkan korup.

### Apakah file data perlu dimasukkan ke GitHub?
Tidak disarankan. File seperti `sellzivpn.db`, `ressel.db`, `trial.db`, dan `.vars.json` lebih aman disimpan di VPS atau backup pribadi.

---

## 🖼️ Preview Tambahan

<div align="center">
  <img src="./ss2.png" alt="Preview Tambahan" width="720" />
</div>

---

<div align="center">

### 🚀 ZIFLAZZ — Fast, Stable, Trusted

Jika project ini bermanfaat, gunakan dan kelola dengan baik. Simpan backup secara rutin dan lakukan update dengan cara yang aman.

</div>
