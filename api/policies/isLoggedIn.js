
module.exports = function  isLoggedIn (req, res, next) {
	
	if(req.session.userId){
		return next(); 
	}

	if(req.wantsJSON){
		return res.forbidden("You are not permitted to perform this action");
	}

	req.session.oldUrl = req.url; 
	return res.redirect('/'); 
}