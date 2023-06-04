const pool = require("../database/index")

function log(table, isvalid, idgate, idkartu){
  const query = `INSERT INTO ${table} (id_kartu_akses, id_register_gate, is_valid) VALUES ('${idkartu}', ${idgate}, ${isvalid})`;
  pool.request().query(query, (err, res) => {
    if(err) console.log("ini error"+err)
    console.log("log", res)
  })
}

const postsController = {
    keluar: async (req, res) => {
        try {
            const id_kartu_akses = req.body.id_kartu_akses;
            const id_register_gate = req.body.id_register_gate;
            console.log("(KELUAR) Melakukan Post dengan ID : " + id_kartu_akses + "dan" + id_register_gate)
            const query1 = `SELECT * FROM kartu_akses WHERE id_kartu_akses = '${id_kartu_akses}'`;
            const query2 = `SELECT * FROM register_gate WHERE id_register_gate = '${id_register_gate}'`;
            const request = pool.request()          
            request.query(query1, (err, result) => {
                if (err) console.log(err);
                if (result.recordset.length === 0) {
                  // If id kartu akses is invalid
                  res.send('0');
                } else if (result.recordset[0].is_aktif) {
                    console.log(query1)
                    console.log("query1 isaktif :" + result.recordset[0].is_aktif);
                    console.log("query1 length :" + result.recordset.length)
                  // If id kartu akses is valid and active
                //   log('log_keluar', 1, id_register_gate, id_kartu_akses);
                    res.send('1');
                } else {
                  // If id kartu akses is valid but inactive
                  res.send('0');              
                  log('log_keluar', 0, id_register_gate, id_kartu_akses)
                }
            })
            request.query(query2, (err, result) => {
              if (err) console.log(err);
              if (result.recordset.length === 0) {
                // If id kartu akses is invalid
                res.send('0');
              } else if (result.recordset[0].id_register_gate) {
                console.log(query2)
                console.log("query2 isaktif :" + result.recordset[0].id_register_gate);
                console.log("query2 length :" + result.recordset.length)
                // If id kartu akses is valid and active
                // res.send('1');
                // log('log_keluar', 1, id_register_gate, id_kartu_akses);
              } else {
                // If id kartu akses is valid but inactive
                log('log_keluar', 1, id_register_gate, id_kartu_akses);
                res.send('0');
              }
          })
          log('log_keluar', 1, id_register_gate, id_kartu_akses);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Terjadi kesalahan saat memproses permintaan' });
        }
    },
    masuk: async (req, res) => {
        try {
            const id_kartu_akses = req.body.id_kartu_akses;
            const id_register_gate = req.body.id_register_gate;
            console.log("(MASUK) Melakukan Post dengan ID : " + id_kartu_akses + "dan" + id_register_gate)
            const query1 = `SELECT * FROM kartu_akses WHERE id_kartu_akses = '${id_kartu_akses}'`;
            const query2 = `SELECT * FROM register_gate WHERE id_register_gate = '${id_register_gate}'`;
            const request = pool.request()          
            request.query(query1, (err, result) => {
                if (err) console.log(err);
                if (result.recordset.length === 0) {
                  // If id kartu akses is invalid
                  res.send('0');
                } else if (result.recordset[0].is_aktif) {
                    console.log(query1)
                    console.log("query1 isaktif :" + result.recordset[0].is_aktif);
                    console.log("query1 length :" + result.recordset.length)
                  // If id kartu akses is valid and active
                //   log('log_masuk', 1, id_register_gate, id_kartu_akses);
                //   res.send('1');
                } else {
                  // If id kartu akses is valid but inactive
                  res.send('0');              
                  log('log_masuk', 0, id_register_gate, id_kartu_akses)
                }
            })
            request.query(query2, (err, result) => {
              if (err) console.log(err);
              if (result.recordset.length === 0) {
                // If id kartu akses is invalid
                res.send('0');
              } else if (result.recordset[0].id_register_gate) {
                console.log(query2)
                console.log("query2 isaktif :" + result.recordset[0].id_register_gate);
                console.log("query2 length :" + result.recordset.length)
                // If id kartu akses is valid and active
                res.send('1');
                // log('log_masuk', 1, id_register_gate, id_kartu_akses);
              } else {
                // If id kartu akses is valid but inactive
                log('log_masuk', 1, id_register_gate, id_kartu_akses);
                res.send('0');
              }
          })
          log('log_masuk', 1, id_register_gate, id_kartu_akses);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Terjadi kesalahan saat memproses permintaan' });
        }
    },

}

module.exports = postsController