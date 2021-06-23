const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Bukti_temuan = sequelize.define('bukti_temuan', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fotosebelum: {
    type: Sequelize.BLOB('long'),
    allowNull: false
  },
  deskripsi_sebelum: {
    type:Sequelize.STRING(50),
    allowNull: false
  },
  deadline: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  tinjak_lanjut: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  fotosesudah: {
    type: Sequelize.BLOB('long'),
  },
  deskripsi_sesudah: {
    type: Sequelize.STRING(50),
  }
});

module.exports = Bukti_temuan;
