const mqtt = require("mqtt");

let client = mqtt.connect("mqtt://broker.hivemq.com");

client.on("connect", function () {
  // Argumen input dari terminal
  let id_kartu_akses = process.argv[2];
  let id_register_gate = process.argv[3];

  // Buat payload untuk masuk
  let payloadMasuk = JSON.stringify({
    id_kartu_akses: id_kartu_akses,
    id_register_gate: id_register_gate,
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
