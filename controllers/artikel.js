const Artikel = require('../models/artikel');

exports.getDataArtikel = (req,res,next) => {
  Artikel.findAll()
  .then(artikel => {
    res.render('./admin/artikel', {
      articles: artikel,
      pageTitle: 'Artikel',
      path: '/artikel'
    });
  })
  .catch(err => console.log(err));
};

exports.getFormArtikel = (req,res,next) =>{

  res.render("./admin/artikel-form", {
    // articles: artikel,
    pageTitle: 'Artikel',
    // path: '/artikel'
  });

};
