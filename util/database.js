// const mysql = require('mysql2');
//
// const pool = mysql.createPool({
//   host : '153.92.8.1',
//   user: 'u2964880_root',
//   database:'u2964880_5Rsmart',
//   password: 'password',
// });
//
// module.exports =pool.promise();

const Sequelize = require('sequelize');

const sequelize = new Sequelize('u2964880_5Rsmart', 'u2964880_root', 'password', {
  dialect: 'mysql',
  host: '153.92.8.1'
});
// const sequelize = new Sequelize('lift3227_5Rsmart', 'lift3227_root', 'inipassword5rsmart', {
//   dialect: 'mysql',
//   host: '103.253.212.244',
//   port: 3306,
// });


module.exports = sequelize;
