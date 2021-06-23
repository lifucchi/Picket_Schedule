const Pengguna = require('../models/pengguna');
const bcrypt = require('bcryptjs');

exports.getDataPengguna = (req,res, next) => {
  Pengguna.findAll()
  .then(pengguna => {
    res.render('./admin/pengguna', {
      users: pengguna,
      pageTitle: 'Pengguna',
      path: '/pengguna'
    });
  })
  .catch(err => console.log(err));
};

exports.postAddDataPengguna = ( req,res, next) => {
  const nik = req.body.nik;
  const username = req.body.username;
  const nama = req.body.nama;
  const peran = req.body.peran;
  const password = req.body.password;
  const poin_meja = req.body.poin_meja;

  Pengguna.findByPk(nik)
  .then( pengguna =>{
    if (pengguna) {
      console.log("pengguna ada");
      return res.redirect('/admin/pengguna');
    }
    return bcrypt.hash(password,12)
    .then(hashedPassword => {
      const pengguna = Pengguna.create({
        nik: nik,
        username: username,
        nama: nama,
        peran: peran,
        password: hashedPassword,
        poin_meja:poin_meja}
      )
      })
      .then(result => {
        res.redirect('/admin/pengguna');
      })
  })
  .catch(err => console.log(err));
};


exports.postDeletePengguna = ( req,res, next) => {
  const nik = req.body.penggunaId;
  Pengguna.findByPk(nik)
    .then(pengguna => {
      return pengguna.destroy();
    })
    .then(result => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/pengguna');
    })
    .catch(err => console.log(err));

};

exports.postEditPengguna = ( req,res, next) => {
  const nikUp = req.body.nik_edit2;
  const usernameUp = req.body.username_edit;
  const namaUp = req.body.nama_edit;
  const peranUp = req.body.peran_edit;
  // const passwordUp = req.body.password_edit;
  const poin_mejaUp = req.body.poin_meja_edit;
  Pengguna.findByPk(nikUp)
    .then(pengguna => {
      pengguna.username = usernameUp;
      pengguna.nama = namaUp;
      pengguna.peran = peranUp;
      pengguna.poin_meja = poin_mejaUp;
      return pengguna.save();
    })
    .then(result => {
      console.log('UPDATED PENGGUNA!');
      res.redirect('/admin/pengguna');
    })
    .catch(err => console.log(err));
};

exports.postResetPassword = (req,res,next) => {
const nikUp = req.body.penggunaId;
  Pengguna.findByPk(nikUp)
    .then( pengguna => {
        return bcrypt.hash(nikUp,12)
        .then(hashedPassword => {
          pengguna.password = hashedPassword;
          return pengguna.save();
      })
    }).then(result => {
      console.log('UPDATED PASSWORD!');
      res.redirect('/admin/pengguna');
    })
    .catch(err => console.log(err));
};
