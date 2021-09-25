const Sequelize = require('sequelize');
const moment = require('moment');


const sequelize = require('../util/database');

const Jadwal_Piket = sequelize.define('jadwal_piket', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  tanggal: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    get: function() {
       return moment(this.getDataValue('tanggal')).format('DD-MM-YYYY')}
  },
  persetujuan_fasil: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  status_piket: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  rekam_check: {
    type: Sequelize.DATE
  }
});

module.exports = Jadwal_Piket;
