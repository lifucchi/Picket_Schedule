const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Jadwal_Piket = sequelize.define('jadwal_piket', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  tanggal: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  persetujuan_fasil: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

module.exports = Jadwal_Piket;
