/**
 * DevisController
 *
 * @description :: Server-side logic for managing devis
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	createDevis: function (req, res) {
		User.findOne(req.session.userId)
			.populate('devis')
			.exec( function (err, user){
				if (err){
					return res.negotiate(err);
				}

				if(!user){
					return res.notFound();
				}
				var devis = {
					from: user.fullname, 
					devis: req.param('devis'), 
					to: req.param('to')
				}; 

				Devis.create(devis).exec (function (err, devisCreated){
					if (err){
						return res.negotiate(err);
					}

					return res.json(devisCreated); 
				})
			})
	}
};

