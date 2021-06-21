const Pengguna = require('../models/pengguna');

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
  Pengguna.create({
    nik: nik,
    username: username,
    nama: nama,
    peran: peran,
    password: password,
    poin_meja:poin_meja
  })
  .then(result => {
    console.log(result);
    res.redirect('/admin/pengguna');
  })
  .catch(err => console.log(err));
};
