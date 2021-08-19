const bcrypt = require('bcryptjs');

const Pengguna = require('../models/pengguna');

exports.getLogin = (req, res, next) => {

  if (!req.session.isLoggedIn) {

  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('login/login', {
    path: '/',
    pageTitle: 'Login',
    errorMessage: message
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
        req.flash('error', 'User gaada');
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
          req.flash('error', 'Password salah');
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
    console.log(err);
    res.redirect('/');
  });
};


exports.changePassword = (req, res, next) => {
  let message = req.flash('error');
  res.render('login/changePassword', {
    path: '/',
    pageTitle: 'ganti Password',
    errorMessage: message
  });
};

exports.changePasswordPengguna = (req, res, next) => {
  let message = req.flash('error');

  const password = req.body.changePassword;

    Pengguna.findByPk(req.session.user.nik)
      .then( pengguna => {
          return bcrypt.hash(password,12)
          .then(hashedPassword => {
            pengguna.password = hashedPassword;
            return pengguna.save();
        })
      }).then(result => {
        console.log('UPDATED PASSWORD!');
        res.redirect('/');

      })
      .catch(err => console.log(err));


};
