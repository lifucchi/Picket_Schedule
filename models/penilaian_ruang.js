const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Penilaian_ruang = sequelize.define('penilaian_ruang', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  bobotruang: {
    type:Sequelize.INTEGER,
    allowNull: false
  },
  standarmeja: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Penilaian_ruang;
