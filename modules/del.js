const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sellzivpn.db');

async function delssh(username, password, exp, iplimit, serverId) {
  if (!/^[a-zA-Z0-9-]+$/.test(username)) {
    return '❌ Username tidak valid. Gunakan huruf, angka, dan strip (-).';
  }

  return new Promise((resolve) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err || !server) {
        return resolve('❌ Server tidak ditemukan. Silakan coba lagi.');
      }

      const domain = server.domain;
      const AUTH_TOKEN = server.auth;
      const curlCommand = `curl --fail --connect-timeout 1 --max-time 30 "http://${domain}:5888/delete/zivpn?password=${username}&auth=${AUTH_TOKEN}"`;

      exec(curlCommand, (err, stdout, stderr) => {
        if (err) return resolve('❌ Gagal menghubungi server.');

        const out = (stdout || '').trim();
        if (!out) return resolve('❌ Respon server kosong / tidak valid.');

        let d;
        try {
          d = JSON.parse(out);
        } catch (e) {
          return resolve('❌ Respon server tidak valid (bukan JSON).');
        }

        if (typeof d !== 'object' || !('status' in d)) {
          return resolve('❌ Respon server tidak dikenali.');
        }

        if (d.status !== 'success') {
          return resolve(`❌ ${d.message || 'Permintaan gagal.'}`);
        }

        db.run(
          'UPDATE Server SET total_create_akun = total_create_akun - 1 WHERE id = ? AND total_create_akun > 0',
          [serverId]
        );

        const hostMatch = (d.message || '').match(/Host\s*:\s*(\S+)/i);
        const extractedHost = hostMatch ? hostMatch[1] : domain;

        const msg = `✅ *AKUN BERHASIL DIHAPUS*

━━━━━━━━━━━━━━━━━━━━
👤  *Username* : \`${username}\`
🌐  *Host*     : \`${extractedHost}\`
━━━━━━━━━━━━━━━━━━━━
🗑️ _Akun berhasil dihapus dari server._

📌 Jika ingin menggunakan layanan kembali,
silakan buat akun baru dari menu bot.`;

        return resolve(msg);
      });
    });
  });
}

module.exports = { delssh };
