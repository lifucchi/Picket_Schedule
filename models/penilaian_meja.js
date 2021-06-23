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
  standarmeja: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Penilaian_meja;
