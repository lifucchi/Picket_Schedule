const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Ruang = sequelize.define('ruang', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  nama_ruang: {
    type:Sequelize.STRING,
    allowNull: false
  },
  level: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  poin_ruang: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

module.exports = Ruang;
