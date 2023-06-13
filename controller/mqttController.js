const mqtt = require("mqtt");
const pool = require("../database/index");

let client = mqtt.connect("mqtt://10.15.43.76:1883"); // Alamat broker MQTT Anda

client.on("connect", () => {
  console.log("Connected to MQTT Broker");
  client.subscribe("access/keluar", (err) => {
    if (err) console.error(err);
  });
  client.subscribe("access/masuk", (err) => {
    if (err) console.error(err);
  });
  client.subscribe("access/response", (err) => {
    if (err) console.error(err);
  });
});

client.on("message", (topic, message) => {
  //   console.log(`topic: ${topic}, message: ${message.toString()}`);
  switch (topic) {
    case "access/keluar":
      keluar(message);
      break;
    case "access/masuk":
      masuk(message);
      break;
    case "access/response":
      console.log("response", message.toString());
      break;
    default:
      console.log("No handler for topic %s", topic);
  }
});

function log(table, isvalid, idgate, idkartu) {
  const query = `INSERT INTO ${table} (id_kartu_akses, id_register_gate, is_valid) VALUES ('${idkartu}', ${idgate}, ${isvalid})`;
  pool.request().query(query, (err, res) => {
    if (err) console.log("ini error" + err);
    // console.log("log", res);
  });
}

// -------------------------------------------------------- //

async function keluar(message) {
  // Parse message yang diterima dari topik keluar
  let payload = JSON.parse(message);
  const id_kartu_akses = payload.id_kartu_akses;
  const id_register_gate = payload.id_register_gate;

  // Query database
  const query1 = `SELECT * FROM kartu_akses WHERE id_kartu_akses = '${id_kartu_akses}'`;
  const query2 = `SELECT * FROM register_gate WHERE id_register_gate = '${id_register_gate}'`;

  let kartu_akses = {};
  let register_gate = {};

  // Query 1
  await new Promise((resolve, reject) => {
    pool.request().query(query1, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      if (result.recordset.length === 0) {
        // If id kartu akses is invalid
        client.publish("access/response", "0");
        log("log_keluar", 0, id_register_gate, id_kartu_akses); // log action when is_aktif is 0
      } else {
        kartu_akses = result.recordset[0]; // Save the result regardless of its "is_aktif" status
        if (!kartu_akses.is_aktif) {
          // If id kartu akses is valid but inactive
          client.publish("access/response", "0");
          log("log_keluar", 0, id_register_gate, id_kartu_akses); // log action when is_aktif is 0
        }
      }
      resolve();
    });
  });

  // Query 2
  await new Promise((resolve, reject) => {
    pool.request().query(query2, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      if (result.recordset.length === 0) {
        // If id register gate is invalid
        client.publish("access/response", "0");
      } else if (result.recordset[0].id_register_gate) {
        // If id register gate is valid and active
        // client.publish("access/response", "1");
        register_gate = result.recordset[0];
      } else {
        // If id register gate is valid but inactive
        // log("log_keluar", 1, id_register_gate, id_kartu_akses);
        //  client.publish("access/response", "0");
        register_gate = result.recordset[0];
      }
      resolve();
    });
  });

  if (
    Object.keys(kartu_akses).length != 0 &&
    Object.keys(register_gate).length != 0
  ) {
    let bool = kartu_akses.is_aktif == 1 ? "true" : "false";
    let log_keluar = `INSERT INTO dbo.log_keluar (
            id_kartu_akses,
            id_register_gate,
            date_time,
            is_valid) VALUES (
                '${kartu_akses.id_kartu_akses}',
                ${register_gate.id_register_gate},
                '${getTime()}',
                '${bool}'
            );`;

    await new Promise((resolve, reject) => {
      pool.request().query(log_keluar, (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }
        if (result.rowsAffected[0] != 1) {
          // If id register gate is invalid
          client.publish("access/response", "0");
        } else if (result.rowsAffected[0] == 1) {
          // If id register gate is valid and active
          client.publish("access/response", "1");
        } else {
          // If id register gate is valid but inactive
          //   log("log_masuk", 1, id_register_gate, id_kartu_akses);
          client.publish("access/response", "0");
        }
        resolve();
      });
    });
  }
}

// --------------------------------------------------------------------------------- //

async function masuk(message) {
  // Parse message yang diterima dari topik keluar
  let payload = JSON.parse(message);
  const id_kartu_akses = payload.id_kartu_akses;
  const id_register_gate = payload.id_register_gate;

  // Query database
  const query1 = `SELECT * FROM kartu_akses WHERE id_kartu_akses = '${id_kartu_akses}'`;
  const query2 = `SELECT * FROM register_gate WHERE id_register_gate = '${id_register_gate}'`;

  let kartu_akses = {};
  let register_gate = {};

  // Query 1
  await new Promise((resolve, reject) => {
    pool.request().query(query1, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      if (result.recordset.length === 0) {
        // If id kartu akses is invalid
        client.publish("access/response", "0");
        log("log_masuk", 0, id_register_gate, id_kartu_akses); // log action when is_aktif is 0
      } else {
        kartu_akses = result.recordset[0]; // Save the result regardless of its "is_aktif" status
        if (!kartu_akses.is_aktif) {
          // If id kartu akses is valid but inactive
          client.publish("access/response", "0");
          log("log_masuk", 0, id_register_gate, id_kartu_akses); // log action when is_aktif is 0
        }
      }
      resolve();
    });
  });

  // Query 2
  await new Promise((resolve, reject) => {
    pool.request().query(query2, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      if (result.recordset.length === 0) {
        // If id register gate is invalid
        client.publish("access/response", "0");
      } else if (result.recordset[0].id_register_gate) {
        // If id register gate is valid and active
        // client.publish("access/response", "1");
        register_gate = result.recordset[0];
      } else {
        // If id register gate is valid but inactive
        // log("log_keluar", 1, id_register_gate, id_kartu_akses);
        //  client.publish("access/response", "0");
        register_gate = result.recordset[0];
      }
      resolve();
    });
  });

  if (
    Object.keys(kartu_akses).length != 0 &&
    Object.keys(register_gate).length != 0
  ) {
    let bool = kartu_akses.is_aktif == 1 ? "true" : "false";
    let log_masuk = `INSERT INTO dbo.log_masuk (
            id_kartu_akses,
            id_register_gate,
            date_time,
            is_valid) VALUES (
                '${kartu_akses.id_kartu_akses}',
                ${register_gate.id_register_gate},
                '${getTime()}',
                '${bool}'
            );`;

    await new Promise((resolve, reject) => {
      pool.request().query(log_masuk, (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }
        if (result.rowsAffected[0] != 1) {
          // If id register gate is invalid
          client.publish("access/response", "0");
        } else if (result.rowsAffected[0] == 1) {
          // If id register gate is valid and active
          // client.publish("access/response", "1");
        } else {
          // If id register gate is valid but inactive
          //   log("log_masuk", 1, id_register_gate, id_kartu_akses);
          client.publish("access/response", "0");
        }
        resolve();
      });
    });
  }
}

function getTime() {
  const date = new Date();
  const year = date.getUTCFullYear();
  const month = `0${date.getUTCMonth() + 1}`.slice(-2);
  const day = `0${date.getUTCDate()}`.slice(-2);
  const hours = `0${date.getUTCHours()}`.slice(-2);
  const minutes = `0${date.getUTCMinutes()}`.slice(-2);
  const seconds = `0${date.getUTCSeconds()}`.slice(-2);
  const milliseconds = `00${date.getUTCMilliseconds()}`.slice(-3);

  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

  return formattedDate;
}

module.exports = { keluar, masuk, log };
