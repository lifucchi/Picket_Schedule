const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

router.get('/' , (req,res) => {
  res.send('<h1>hello admin</h1>')
  // res.render('shop');
});



exports.routes = router;
// exports.products = products;
