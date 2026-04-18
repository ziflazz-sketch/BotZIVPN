const {
  getServerById,
  callZivpnApi,
  extractAccountFields,
  normalizeApiError,
} = require('./zivpnApi');

async function renewssh(username, password, exp, limitip, serverId) {
  if (!/^[a-zA-Z0-9-]+$/.test(username)) {
    return '❌ Username tidak valid. Gunakan huruf, angka, dan strip (-).';
  }

  try {
    const server = await getServerById(serverId);
    if (!server) return '❌ Server tidak ditemukan. Silakan coba lagi.';

    const data = await callZivpnApi(server, 'renew', { password, exp });
    if (data.status !== 'success') {
      return `❌ ${data.message || 'Permintaan gagal.'}`;
    }

    const details = extractAccountFields(data.message, {
      password,
      host: server.domain,
      expire: `${exp} Hari`,
      isp: '-',
    });

    return `✅ *AKUN BERHASIL DIPERPANJANG*

━━━━━━━━━━━━━━━━━━━━
🌐  *Host*     : \`${details.host}\`
🔑  *Password* : \`${details.password}\`
📡  *ISP*      : ${details.isp}
📆  *Expire*   : ${details.expire}
━━━━━━━━━━━━━━━━━━━━
🔄 _Masa aktif akun berhasil diperbarui._

📘 *CARA PASANG ZIVPN*
🔗 https://youtu.be/uRRXCYBrtgk?si=45014pbnfne9vCgM

1️⃣ Buka link tutorial di atas
2️⃣ Ikuti langkah di video
3️⃣ Selesai & Connect 🚀`;
  } catch (error) {
    return normalizeApiError(error);
  }
}

module.exports = { renewssh };
