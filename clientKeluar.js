const mqtt = require("mqtt");

let client = mqtt.connect("mqtt://broker.hivemq.com");

client.on("connect", function () {
  // Subscribe ke topik 'access/response'
  client.subscribe("access/response", function (err) {
    if (!err) {
      console.log("Berhasil subscribe ke access/response");
    } else {
      console.error("Error saat subscribe ke access/response:", err);
    }
  });

  // Buat payload untuk keluar
  let payloadKeluar = JSON.stringify({
    id_kartu_akses: "1212121212",
    id_register_gate: "44",
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

// Tangani pesan yang diterima
client.on("message", function (topic, message) {
  // message adalah Buffer
  switch (topic) {
    case "access/response":
      console.log(`Respon akses: ${message.toString()}`);
      break;
    default:
      console.log(`Tidak ada handler untuk topik ${topic}`);
  }
});
