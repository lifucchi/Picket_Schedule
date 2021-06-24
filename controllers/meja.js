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

exports.postAddDataMeja = (req,res,next) => {
  const pemilik_meja = req.body.pemilik_meja;
  const standar = req.body.standar;
  const poin_meja = req.body.poin_meja;

  Meja.create({
    penggunaNik: pemilik_meja,
    standar:standar,
    poin_meja: poin_meja
  }).then(
    res.redirect('/admin/checklistmeja')
  ).catch(err => console.log(err));
};
