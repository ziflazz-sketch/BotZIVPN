const {
  getServerById,
  decrementTotalCreate,
  callZivpnApi,
  extractAccountFields,
  normalizeApiError,
} = require('./zivpnApi');

async function delssh(username, password, exp, iplimit, serverId) {
  if (!/^[a-zA-Z0-9-]+$/.test(username)) {
    return '❌ Username tidak valid. Gunakan huruf, angka, dan strip (-).';
  }

  try {
    const server = await getServerById(serverId);
    if (!server) return '❌ Server tidak ditemukan. Silakan coba lagi.';

    const data = await callZivpnApi(server, 'delete', { password: username });
    if (data.status !== 'success') {
      return `❌ ${data.message || 'Permintaan gagal.'}`;
    }

    await decrementTotalCreate(serverId).catch(() => {});

    const details = extractAccountFields(data.message, {
      host: server.domain,
    });

    return `✅ *AKUN BERHASIL DIHAPUS*

━━━━━━━━━━━━━━━━━━━━
👤  *Username* : \`${username}\`
🌐  *Host*     : \`${details.host}\`
━━━━━━━━━━━━━━━━━━━━
🗑️ _Akun berhasil dihapus dari server._

📌 Jika ingin menggunakan layanan kembali,
silakan buat akun baru dari menu bot.`;
  } catch (error) {
    return normalizeApiError(error);
  }
}

module.exports = { delssh };
