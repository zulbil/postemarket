

module.exports = function isCustomer (req, res, next) {
	if (!req.session.userId) { 
    if (req.wantsJSON) {
      return res.forbidden('You are not permitted to perform this action.');
    }
    return res.redirect('/');
  }
 
  User.findOne(req.session.userId).exec(function(err, foundUser){  
 
    if (err) return res.negotiate(err);
 
    if (!foundUser) { 
      if (req.wantsJSON) {
        return res.forbidden('You are not permitted to perform this action.');
      }
      return res.redirect('/');
    }
 
    if (foundUser.role == 'customer') { 
      return next();
    } else {       
      if (req.wantsJSON) {
        return res.forbidden('You are not permitted to perform this action.');
      }
      return res.redirect('/');
    }
 })
}