const Artikel = require('../models/artikel');
const path = require('path');
fs = require('fs');

exports.getDataArtikel = (req,res,next) => {
  Artikel.findAll()
  .then(artikel => {
    res.render('./admin/artikel', {
      articles: artikel,
      pageTitle: 'Artikel',
      path: '/artikel',

    });
  })
  .catch(err => console.log(err));
};

exports.getFormArtikel = (req,res,next) =>{

  res.render("./admin/artikel-form", {
    // articles: artikel,
    pageTitle: 'Artikel',
    jenis: 'Tambah',
    editing: 'no',
    // path: '/artikel'
  });

};

exports.getFormUpdateArtikel = (req,res,next) =>{
  // const id = req.body.update;
  // var keyword = q.query.keyword;
  const id = req.query.update;


  Artikel.findByPk(id)
  .then(artikel => {

    res.render("./admin/artikel-form", {
      // articles: artikel,
      pageTitle: 'Artikel',
      article: artikel,
      jenis: 'Update',
      path: '/artikel',
      editing: 'edit',
    });
  })
};



exports.postUpdateDataArtikel = (req,res,next) =>{
  // const id = req.body.update;
  // var keyword = q.query.keyword;
  const id = req.body.update;
  const judul = req.body.judul;
  const konten = req.body.konten;
  const pembuat = req.body.pembuat;
  const image = req.files.image;


  Artikel.findByPk(id)
    .then(artikel => {
      if (image != null ){
        const oldPhoto = artikel.foto_Artikel;
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
              const imgUrl = image[0].path;
              artikel.judul = judul;
              artikel.konten = konten;
              artikel.pembuat = pembuat;
              artikel.foto_Artikel = imgUrl;
              return artikel.save();
              }
            }
          } else {
            artikel.judul = judul;
            artikel.konten = konten;
            artikel.pembuat = pembuat;
            return artikel.save();
          }
      next()
    })

  .then(artikel => {

    res.redirect('/admin/artikel')

  })
};


exports.postAddDataArtikel = (req,res,next) => {
  const judul = req.body.judul;
  const konten = req.body.konten;
  const pembuat = req.body.pembuat;

  const image = req.files.image;


  console.log(image[0]);

  if (image != null ){
  const imgUrl = image[0].path;
  console.log(imgUrl);

  Artikel.create({
    judul: judul,
    konten: konten,
    pembuat: pembuat,
    foto_Artikel:imgUrl,
    }).then(
      res.redirect('/admin/artikel')
    ).catch(err => console.log(err));
  } else{
    console.log("masuk sinikah");
    Artikel.create({
      judul: judul,
      konten: konten,
      pembuat: pembuat,
      }).then(
        res.redirect('/admin/artikel')
      ).catch(err => console.log(err));

  }

};





exports.postDeleteArtikel = ( req,res, next) => {
  const id = req.body.artikelId;
  Artikel.findByPk(id)
    .then(artikel => {
      const oldPhoto = artikel.foto_Artikel;

      if (oldPhoto) {
        const oldPath = path.join(__dirname, "..", oldPhoto);
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
