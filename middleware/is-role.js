module.exports = function(role) {
   return function (req, res, next) {
     if (req.session.user.role !== role) {
       res.status(401);
       return res.send('Not Allowed');
     }
     next();
   }
}
