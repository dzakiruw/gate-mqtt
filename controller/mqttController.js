const mqtt = require('mqtt');
const pool = require("../database/index");

let client  = mqtt.connect('mqtt://broker.hivemq.com'); // Ganti dengan alamat broker MQTT Anda

client.on('connect', () => {
    console.log('Connected to MQTT Broker');
    client.subscribe('access/keluar', (err) => {
        if (err) console.error(err);
    });
    client.subscribe('access/masuk', (err) => {
        if (err) console.error(err);
    });
})

client.on('message', (topic, message) => {
    switch(topic) {
        case 'access/keluar':
            keluar(message.toString());
            break;
        case 'access/masuk':
            masuk(message.toString());
            break;
        default:
            console.log('No handler for topic %s', topic);
    }
})

function log(table, isvalid, idgate, idkartu){
  const query = `INSERT INTO ${table} (id_kartu_akses, id_register_gate, is_valid) VALUES ('${idkartu}', ${idgate}, ${isvalid})`;
  pool.request().query(query, (err, res) => {
    if(err) console.log("ini error"+err)
    console.log("log", res)
  })
}

function keluar(message) {
    // Parse message yang diterima dari topik keluar
    let payload = JSON.parse(message);
    const id_kartu_akses = payload.id_kartu_akses;
    const id_register_gate = payload.id_register_gate;

    // Query database
    const query1 = `SELECT * FROM kartu_akses WHERE id_kartu_akses = '${id_kartu_akses}'`;
    const query2 = `SELECT * FROM register_gate WHERE id_register_gate = '${id_register_gate}'`;

    // Query 1
    pool.request().query(query1, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        if (result.recordset.length === 0) {
            // If id kartu akses is invalid
            client.publish('access/response', '0');
        } else if (result.recordset[0].is_aktif) {
            // If id kartu akses is valid and active
            client.publish('access/response', '1');
        } else {
            // If id kartu akses is valid but inactive
            client.publish('access/response', '0');
            log('log_keluar', 0, id_register_gate, id_kartu_akses)
        }
    })

    // Query 2
    pool.request().query(query2, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        if (result.recordset.length === 0) {
            // If id register gate is invalid
            client.publish('access/response', '0');
        } else if (result.recordset[0].id_register_gate) {
            // If id register gate is valid and active
            client.publish('access/response', '1');
        } else {
            // If id register gate is valid but inactive
            log('log_keluar', 1, id_register_gate, id_kartu_akses);
            client.publish('access/response', '0');
        }
    })

    // Log a successful access attempt
    log('log_keluar', 1, id_register_gate, id_kartu_akses);
}

function masuk(message) {
    // Parse message yang diterima dari topik masuk
    let payload = JSON.parse(message);
    const id_kartu_akses = payload.id_kartu_akses;
    const id_register_gate = payload.id_register_gate;

    // Query database
    const query1 = `SELECT * FROM kartu_akses WHERE id_kartu_akses = '${id_kartu_akses}'`;
    const query2 = `SELECT * FROM register_gate WHERE id_register_gate = '${id_register_gate}'`;

    // Query 1
    pool.request().query(query1, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        if (result.recordset.length === 0) {
            // If id kartu akses is invalid
            client.publish('access/response', '0');
        } else if (result.recordset[0].is_aktif) {
            // If id kartu akses is valid and active
            client.publish('access/response', '1');
        } else {
            // If id kartu akses is valid but inactive
            client.publish('access/response', '0');              
            log('log_masuk', 0, id_register_gate, id_kartu_akses)
        }
    })

    // Query 2
    pool.request().query(query2, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        if (result.recordset.length === 0) {
            // If id register gate is invalid
            client.publish('access/response', '0');
        } else if (result.recordset[0].id_register_gate) {
            // If id register gate is valid and active
            client.publish('access/response', '1');
        } else {
            // If id register gate is valid but inactive
            log('log_masuk', 1, id_register_gate, id_kartu_akses);
            client.publish('access/response', '0');
        }
    })

    // Log a successful access attempt
    log('log_masuk', 1, id_register_gate, id_kartu_akses);
}

module.exports = { keluar, masuk, log };
