const axios = require('axios');
const http = require('http');
const https = require('https');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./sellzivpn.db');
const REQUEST_TIMEOUT = 8000;
const apiClient = axios.create({
  timeout: REQUEST_TIMEOUT,
  httpAgent: new http.Agent({ keepAlive: true, timeout: REQUEST_TIMEOUT }),
  httpsAgent: new https.Agent({ keepAlive: true, timeout: REQUEST_TIMEOUT }),
  validateStatus: () => true,
});

function dbGetAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

function dbRunAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

async function getServerById(serverId) {
  return dbGetAsync('SELECT * FROM Server WHERE id = ?', [serverId]);
}

async function incrementTotalCreate(serverId) {
  return dbRunAsync('UPDATE Server SET total_create_akun = total_create_akun + 1 WHERE id = ?', [serverId]);
}

async function decrementTotalCreate(serverId) {
  return dbRunAsync('UPDATE Server SET total_create_akun = total_create_akun - 1 WHERE id = ? AND total_create_akun > 0', [serverId]);
}

async function callZivpnApi(server, action, params = {}) {
  const response = await apiClient.get(`http://${server.domain}:5888/${action}/zivpn`, {
    params: {
      ...params,
      auth: server.auth,
    },
  });

  if (response.status >= 400) {
    throw new Error(`Server merespons HTTP ${response.status}`);
  }

  let data = response.data;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data.trim());
    } catch (error) {
      throw new Error('Respon server tidak valid.');
    }
  }

  if (!data || typeof data !== 'object' || !('status' in data)) {
    throw new Error('Respon server tidak dikenali.');
  }

  return data;
}

function extractAccountFields(message, defaults = {}) {
  const text = String(message || '');
  const passMatch = text.match(/Pass\s*:\s*(\S+)/i);
  const hostMatch = text.match(/Host\s*:\s*(\S+)/i);
  const expireMatch = text.match(/Expire\s*:\s*(.+)/i);
  const ispMatch = text.match(/ISP\s*:\s*(.+)/i);

  return {
    password: passMatch ? passMatch[1] : (defaults.password ?? '-'),
    host: hostMatch ? hostMatch[1] : (defaults.host ?? '-'),
    expire: expireMatch ? expireMatch[1].trim() : (defaults.expire ?? '-'),
    isp: ispMatch ? ispMatch[1].trim() : (defaults.isp ?? '-'),
  };
}

function normalizeApiError(error) {
  if (error.response?.data?.message) {
    return `❌ ${error.response.data.message}`;
  }
  if (error.code === 'ECONNABORTED') {
    return '❌ Server terlalu lama merespons.';
  }
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    return '❌ Gagal menghubungi server.';
  }
  return `❌ ${error.message || 'Permintaan gagal.'}`;
}

module.exports = {
  REQUEST_TIMEOUT,
  getServerById,
  incrementTotalCreate,
  decrementTotalCreate,
  callZivpnApi,
  extractAccountFields,
  normalizeApiError,
};
