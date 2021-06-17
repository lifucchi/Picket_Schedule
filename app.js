const path = require('path');

const express = require('express');
const bodyPaser = require('body-parser');

const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();

const sequelize = require('./util/database');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');

const errorController = require('./controllers/error');

app.use(bodyPaser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin',adminRoutes.routes);

app.get('/', (req, res) => {
  res.render('login.ejs');
});

app.use(errorController.get404);

sequelize
  .sync()
  .then(result => {
    app.listen(3001);
  })
  .catch( err => {
    console.log(err);
  });
