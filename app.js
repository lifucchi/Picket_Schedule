const path = require('path');

const express = require('express');
const bodyPaser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');

app.use(bodyPaser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin',adminRoutes.routes);
// 
// app.get('/', (req, res) => {
//   console.log("hello");
//   res.send('<h1>hello</h1>')
// });

app.listen(3001);
