const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Notifikasi = sequelize.define('notifikasi', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  pesan: {
    type:Sequelize.STRING(50),
    allowNull: false
  }
});

module.exports = Notifikasi;
