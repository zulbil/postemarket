
module.exports = function isLoggedOut (req, res, next) {
	if(!req.session.userId){
		return next();
	}

	if(req.wantsJSON){
		return res.forbidden('you are not permitted to perform this action'); 
	}
	req.session.oldUrl = req.url; 
	return res.redirect('/'); 
}