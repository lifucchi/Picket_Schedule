const Ruang = require('../models/ruang');


exports.getDataRuang = (req,res, next) => {
  Ruang.findAll()
  .then( ruang => {
    res.render('./admin/checklistruang', {
      rooms: ruang,
      pageTitle: 'Checklist Ruang',
      path: '/checklistruang'
    });
  })
  .catch(err => console.log(err));
};

exports.postAddDataRuang = (req,res,next) => {
  const nama_ruang = req.body.nama_ruang;
  const level = req.body.level;
  const standar = req.body.standar;
  const poin_ruang = req.body.poin_ruang;

  Ruang.create({
    nama_ruang: nama_ruang,
    level: level,
    standar:standar,
    poin_ruang: poin_ruang
  }).then(
    res.redirect('/admin/checklistruang')
  ).catch(err => console.log(err));


};
