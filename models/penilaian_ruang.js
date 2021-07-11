const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Penilaian_ruang = sequelize.define('penilaian_ruang', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  bobotruang: {
    type:Sequelize.INTEGER,
    allowNull: false
  },
  persetujuanpicpiket: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '2'
  }
});

module.exports = Penilaian_ruang;
