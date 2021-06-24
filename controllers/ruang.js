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

exports.postEditRuang = ( req,res, next) => {
  const id = req.body.id;
  const nama_ruang = req.body.nama_ruang_edit;
  const level = req.body.level_edit;
  const standar = req.body.standar_edit;
  const poin_ruang = req.body.poin_ruang_edit;
  Ruang.findByPk(id)
    .then(ruang => {
      ruang.nama_ruang = nama_ruang;
      ruang.level = level;
      ruang.standar = standar;
      ruang.poin_ruang = poin_ruang;
      return ruang.save();
    })
    .then(result => {
      console.log('UPDATED RUANG!');
      res.redirect('/admin/checklistruang');
    })
    .catch(err => console.log(err));
};



exports.postDeleteRuang = ( req,res, next) => {
  const id = req.body.ruangId;
  Ruang.findByPk(id)
    .then(ruang => {
      return ruang.destroy();
    })
    .then(result => {
      console.log('DESTROYED RUANG');
      res.redirect('/admin/checklistruang');
    })
    .catch(err => console.log(err));

};
