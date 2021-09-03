const path = require('path');
const express = require('express');
const bodyPaser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
var CronJob = require('cron').CronJob;
const app = express();
const moment = require('moment');
const multer = require('multer');

// controller
const errorController = require('./controllers/error');
// database
const sequelize = require('./util/database');
// model
const Pengguna = require('./models/pengguna');
const Jadwal_piket = require('./models/jadwal_piket');
const Artikel = require('./models/artikel');
const Bukti_temuan = require('./models/bukti_temuan');
const Notifikasi = require('./models/notifikasi');
const Penilaian_meja = require('./models/penilaian_meja');
const Penilaian_ruang = require('./models/penilaian_ruang');
const Ruang = require('./models/ruang');
const Meja = require('./models/meja');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const anggotaRoutes = require('./routes/anggota');
const fasilitatorRoutes = require('./routes/fasilitator');

app.use(bodyPaser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/images",express.static(path.join(__dirname, 'images')));

// untuk imag
const imageFilter = (req, file, cb) => {
  if (file.fieldname === "image") {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
      ) {
      cb(null, true);
    } else {
      cb("Please upload only images.", false);
    }
  }
};

var fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
app.use(multer({storage : fileStorage, fileFilter: imageFilter}).fields(
    [
      {
        name: 'excel',
        maxCount: 1
      },
      {
        name: 'image',
        maxCount: 1
      }
    ]
  ));


// app.use("/excel",express.static(path.join(__dirname, 'excel')));

// untuk file
// const excelFilter = (req, file, cb) => {
//   if (
//     file.mimetype.includes("excel") ||
//     file.mimetype.includes("spreadsheetml")
//   ) {
//     cb(null, true);
//   } else {
//     cb("Please upload only excel file.", false);
//   }
// };
//
// var storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "excel/");
//   },
//   filename: (req, file, cb) => {
//     console.log(file.originalname);
//     cb(null, `${Date.now()}-jadwalpiket-${file.originalname}`);
//   },
// });
//
// app.use(multer({storage : storage, fileFilter: excelFilter}).single('excel'));



app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    // store: store
  })
);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  Pengguna.findByPk(req.session.user.nik)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.session = req.session;
  // res.locals.csrfToken = req.csrfToken();
  next();
});

// routes
app.use('/admin',adminRoutes.routes);
app.use(authRoutes);
app.use('/anggota',anggotaRoutes);
app.use('/fasilitator',fasilitatorRoutes);


app.use(errorController.get404);

// sync database
// Pengguna punya banyak jadwal_piket
Jadwal_piket.belongsTo(Pengguna, {constraints:true, onDelete:'CASCADE', foreignKey: 'nikpicpiket', as: 'nik_pic_piket'});
Jadwal_piket.belongsTo(Pengguna, {constraints:true, onDelete:'CASCADE', foreignKey: 'nikpicfasil', as: 'nik_pic_fasil'});
Pengguna.hasMany(Jadwal_piket, {foreignKey: 'nikpicpiket', as: 'PemilikJadwal'});


// pengguna punya banyak standar Meja
Pengguna.hasOne(Meja , {  foreignKey: 'penggunaNik', as: 'PemilikMeja' });
Meja.belongsTo(Pengguna, { foreignKey: 'penggunaNik', constraints:true, onDelete:'CASCADE'});

// ruang punya PIC ruang
Pengguna.hasMany(Ruang,  {  foreignKey: 'penggunaNik', as: 'PicRuang' });
Ruang.belongsTo(Pengguna, {foreignKey: 'penggunaNik', constraints:true, onDelete:'CASCADE'});

// ruang --> penilaian ruang <-- jadwal piket
Ruang.belongsToMany(Jadwal_piket, {
  through: Penilaian_ruang,
  as: 'JadwalPiket'
});
Jadwal_piket.belongsToMany(Ruang, {
  through: Penilaian_ruang,
  as: 'Ruang'
});

Ruang.hasMany(Penilaian_ruang);
Penilaian_ruang.belongsTo(Ruang);
Jadwal_piket.hasMany(Penilaian_ruang);
Penilaian_ruang.belongsTo(Jadwal_piket);

// penilaian ruang -> bukti Temuan
Bukti_temuan.belongsTo(Penilaian_ruang, { onDelete:'CASCADE'});
Penilaian_ruang.hasMany(Bukti_temuan);

// meja --> penilaian meja <-- jadwal piket
Meja.belongsToMany(Jadwal_piket, {
  through: Penilaian_meja,
  as: 'JadwalPiketMeja'
});

Jadwal_piket.belongsToMany(Meja, {
  through: Penilaian_meja,
  as: 'Meja'
 });
Meja.hasMany(Penilaian_meja);
Penilaian_meja.belongsTo(Meja);
Jadwal_piket.hasMany(Penilaian_meja);
Penilaian_meja.belongsTo(Jadwal_piket);

// penilaian meja -> bukti Temuan
Bukti_temuan.belongsTo(Penilaian_meja, { onDelete:'CASCADE'});
Penilaian_meja.hasMany(Bukti_temuan);
// var job = new CronJob('0 0 0 * * *', function() {
//  //will run every day at 12:00 AM
// });

// var job = new CronJob('0 0 0 * * *', function() {
//   console.log('Ini jam 12 malam');
//
// }, null, true, 'Asia/Jakarta');
// job.start();

// var job = new CronJob('* 5 * * * *', function() {
//   console.log('halo');
//   const nowTanggal = moment().format('YYYY-MM-DD');
//
//   JadwalPiket
//   .findAll({
//     where: {tanggal: nowTanggal}
//   })
//   .then(jadwal=>{
//     jadwal.setPenilaian_ruang([1,2])
//     .then(sc=>{
//         console.log(sc);
//     });
// });
// }, null, true, 'Asia/Jakarta');
// job.start();


sequelize
  .sync()
  // .sync({alter: true})
  // .sync({force: true})
  .then(result => {
    app.listen(3001);
  })
  .catch( err => {
    console.log(err);
  });
