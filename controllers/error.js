exports.get404 = (req, res, next) => {
  res.status(404).render('./error/error_404', { pageTitle: 'Page Not Found' });
};
