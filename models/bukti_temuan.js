const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const moment = require('moment');

const Bukti_temuan = sequelize.define('bukti_temuan', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fotosebelum: {
    type: Sequelize.STRING,
    // type: Sequelize.BLOB('long'),
    // allowNull: false
  },
  deskripsi_sebelum: {
    type:Sequelize.STRING,
    allowNull: false
  },
  deadline: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    get: function() {
       return moment(this.getDataValue('deadline')).format('DD-MM-YYYY')}
  },
  tinjak_lanjut: {
    type: Sequelize.INTEGER,
    defaultValue: '2'
    // allowNull: false
  },
  fotosesudah: {
    type: Sequelize.STRING,
  },
  deskripsi_sesudah: {
    type: Sequelize.STRING(50),
  }
});

module.exports = Bukti_temuan;
