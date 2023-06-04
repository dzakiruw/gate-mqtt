const mssql = require("mssql");
require("../controller/mqttController");

const config = {
  user: "integratif",
  password: "G3rb4ng!",
  server: "10.199.14.47",
  database: "GATE_DEV",
  options: {
    encrypt: false, // Jika menggunakan koneksi SSL
    // trustServerCertificate: true // Jika sertifikat SSL tidak valid
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000, // Waktu tunggu maksimum sebelum koneksi ditutup
  },
};

const pool = new mssql.ConnectionPool(config);

pool.connect((err) => {
  if (err) {
    console.error("Koneksi ke SQL Server gagal:", err);
  } else {
    console.log("Koneksi ke SQL Server berhasil");
  }
});

module.exports = pool;
