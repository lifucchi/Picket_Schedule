const Pengguna = require('../models/pengguna');
const bcrypt = require('bcryptjs');
const Ruang = require('../models/ruang');


exports.getDataPengguna = (req,res, next) => {
  if (res.locals.error_messages.length > 0) {
    res.locals.error_messages = res.locals.error_messages[0];
  } else {
    res.locals.error_messages = null;
  }

  if (res.locals.success_messages.length > 0) {
    res.locals.success_messages = res.locals.success_messages[0];
  } else {
    res.locals.success_messages = null;
  }
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
  const level = req.body.level;


  Pengguna.findByPk(nik)
  .then( pengguna =>{
    if (pengguna) {
      req.flash('error_messages', 'Pengguna sudah ada');
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
        level:level}
      );
      })
      .then(result => {
        req.flash('success_messages', 'Pengguna sudah ditambahkan');
        setTimeout(() => { return res.redirect('/admin/pengguna');}, 1000);
      });
  })
  .catch(err => console.log(err));
};


exports.postDeletePengguna = ( req,res, next) => {

  if (res.locals.error_messages.length > 0) {
    res.locals.error_messages = res.locals.error_messages[0];
  } else {
    res.locals.error_messages = null;
  }


  if (res.locals.success_messages.length > 0) {
    res.locals.success_messages = res.locals.success_messages[0];
  } else {
    res.locals.success_messages = null;
  }
  const nik = req.body.penggunaId;

  Ruang.findAll(
    {where: {penggunaNik:nik}}
  )
  .then( ada => {
    if (ada.length > 0){
      req.flash('error_messages', 'Pengguna merupakan PIC Ruang sehingga ubah PIC Ruang sebelum menghapus pengguna ini');
      res.redirect('/admin/pengguna');

    } else{
      Pengguna.findByPk(nik)
        .then(pengguna => {
          return pengguna.destroy();
        })
        .then(result => {
          req.flash('success_messages', 'Pengguna sudah dihapus');
          res.redirect('/admin/pengguna');
        })
        .catch(err => console.log(err));
    }
  })


};

exports.postEditPengguna = ( req,res, next) => {
  const nikUp = req.body.nik_edit2;
  const usernameUp = req.body.username_edit;
  const namaUp = req.body.nama_edit;
  const peranUp = req.body.peran_edit;
  const levelUp = req.body.level_edit;



  Pengguna.findByPk(nikUp)
    .then(pengguna => {
      pengguna.username = usernameUp;
      pengguna.nama = namaUp;
      pengguna.peran = peranUp;
      pengguna.level =levelUp;
      return pengguna.save();
    })
    .then(result => {
      req.flash('success_messages', 'Pengguna sudah diubah');
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
      });
    }).then(result => {
      req.flash('success_messages', 'Password Pengguna sudah diubah');
      res.redirect('/admin/pengguna');
    })
    .catch(err => console.log(err));
};
