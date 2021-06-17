// const Pengguna = require('../models/admin');
//
//
// exports.getAdminDashboard = (req,res) => {
//   // res.send('<h1>hello admin</h1>')
//   res.render('admin', {
//     pageTitle: 'Dashboard',
//     path: '/'
//   });
// };
//
// exports.getDataPengguna = (req,res, next) => {
//   Pengguna.fetchAll()
//   .then(([rows, fieldData]) => {
//     res.render('admin', {
//       users: rows,
//       coloms: fieldData,
//       pageTitle: 'Pengguna',
//       path: '/pengguna'
//     });
//   })
//   .catch(err => console.log(err));
// };
//
// exports.postAddDataPengguna = ( req,res, next) => {
//   const nik = req.body.nik;
//   const username = req.body.username;
//   const nama = req.body.nama;
//   const peran = req.body.peran;
//   const password = req.body.password;
//   const poin_meja = req.body.poin_meja;
//   const pengguna = new Pengguna(nik , username, nama, peran, password, poin_meja);
//   pengguna
//     .save()
//     .then(() => {
//       res.redirect('/admin/pengguna');
//     })
//     .catch(err => console.log(err));
// };
//
// exports.getDetailDataPengguna = ( req,res, next) => {
//   const nik = req.params.penggunaId;
//   Pengguna.findById(nik)
//   .then(([pengguna]) => {
//     console.log(pengguna[0]);
//     res.render('admin', {
//       pageTitle: 'Detail',
//       users: pengguna[0],
//       path: '/pengguna/detail'
//     });
//
//   }).catch(err => console.log(err));
// };
