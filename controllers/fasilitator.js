exports.getDashboard = (req,res) => {
  // res.send('<h1>hello admin</h1>')
  res.render('./fasilitator/dashboard', {
    pageTitle: 'Dashboard',
    path: '/'
  });
};
