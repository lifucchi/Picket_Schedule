const path = require('path');
const express = require('express');
const bodyPaser = require('body-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const moment = require('moment');
const multer = require('multer');
const csrf = require('csurf');
const app = express();
const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const anggotaRoutes = require('./routes/anggota');
const fasilitatorRoutes = require('./routes/fasilitator');
const sequelize = require('./util/database');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const Pengguna = require('./models/pengguna');
const Jadwal_piket = require('./models/jadwal_piket');
const Artikel = require('./models/artikel');
const Bukti_temuan = require('./models/bukti_temuan');
const Penilaian_meja = require('./models/penilaian_meja');
const Penilaian_ruang = require('./models/penilaian_ruang');
const Ruang = require('./models/ruang');
const Meja = require('./models/meja');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyPaser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/images",express.static(path.join(__dirname, 'images')));
app.use("/excel",express.static(path.join(__dirname, 'excel')));
app.use(cookieParser());


const imageFilter = (req, file, cb) => {
  if (file.fieldname === "image") {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
      ) {
      cb(null, true);
    } else {
      // cb("Please upload only images.", false);
      req.fileValidationError = 'goes wrong on the mimetype';
      return cb(null, false, new Error('goes wrong on the mimetype'));


    }
  }else if(file.fieldname === "excel"){
      if (
        file.mimetype.includes("excel") ||
        file.mimetype.includes("spreadsheetml")
      ) {
        cb(null, true);
      } else {
        // cb("Please upload only excel file.", false);
        req.fileValidationError = 'goes wrong on the mimetype';
        return cb(null, false, new Error('goes wrong on the mimetype'));
      }
  }
};
var fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, "images/");
    }else if( file.fieldname === "excel"){
      cb(null, "excel/");
    }
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

app.set('trust proxy', 1);
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000
    }),
    resave: false,
    saveUninitialized: false,
    secret: 'keyboard cat'
}));
const csrfProtection = csrf({cookie: true});
app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }else{
      Pengguna.findByPk(req.session.user.nik)
        .then(user => {
          req.user = user;
        })
        .catch(err => console.log(err));
        const nowTanggal = moment().format('YYYY-MM-DD');

        if (req.session.user.peran === "Anggota" ){
            const belumchecklist =
            Jadwal_piket.count(
              {
                where: {
                  nikpicpiket: req.session.user.nik,
                  status_piket: 0,
                  tanggal: {
                    [Op.lte]: nowTanggal
                  }
              }
            });

            const tindaklanjutmeja = Bukti_temuan.count({
              where:{
                penggunaNik: req.session.user.nik,
                penilaianRuangId: {
                [Op.is]: null
                },
                tinjak_lanjut: 2
              },
              include: [
              {
                model: Penilaian_meja,
                where: {
                  [Op.or]:
                  [
                    {bobotmeja:1},
                    {bobotmeja:2}
                  ]
                },
              }]
            });
            const tindaklanjutruang = Bukti_temuan.count({
              where:{
                penggunaNik: req.session.user.nik,
                penilaianMejaId: {
                [Op.is]: null
                },
                tinjak_lanjut: 2
              },
              include: [
              {
                model: Penilaian_ruang,
                where: {
                  [Op.or]:
                  [
                    {bobotruang:1},
                    {bobotruang:2}
                  ]
                },
              }]
            });
          Promise
              .all([belumchecklist,tindaklanjutmeja,tindaklanjutruang])
              .then(count => {
                  res.locals.belumchecheklist = count[0];
                  res.locals.tindaklanjutmeja = count[1];
                  res.locals.tindaklanjutruang = count[2];
                  return next();
              })
              .catch(err => {
                  console.log(err);
              });
        }else if(req.session.user.peran === "Fasilitator"){

          const belumlaporan =
          Jadwal_piket.count(
            {
              where: {
                status_piket: { [Op.not] : 0},
                nikpicfasil: req.session.user.nik,
                persetujuan_fasil: 0
            },
          });
          const tindaklanjutmeja = Bukti_temuan.count({
            where:{
              penggunaNik: req.session.user.nik,
              penilaianRuangId: {
              [Op.is]: null
              },
              tinjak_lanjut: 2
            },
            include: [
            {
              model: Penilaian_meja,
              where: {
                [Op.or]:
                [
                  {bobotmeja:1},
                  {bobotmeja:2}
                ]
              },
            }]
            }
          );
          const tindaklanjutruang = Bukti_temuan.count({
            where:{
              penggunaNik: req.session.user.nik,
              penilaianMejaId: {
              [Op.is]: null
            },
              tinjak_lanjut: 2
            },
            include: [
            {
              model: Penilaian_ruang,
              where: {
                [Op.or]:
                [
                  {bobotruang:1},
                  {bobotruang:2}
                ]
              },
            }]
          });
        Promise
            .all([belumlaporan, tindaklanjutmeja, tindaklanjutruang])
            .then(count => {
                res.locals.belumlaporan = count[0];
                res.locals.tindaklanjutmeja = count[1];
                res.locals.tindaklanjutruang = count[2];
                return next();
            })
            .catch(err => {
                console.log(err);
            });
        }else if(req.session.user.peran === "Admin"){
           return next();
        }
  }
});
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.session = req.session;
  res.locals.csrfToken = req.csrfToken();
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
});
// routes
app.use(authRoutes);
app.use('/admin',adminRoutes);
app.use('/anggota',anggotaRoutes);
app.use('/fasilitator',fasilitatorRoutes);

app.use(errorController.get404);
// sync database
// Pengguna punya banyak jadwal_piket
Jadwal_piket.belongsTo(Pengguna, {constraints:true, onDelete:'CASCADE', foreignKey: 'nikpicpiket', as: 'nik_pic_piket'});
Jadwal_piket.belongsTo(Pengguna, {constraints:true, onDelete:'CASCADE', foreignKey: 'nikpicfasil', as: 'nik_pic_fasil'});
Pengguna.hasMany(Jadwal_piket, {foreignKey: 'nikpicpiket', as: 'PemilikJadwal'});

// pengguna punya banyak standar Meja
Pengguna.hasOne(Meja , {  foreignKey: 'penggunaNik', as: 'PemilikMeja' , onDelete:'CASCADE'});
Meja.belongsTo(Pengguna, { foreignKey: 'penggunaNik', constraints:true, onDelete:'CASCADE'});

// ruang punya PIC ruang
Pengguna.hasMany(Ruang,  {  foreignKey: 'penggunaNik', as: 'PicRuang' });
Ruang.belongsTo(Pengguna, {foreignKey: 'penggunaNik', constraints:true});

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

// Bukti temuan <- Pengguna
Bukti_temuan.belongsTo(Pengguna);
Pengguna.hasMany(Bukti_temuan);

sequelize
  .sync()
  // .sync({alter: true})
  // .sync({force: true})
  .then(result => {
    app.listen(8080);
  })
  .catch( err => {
    console.log(err);
  });
