const mysql = require('mysql2');

const pool = mysql.createPool({
  host : '153.92.8.1',
  user: 'u2964880_root',
  database:'u2964880_piket',
  password: 'password',
});

module.exports =pool.promise();
