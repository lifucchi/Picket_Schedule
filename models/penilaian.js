const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Penilaian = sequelize.define('penilaian', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  nama_penilaian: {
    type:Sequelize.STRING,
    allowNull: false
  },
  kategori: {
    type: Sequelize.STRING,
    allowNull: false
  },
  bobot_skor: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

module.exports = Penilaian;
