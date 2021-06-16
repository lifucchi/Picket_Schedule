const Pengguna = require('../models/admin');


exports.getAdminDashboard = (req,res) => {
  // res.send('<h1>hello admin</h1>')
  res.render('admin', {
    pageTitle: 'Dashboard',
    path: '/'
  });
};

exports.getDataPengguna = (req,res, next) => {
  Pengguna.fetchAll()
  .then(([rows, fieldData]) => {
    console.log(rows);
    res.render('admin', {
      users: rows,
      pageTitle: 'Pengguna',
      path: '/pengguna'
    });
  })
  .catch(err => console.log(err));
};
