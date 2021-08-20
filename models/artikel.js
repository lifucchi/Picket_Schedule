const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Artikel = sequelize.define('artikel', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  judul: {
    type:Sequelize.STRING,
    allowNull: false
  },
  konten: {
    type: Sequelize.STRING,
    allowNull: false
  },
  pembuat: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  foto_Artikel: {
    type: Sequelize.STRING(50),
    // allowNull: false
  }
});

module.exports = Artikel;
