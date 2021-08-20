const Artikel = require('../models/artikel');
const path = require('path');
fs = require('fs');

exports.getDataArtikel = (req,res,next) => {
  Artikel.findAll()
  .then(artikel => {
    console.log(artikel);
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
    jenis: 'Tambah',
    // path: '/artikel'
  });

};

exports.postAddDataArtikel = (req,res,next) => {
  const judul = req.body.judul;
  const konten = req.body.konten;
  const pembuat = req.body.pembuat;
  const image = req.file;
  const imgUrl = image.path;


  Artikel.create({
    judul: judul,
    konten: konten,
    pembuat: pembuat,
    foto_Artikel:imgUrl,
  }).then(
    res.redirect('/admin/artikel')
  ).catch(err => console.log(err));


};



exports.postDeleteArtikel = ( req,res, next) => {
  const id = req.body.artikelId;
  Artikel.findByPk(id)
    .then(artikel => {
      const oldPhoto = artikel.foto_Artikel;
      console.log("INI FOTO LAMA");
      console.log(oldPhoto);


      if (oldPhoto) {
        const oldPath = path.join(__dirname, "..", oldPhoto);
        console.log("INI PATH LAMA");
        console.log(oldPath);
        if (fs.existsSync(oldPath)) {
          fs.unlink(oldPath, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
        }
      }
      return artikel.destroy();
    })
    .then(result => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/artikel');
    })
    .catch(err => console.log(err));

};
