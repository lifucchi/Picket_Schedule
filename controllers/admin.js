const Pengguna = require('../models/pengguna');


exports.getAdminDashboard = (req,res) => {
  // res.send('<h1>hello admin</h1>')
  res.render('./admin/admin', {
    pageTitle: 'Dashboard',
    path: '/'
  });
};


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
