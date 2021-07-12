const Meja = require('../models/meja');
const Pengguna = require('../models/pengguna');
const moment = require('moment');
const Penilaian_meja = require('../models/penilaian_meja');
const JadwalPiket = require('../models/jadwal_piket');


exports.getDataMeja = (req,res, next) => {
  Pengguna.findAll()
  .then(pengguna => {
    Meja.findAll( {include: Pengguna} )
    .then( table => {
      res.render('./admin/checklistmeja', {
        tables: table,
        users: pengguna,
        pageTitle: 'Checklist Meja',
        path: '/checklistmeja'
      });
    })
  })
  .catch(err => console.log(err));
};

exports.postAddDataMeja = (req,res,next) => {
  const pemilik_meja = req.body.pemilik_meja;
  const standar = req.body.standar;
  const poin_meja = req.body.poin_meja;

  Meja.create({
    penggunaNik: pemilik_meja,
    standar:standar,
    poin_meja: poin_meja
  }).then(
    res.redirect('/admin/checklistmeja')
  ).catch(err => console.log(err));
};

exports.postEditMeja = ( req,res, next) => {
  const id = req.body.id;
  const pemilik = req.body.pemilik_meja_edit;
  const standar = req.body.standar_edit;
  const poin_meja = req.body.poin_meja_edit;
  // console.log(pemilik);
  Meja.findByPk(id)
    .then(meja => {
      meja.penggunaNik = pemilik;
      meja.standar = standar;
      meja.poin_meja = poin_meja;
      return meja.save();
    })
    .then(result => {
      console.log('UPDATED MEJA!');
      res.redirect('/admin/checklistmeja');
    })
    .catch(err => console.log(err));
};


exports.postDeleteMeja = ( req,res, next) => {
  const id = req.body.mejaId;
  Meja.findByPk(id)
    .then(meja => {
      return meja.destroy();
    })
    .then(result => {
      console.log('DESTROYED Meja');
      res.redirect('/admin/checklistmeja');
    })
    .catch(err => console.log(err));
};

exports.getDataMejaAnggota = (req,res, next) => {

  const nowTanggal = moment().format('YYYY-MM-DD');
  console.log(nowTanggal);

  req.user
  .getPemilikJadwal({
    where: {tanggal: nowTanggal},
  })
  .then( result => {
    // console.log("ini result");
    // console.log(result);
    if (result.length === 0){
        return res.render('./anggota/checklistmeja', {
          pageTitle: 'Checklist Meja',
          path: '/checklistmeja'
        })
      }

    Penilaian_meja
    .findAll({
      where: {jadwalPiketId: result[0].dataValues.id},
        include: [
          {
          model: JadwalPiket,
        },
        {
          model: Meja,
          include : {
            model: Pengguna
          }
        }
      ]
    })
    .then( penilaianmeja => {
      console.log("penilaian meja");
      console.log(penilaianmeja);
      return res.render('./anggota/checklistmeja', {
        tables: penilaianmeja,
        pageTitle: 'Checklist Meja',
        path: '/checklistmejaada'
      });
    })
  })
    .catch(err => console.log(err));

};

exports.getDataMejaDetail = (req,res, next) => {
const id = req.params.mejaId;
  Penilaian_meja.findByPk(id, {
    include: [
      {
      model: JadwalPiket,
      include : [{
        model: Pengguna,
        as: 'nik_pic_piket',
      },
      {
        model: Pengguna,
        as: 'nik_pic_fasil',
      }
    ]
    },
    {
      model: Meja,
      include : {
        model: Pengguna
      }
    }
  ]
  })
  .then( table => {
    res.render('./anggota/checklistmejadetail', {
      tables: table,
      pageTitle: 'Checklist Meja',
      path: '/checklistmejaada'
    });
  })
  .catch(err => console.log(err));

};

exports.postNilaiMeja = (req,res, next) => {
  const id = req.body.mejaId;
  const nilai = req.body.nilai;

  console.log("ini nilai");
  console.log(nilai);
  console.log("ini meja");
  console.log(id);

  Penilaian_meja
  .findByPk(id)
  .then(penilaian => {
    penilaian.bobotmeja = nilai;
    return penilaian.save();
  })
  .then(result => {
    console.log('UPDATED NILAI!');
    res.redirect('/anggota/checklistmeja/detail/'+id);
  })
  .catch(err => console.log(err));


};
