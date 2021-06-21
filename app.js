const path = require('path');

const express = require('express');
const bodyPaser = require('body-parser');

const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();

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

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');

const errorController = require('./controllers/error');

app.use(bodyPaser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/admin',adminRoutes.routes);


app.get('/', (req, res) => {
  res.render('./login/login.ejs');
});

app.use(errorController.get404);

// sync database
// Pengguna punya banyak jadwal_piket
Pengguna.hasMany(Jadwal_piket, {foreignKey: 'nik_pic_fasil' });
Jadwal_piket.belongsTo(Pengguna, {constraints:true, onDelete:'CASCADE'});




sequelize
  .sync()
  // .sync({force: true})
  .then(result => {
    app.listen(3001);
  })
  .catch( err => {
    console.log(err);
  });
