const mysql = require('mysql');

const pool = mysql.createPool({
  host    : 'localhost',
  user    : 'root',
  password: 'root',
  database: 'condominioSolNascente',
});

const execute = (query, params=[]) => {

  // return new Promise((resolve, reject) => {
  //   pool.query(query, (err, rows) => {
  //     if(err) return reject(err);
  //     return resolve(rows);
  //   })
  // })

  return new Promise(function(resolve, reject) {
    pool.getConnection((err, connection) => {
      if(err) console.log(err);
      connection.query(query, params, function(error, rows, fields) {
        connection.release();
        if(rows === undefined) {
          console.log(error);
          reject(new Error('ROWS ARE UNDEFINED'));
        } else {
          resolve(rows);
        }
      })
    })
  }).then(results => {
    if(!results || results.length === 0) {
      return undefined;
    }
    return results;
  }).catch((err) => {
    console.log("DB QUERY ERR: " + err);
  })
}

const fetchOne = (result) => {
  if(result === undefined) {
    return undefined;
  }
  return result[0];
}

module.exports = { execute, fetchOne };
