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
