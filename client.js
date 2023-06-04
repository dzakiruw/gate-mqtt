const mqtt = require("mqtt");

// Koneksi ke broker
let client = mqtt.connect("mqtt://broker.hivemq.com");

client.on("connect", function () {
  // Klien terhubung dengan broker

  // Buat payload untuk keluar
  let payloadKeluar = JSON.stringify({
    id_kartu_akses: "1212121212",
    id_register_gate: "48",
  });

  // Publish pesan ke topik 'access/keluar'
  client.publish("access/keluar", payloadKeluar, function (err) {
    if (!err) {
      console.log("Pesan berhasil dipublish ke access/keluar");
    } else {
      console.error("Error saat mempublish ke access/keluar:", err);
    }
  });

  // Buat payload untuk masuk
  let payloadMasuk = JSON.stringify({
    id_kartu_akses: "1212121212",
    id_register_gate: "45",
  });

  // Publish pesan ke topik 'access/masuk'
  client.publish("access/masuk", payloadMasuk, function (err) {
    if (!err) {
      console.log("Pesan berhasil dipublish ke access/masuk");
    } else {
      console.error("Error saat mempublish ke access/masuk:", err);
    }
  });
});
