const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Meja = sequelize.define('meja', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  standar: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Meja;
