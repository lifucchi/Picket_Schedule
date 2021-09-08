module.exports = function(role) {
   return function (req, res, next) {
     console.log("ini role");
     console.log(role);
     console.log("ini user");
     console.log(req.session.user.peran);
     if (req.session.user.peran !== role) {
       res.status(401);
       return  res.render('./error/error_404', { pageTitle: 'Not Allowed' });
     }
     next();
   }
}
