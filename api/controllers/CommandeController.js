/**
 * CommandeController
 *
 * @description :: Server-side logic for managing commandes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	createCommande: function (req, res) {
		User.findOne(req.session.userId)
			.populate('commandes')
			.exec( function (err, user){
				if (err){
					return res.negotiate(err);
				}

				if(!user){
					return res.notFound();
				}
				var devis = {
					from: user.fullname, 
					commande: req.param('commande'), 
					to: req.param('to')
				}; 

				Commande.create(devis).exec (function (err, devisCreated){
					if (err){
						return res.negotiate(err);
					}

					return res.json(devisCreated); 
				})
			})
	}
};

