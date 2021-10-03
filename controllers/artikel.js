const Artikel = require('../models/artikel');
const path = require('path');
fs = require('fs');

exports.getDataArtikel = (req,res,next) => {

  if (res.locals.error_messages.length > 0) {
    res.locals.error_messages = res.locals.error_messages[0];
  } else {
    res.locals.error_messages = null;
  }

  if (res.locals.success_messages.length > 0) {
    res.locals.success_messages = res.locals.success_messages[0];
  } else {
    res.locals.success_messages = null;
  }

  Artikel.findAll()
  .then(artikel => {
    res.render('./admin/artikel', {
      articles: artikel,
      pageTitle: 'Galeri',
      path: '/artikel',

    });
  })
  .catch(err => console.log(err));
};

exports.getFormArtikel = (req,res,next) =>{
  if (res.locals.error_messages.length > 0) {
    res.locals.error_messages = res.locals.error_messages[0];
  } else {
    res.locals.error_messages = null;
  }

  if (res.locals.success_messages.length > 0) {
    res.locals.success_messages = res.locals.success_messages[0];
  } else {
    res.locals.success_messages = null;
  }

  res.render("./admin/artikel-form", {
    // articles: artikel,
    pageTitle: 'Galeri',
    jenis: 'Tambah',
    editing: 'no',
    // path: '/artikel'
  });

};

exports.getFormUpdateArtikel = (req,res,next) =>{
  // const id = req.body.update;
  // var keyword = q.query.keyword;
  const id = req.query.update;
  if (res.locals.error_messages.length > 0) {
    res.locals.error_messages = res.locals.error_messages[0];
  } else {
    res.locals.error_messages = null;
  }

  if (res.locals.success_messages.length > 0) {
    res.locals.success_messages = res.locals.success_messages[0];
  } else {
    res.locals.success_messages = null;
  }


  Artikel.findByPk(id)
  .then(artikel => {
    res.render("./admin/artikel-form", {
      // articles: artikel,
      pageTitle: 'Galeri',
      article: artikel,
      jenis: 'Update',
      path: '/artikel',
      editing: 'edit',
    });
  })
  .catch(err => {
    console.log(err);
    req.flash('error_messages', 'Gagal mengubah');
    res.redirect('/admin/artikel')

  });
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
    })
  .then(artikel => {
    req.flash('success_messages', 'Galeri berhasil diupdate');
    setTimeout(() => { return res.redirect('/admin/artikel');}, 2000);



  })
  .catch(err => {
    console.log(err);
    req.flash('error_messages', 'Gagal mengubah');
    res.redirect('/admin/artikel')

  });
};


exports.postAddDataArtikel = (req,res,next) => {
  const judul = req.body.judul;
  const konten = req.body.konten;
  const pembuat = req.body.pembuat;
  const image = req.files.image;

  if (image !== null ){
  const imgUrl = image[0].path;
  console.log(imgUrl);

  Artikel.create({
    judul: judul,
    konten: konten,
    pembuat: pembuat,
    foto_Artikel:imgUrl,
  })
  .then( () => {
    req.flash('success_messages', 'Galeri berhasil ditambahkan');
    res.redirect('/admin/artikel')
      }
    )
    .catch(err => {
        req.flash('error_messages', 'Gagal menambahkan');
        res.redirect('/admin/artikel')

      });
  } else{
    Artikel.create({
      judul: judul,
      konten: konten,
      pembuat: pembuat,
      })
      .then( () => {
        req.flash('success_messages', 'Galeri berhasil ditambahkan');
        setTimeout(() => { return res.redirect('/admin/artikel');}, 2000);

          }
        )
        .catch(err => {
            req.flash('error_messages', 'Gagal menambahkan');
            res.redirect('/admin/artikel')

          });
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
      req.flash('success_messages', 'Galeri berhasil dihapus');

      res.redirect('/admin/artikel');
    })
    .catch(err => console.log(err));

};
