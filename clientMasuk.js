const mqtt = require("mqtt");

let client = mqtt.connect("mqtt://broker.hivemq.com");

client.on("connect", function () {
  // Buat payload untuk masuk
  let payloadMasuk = JSON.stringify({
    id_kartu_akses: "1212121212",
    id_register_gate: "44",
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
