const axios = require('axios');
const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sellzivpn.db');

async function delssh(username, password, exp, iplimit, serverId) {
  console.log(`Delete SSH account for ${username} with expiry ${exp} days, IP limit ${iplimit}, and password ${password}`);

// Validasi username
if (!/^[a-zA-Z0-9-]+$/.test(username)) {
  return '❌ Username tidak valid. Gunakan huruf (A–Z / a–z), angka, dan tanda strip (-) tanpa spasi.';
}


  return new Promise((resolve) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err || !server) {
        console.error('❌ Error fetching server:', err?.message || 'server null');
        return resolve('❌ Server tidak ditemukan. Silakan coba lagi.');
      }

    const domain = server.domain;
    const AUTH_TOKEN = server.auth;

    // Endpoint delete
    const curlCommand = `curl --fail --connect-timeout 1 --max-time 30 "http://${domain}:5888/delete/zivpn?password=${username}&auth=${AUTH_TOKEN}"`;

    exec(curlCommand, (err, stdout, stderr) => {
  if (err) {
    console.error("❌ Curl error:", err.message);
    if (stderr) console.error("🪵 stderr:", stderr);
    return resolve("❌ Gagal menghubungi server.");
  }

  const out = (stdout || "").trim();
  if (!out) {
    return resolve("❌ Respon server kosong / tidak valid.");
  }

  // ❌ HARUS JSON
  let d;
  try {
    d = JSON.parse(out);
  } catch (e) {
    console.error("❌ JSON parse error:", e.message);
    console.error("🪵 Output:", out);
    return resolve("❌ Respon server tidak valid (bukan JSON).");
  }

  // ❌ schema dasar
  if (typeof d !== "object" || !("status" in d)) {
    return resolve("❌ Respon server tidak dikenali.");
  }

  // ❌ gagal dari backend
  if (d.status !== "success") {
    return resolve(`❌ ${d.message || "Permintaan gagal."}`);
  }

      // UPDATE total delete akun (opsional)
      db.run(
        'UPDATE Server SET total_create_akun = total_create_akun - 1 WHERE id = ?',
        [serverId],
        (err) => {
          if (err) console.error('⚠️ Gagal update total_create_akun:', err.message);
        }
      );

      const msg = `${d.message}`;
        return resolve(msg);
      });
    });
  });
}
  
  module.exports = { delssh };
