const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const moment = require('moment');


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
  },
  createdAt: {
    type: Sequelize.DATE,
//note here this is the guy that you are looking for
  get() {
        return moment(this.getDataValue('createdAt')).format('DD MMMM YYYY');
    }
},
});

module.exports = Artikel;
