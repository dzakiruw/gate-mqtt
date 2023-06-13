const mqtt = require("mqtt");

let client = mqtt.connect("mqtt://10.15.43.76:1883"); // Alamat broker MQTT Anda

client.on("connect", function () {
  // Argumen input dari terminal
  let id_kartu_akses = process.argv[2];
  let id_register_gate = process.argv[3];

  // Buat payload untuk keluar
  let payloadKeluar = JSON.stringify({
    id_kartu_akses: id_kartu_akses,
    id_register_gate: id_register_gate,
  });

  // Publish pesan ke topik 'access/keluar'
  client.publish("access/keluar", payloadKeluar, function (err) {
    if (!err) {
      console.log("Pesan berhasil dipublish ke access/keluar");
    } else {
      console.error("Error saat mempublish ke access/keluar:", err);
    }
  });
});
