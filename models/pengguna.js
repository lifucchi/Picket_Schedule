const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Pengguna = sequelize.define('pengguna', {
  nik: {
    type: Sequelize.STRING(10),
    allowNull: false,
    primaryKey: true
  },
  nama: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  peran: {
    type: Sequelize.STRING(20),
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  level: {
    type: Sequelize.INTEGER
  }
});

module.exports = Pengguna;
