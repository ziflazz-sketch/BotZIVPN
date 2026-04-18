const {
  getServerById,
  incrementTotalCreate,
  callZivpnApi,
  extractAccountFields,
  normalizeApiError,
} = require('./zivpnApi');

async function createssh(username, password, exp, iplimit, serverId) {
  if (!/^[a-zA-Z0-9-]+$/.test(username)) {
    return '❌ Username tidak valid. Gunakan huruf, angka, dan strip (-).';
  }

  try {
    const server = await getServerById(serverId);
    if (!server) return '❌ Server tidak ditemukan. Silakan coba lagi.';

    const data = await callZivpnApi(server, 'create', { password, exp });
    if (data.status !== 'success') {
      return `❌ ${data.message || 'Permintaan gagal.'}`;
    }

    const details = extractAccountFields(data.message, {
      password,
      host: server.domain,
      expire: '-',
      isp: '-',
    });

    if (Number(exp) >= 1 && Number(exp) <= 135) {
      await incrementTotalCreate(serverId).catch(() => {});
    }

    return `✅ *AKUN BERHASIL DIBUAT*

━━━━━━━━━━━━━━━━━━━━
🌐  *Host*     : \`${details.host}\`
🔑  *Password* : \`${details.password}\`
📡  *ISP*      : ${details.isp}
📆  *Expire*   : ${details.expire}
━━━━━━━━━━━━━━━━━━━━
💡 _Simpan info akun ini baik-baik!_

📘 *CARA PASANG ZIVPN*
🔗 https://youtu.be/uRRXCYBrtgk?si=45014pbnfne9vCgM

1️⃣ Buka link tutorial di atas
2️⃣ Ikuti langkah di video
3️⃣ Selesai & Connect 🚀`;
  } catch (error) {
    return normalizeApiError(error);
  }
}

module.exports = { createssh };
