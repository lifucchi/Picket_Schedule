const Meja = require('../models/meja');
const Pengguna = require('../models/pengguna');

exports.getDataMeja = (req,res, next) => {
  Meja.findAll( {include: Pengguna} )
  .then( table => {
    res.render('./admin/checklistmeja', {
      tables: table,
      pageTitle: 'Checklist Meja',
      path: '/checklistmeja'
    });
  })
  .catch(err => console.log(err));
};
