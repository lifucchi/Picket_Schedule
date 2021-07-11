const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Penilaian_meja = sequelize.define('penilaian_meja', {
  id: {
    autoIncrement: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  bobotmeja: {
    type:Sequelize.INTEGER,
    allowNull: false
  },
  persetujuanpicpiket: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '2'
  }
});

module.exports = Penilaian_meja;
