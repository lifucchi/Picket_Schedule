exports.get404 = (req, res, next) => {
  res.status(404).render('./error/error_404', { pageTitle: 'The requested URL was not found on this server.' });
};

exports.get500 = (req, res, next) => {
  res.status(500).render('./error/error_404', { pageTitle: 'The requested URL was not found on this server.' });
};

// exports.get401 = (req, res, next) => {
//   res.status(401).render('./error/error_404', { pageTitle: 'Not Allowed' });
// };
