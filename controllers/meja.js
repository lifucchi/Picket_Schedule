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

exports.postEditMeja = ( req,res, next) => {
  const id = req.body.id;
  const pemilik = req.body.pemilik_meja_edit;
  const standar = req.body.standar_edit;
  const poin_meja = req.body.poin_meja_edit;
  console.log(pemilik);
  Meja.findByPk(id)
    .then(meja => {
      meja.penggunaNik = pemilik;
      meja.standar = standar;
      meja.poin_meja = poin_meja;
      return meja.save();
    })
    .then(result => {
      console.log('UPDATED MEJA!');
      res.redirect('/admin/checklistmeja');
    })
    .catch(err => console.log(err));
};


exports.postDeleteMeja = ( req,res, next) => {
  const id = req.body.mejaId;
  Meja.findByPk(id)
    .then(meja => {
      return meja.destroy();
    })
    .then(result => {
      console.log('DESTROYED Meja');
      res.redirect('/admin/checklistmeja');
    })
    .catch(err => console.log(err));

};
