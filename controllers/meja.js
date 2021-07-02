const Meja = require('../models/meja');
const Pengguna = require('../models/pengguna');
const moment = require('moment');


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
  // console.log(pemilik);
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

exports.getDataMejaAnggota = (req,res, next) => {

  // let ts = Date.now();
  // let date_ob = new Date(ts);
  // let date = date_ob.getDate();
  // let month = date_ob.getMonth() + 1;
  // let year = date_ob.getFullYear();
  //
  // const nowTanggal= year + "-" + month + "-" + date;
  // console.log("ini tanggal sekarang");
  // console.log(nowTanggal);
  const nowTanggal = moment().format('YYYY-MM-DD');
  console.log(nowTanggal);

  req.user
  .getPemilikJadwal({
    where: {tanggal: nowTanggal}
  })
  .then( result => {
    // console.log(result);
    if (result.length === 0){
        res.render('./anggota/checklistmeja', {
          pageTitle: 'Checklist Meja',
          path: '/checklistmeja'
        })
      }
      Meja.findAll({
        include: {
          model: Pengguna,
          where: { level: req.user.level }
        }
      })
      .then( table => {
        res.render('./anggota/checklistmeja', {
          tables: table,
          pageTitle: 'Checklist Meja',
          path: '/checklistmejaada'
        });
      })
  })
    .catch(err => console.log(err));

};
