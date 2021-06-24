const Meja = require('../models/meja');
const Pengguna = require('../models/pengguna');

exports.getDataMeja = (req,res, next) => {

  Pengguna.findAll()
  .then(pengguna => {

    Meja.findAll( {include: Pengguna} )
    .then( table => {
      res.render('./admin/checklistmeja', {
        tables: table,
        users: pengguna,
        pageTitle: 'Checklist Meja',
        path: '/checklistmeja'
      });
    })

  })
  .catch(err => console.log(err));
};
