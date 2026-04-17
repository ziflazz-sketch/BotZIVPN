const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sellzivpn.db');

async function trialssh(username, password, exp, iplimit, serverId) {

  if (!/^[a-zA-Z0-9-]+$/.test(username)) {
    return '❌ Username tidak valid.';
  }

  return new Promise((resolve) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err || !server) return resolve('❌ Server tidak ditemukan.');

      const domain = server.domain;
      const AUTH_TOKEN = server.auth;
      const curlCommand = `curl --fail --connect-timeout 1 --max-time 30 "http://${domain}:5888/trial/zivpn?exp=${exp}&auth=${AUTH_TOKEN}"`;

      exec(curlCommand, (err, stdout) => {
        if (err) return resolve("❌ Gagal menghubungi server.");
        const out = (stdout || "").trim();
        if (!out) return resolve("❌ Respon server kosong.");

        let d;
        try { d = JSON.parse(out); } catch (e) { return resolve("❌ Respon server tidak valid."); }
        if (typeof d !== "object" || !("status" in d)) return resolve("❌ Respon tidak dikenali.");
        if (d.status !== "success") return resolve(`❌ ${d.message || "Permintaan gagal."}`);

        const passMatch = d.message.match(/Pass\s*:\s*(\S+)/);
        const hostMatch = d.message.match(/Host\s*:\s*(\S+)/);
        const expireMatch = d.message.match(/Expire\s*:\s*(.+)/);
        const ispMatch = d.message.match(/ISP\s*:\s*(.+)/);

        const extractedPass = passMatch ? passMatch[1] : '-';
        const extractedHost = hostMatch ? hostMatch[1] : domain;
        const extractedExpire = expireMatch ? expireMatch[1].trim() : '-';
        const extractedIsp = ispMatch ? ispMatch[1].trim() : '-';

        if (exp >= 1 && exp <= 135) {
          db.run('UPDATE Server SET total_create_akun = total_create_akun + 1 WHERE id = ?', [serverId]);
        }

        const msg = `✅ *TRIAL BERHASIL DIBUAT*

━━━━━━━━━━━━━━━━━━━━
🌐  *Host*     : \`${extractedHost}\`
🔑  *Password* : \`${extractedPass}\`
📡  *ISP*      : ${extractedIsp}
📅  *Expire*   : ${extractedExpire}
━━━━━━━━━━━━━━━━━━━━
⚠️ _Akun trial tidak bisa diperpanjang_

📘 *CARA PASANG ZIVPN*
🔗 https://youtu.be/uRRXCYBrtgk?si=45014pbnfne9vCgM

1️⃣ Buka link tutorial di atas
2️⃣ Ikuti langkah di video
3️⃣ Selesai & Connect 🚀`;

        return resolve(msg);
      });
    });
  });
}

module.exports = { trialssh };
