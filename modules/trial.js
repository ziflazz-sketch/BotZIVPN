const {
  getServerById,
  incrementTotalCreate,
  callZivpnApi,
  extractAccountFields,
  normalizeApiError,
} = require('./zivpnApi');

async function trialssh(username, password, exp, iplimit, serverId) {
  if (!/^[a-zA-Z0-9-]+$/.test(username)) {
    return '❌ Username tidak valid.';
  }

  try {
    const server = await getServerById(serverId);
    if (!server) return '❌ Server tidak ditemukan.';

    const data = await callZivpnApi(server, 'trial', { exp });
    if (data.status !== 'success') {
      return `❌ ${data.message || 'Permintaan gagal.'}`;
    }

    const details = extractAccountFields(data.message, {
      password: '-',
      host: server.domain,
      expire: '-',
      isp: '-',
    });

    if (Number(exp) >= 1 && Number(exp) <= 135) {
      await incrementTotalCreate(serverId).catch(() => {});
    }

    return `✅ *TRIAL BERHASIL DIBUAT*

━━━━━━━━━━━━━━━━━━━━
🌐  *Host*     : \`${details.host}\`
🔑  *Password* : \`${details.password}\`
📡  *ISP*      : ${details.isp}
📅  *Expire*   : ${details.expire}
━━━━━━━━━━━━━━━━━━━━
⚠️ _Akun trial tidak bisa diperpanjang_

📘 *CARA PASANG ZIVPN*
🔗 https://youtu.be/uRRXCYBrtgk?si=45014pbnfne9vCgM

1️⃣ Buka link tutorial di atas
2️⃣ Ikuti langkah di video
3️⃣ Selesai & Connect 🚀`;
  } catch (error) {
    return normalizeApiError(error);
  }
}

module.exports = { trialssh };
