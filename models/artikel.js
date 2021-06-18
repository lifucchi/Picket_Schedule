const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Artikel = sequelize.define('artikel', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  judul: {
    type:Sequelize.STRING(50),
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
    type: Sequelize.BLOB('long'),
    allowNull: false
  }
});

module.exports = Artikel;
