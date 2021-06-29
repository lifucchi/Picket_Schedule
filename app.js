const path = require('path');

const express = require('express');
const bodyPaser = require('body-parser');

const session = require('express-session');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const app = express();
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
const Penilaian = require('./models/penilaian');
const Ruang = require('./models/ruang');
const Meja = require('./models/meja');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');



app.use(bodyPaser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
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
  Pengguna.findByPk(req.session.user._id)
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
app.use(errorController.get404);

// sync database
// Pengguna punya banyak jadwal_piket
// Pengguna.hasMany(Jadwal_piket);
Jadwal_piket.belongsTo(Pengguna, {constraints:true, onDelete:'CASCADE', as: 'nik_pic_piket'});
Jadwal_piket.belongsTo(Pengguna, {constraints:true, onDelete:'CASCADE', as: 'nik_pic_fasil'});


// pengguna punya banyak standar Meja
Pengguna.hasMany(Meja);
Meja.belongsTo(Pengguna, {constraints:true, onDelete:'CASCADE'});

// ruang punya PIC ruang
Pengguna.hasMany(Ruang);
Ruang.belongsTo(Pengguna, {constraints:true, onDelete:'CASCADE'});

// ruang --> penilaian ruang <-- jadwal piket
Ruang.belongsToMany(Jadwal_piket, { through: Penilaian_ruang });
Jadwal_piket.belongsToMany(Ruang, { through: Penilaian_ruang });

// meja --> penilaian meja <-- jadwal piket
Meja.belongsToMany(Jadwal_piket, { through: Penilaian_meja });
Jadwal_piket.belongsToMany(Meja, { through: Penilaian_meja });


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
