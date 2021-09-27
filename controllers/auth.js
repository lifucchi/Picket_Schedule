const bcrypt = require('bcryptjs');
const Pengguna = require('../models/pengguna');

exports.getLogin = (req, res, next) => {
  if (!req.session.isLoggedIn) {
  // let message = req.flash('error_messages');
  if (res.locals.error_messages.length > 0) {
    res.locals.error_messages = res.locals.error_messages[0];
  } else {
    res.locals.error_messages = null;
  }
  res.render('login/login', {
    path: '/',
    pageTitle: 'Login'
  });
  }
    else{
        if (req.session.user.peran === 'Admin'){
        res.redirect('/admin');

        }else if(req.session.user.peran === 'Anggota') {
        res.redirect('/anggota');

        }else if(req.session.user.peran === 'Fasilitator'){
        res.redirect('/fasilitator');
        }
    }
};

exports.postLogin = (req, res, next) => {
  const nik = req.body.login_username;
  const password = req.body.login_password;
  Pengguna.findOne({ where: { nik: nik } })
    .then(user => {
      if (!user) {
        req.flash('error_messages', 'User Tidak Ditemukan');
        return res.redirect('/');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {

            req.session.isLoggedIn = true;
            req.session.user = user;

            return req.session.save(err => {
              console.log(err);
              if (req.session.user.peran === 'Admin'){
                res.redirect('/admin');

              }else if(req.session.user.peran === 'Anggota') {

                res.redirect('/anggota');

              }else if(req.session.user.peran === 'Fasilitator'){
                res.redirect('/fasilitator');

              }

            });
          }
          req.flash('error_messages', 'Password salah');
          res.redirect('/');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/');
        });
    })
    .catch(err => console.log(err));
};

exports.getLogout = (req, res, next) => {
 req.session.destroy(err => {
    res.redirect('/');
  });

};


exports.changePassword = (req, res, next) => {
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

  res.render('login/changePassword', {
    path: '/',
    pageTitle: 'Ganti Password'
  });
};

exports.changePasswordPengguna = (req, res, next) => {
  const nik = req.session.user.nik;
  const passwordnew = req.body.changePassword;
  const passwordnow = req.body.Password;

  Pengguna.findOne({ where: { nik: nik } })
    .then(user => {
      if (!user) {
        req.flash('error_messages', 'User Tidak Ditemukan');
        return res.redirect('/');
      }
      bcrypt
        .compare(passwordnow, user.password)
        .then(doMatch => {
          if (doMatch) {
            console.log("password match");
            Pengguna.findByPk(nik)
              .then( pengguna => {
                  return bcrypt.hash(passwordnew,12)
                  .then(hashedPassword => {
                    pengguna.password = hashedPassword;
                    return pengguna.save();
                }).then(result => {
                  req.flash('success_messages', 'Password berhasil diperbarui');
                  console.log('UPDATED PASSWORD!');
                  return res.redirect('/');
                }).catch(err => console.log(err));
              })
              .catch(err => console.log(err));

          }else {
            req.flash('error_messages', 'Password lama salah');
            return res.redirect('/changePassword');
          }
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => console.log(err));

};
