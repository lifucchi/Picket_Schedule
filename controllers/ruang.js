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
