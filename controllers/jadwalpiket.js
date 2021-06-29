const Pengguna = require('../models/pengguna');
const JadwalPiket = require('../models/jadwal_piket');

exports.getDataJadwalPiket = (req,res, next) => {
  JadwalPiket.findAll({
    include: [{
      model: Pengguna,
      as: 'nik_pic_piket',
    },
    {
      model: Pengguna,
      as: 'nik_pic_fasil',
    }
  ]
  })
  .then(jadwalpiket => {
    res.render('./admin/jadwalpiket', {
      schedules: jadwalpiket,
      pageTitle: 'Jadwal Piket',
      path: '/jadwalpiket'
    });
  })
  .catch(err => console.log(err));
};

exports.getFormJadwalPiket = (req,res,next) => {

  Pengguna.findAll()
  .then( pengguna =>{
    res.render("./admin/jadwalpiket-form", {
      users: pengguna,
      pageTitle: 'Jadwal Piket',
      jenis: 'Tambah',
    });

  })
  .catch(err => console.log(err));
};

exports.postAddDataJadwalPiket = (req,res,next) => {
  const tanggal = req.body.tanggal;
  const pic_piket_1 = req.body.pic_piket_1;
  const pic_fasil_1 = req.body.pic_fasil_1;
  const pic_piket_2 = req.body.pic_piket_2;
  const pic_fasil_2 = req.body.pic_fasil_2;

  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();

  const nowTangga= year + "-" + month + "-" + date;

  console.log(nowTangga);

  JadwalPiket.findAll({
    where:{
      tanggal: tanggal
   }}).then( ada => {
     // console.log(ada);
     if(ada.length === 0){
         return JadwalPiket.bulkCreate([
            {tanggal:tanggal,nikPicFasilNik:pic_fasil_1, nikPicPiketNik:pic_piket_1},
            {tanggal:tanggal,nikPicFasilNik:pic_fasil_2, nikPicPiketNik:pic_piket_2}
          ]).then( result => {
            res.redirect('/admin/jadwalpiket')
            
          }
          )
     }
     console.log("tanggal ada");
     return res.redirect('/admin/jadwalpiket/add')

   })
  .catch(err => console.log(err));


};
