/**
 * CategoryController
 *
 * @description :: Server-side logic for managing categories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	// On recupère les categories par leur nom
	categoryByName: function (req, res) {
		var criteria = {name: req.param('name')};

		Category.findOne(criteria).exec(function (err, category){
			if(err){
				return res.negotiate(err);
			}
			if(! category){
				return res.notFound();
			}
			return res.json(category);
		})
	}, 

	categoryByParent: function (req, res){
		var criteria = { parent: req.param('name')};
		Category.find(criteria).exec(function (err, category){
			if(err){
				return res.negotiate(err);
			}
			if(! category){
				return res.notFound();
			}
			return res.json(category);
		})
	}, 

	all: function(req, res){
		Category.find().exec(function (err, categories){
			if(err){
				return res.negotiate(err);
			}
			if(! categories){
				return res.notFound();
			}
			return res.json(categories);
		})
	},

	allCategories: function (req, res){
		Category.find({ 
			name: {'!':[
				'Electronics, Computers & Office', 
				'Clothing, Shoes & Jewelry',
				'Books & Audible', 
				'Movies, Music & Games'
			  ]}}).exec(function (err, categories){
					if(err){
						return res.negotiate(err);
					}
					if(! categories){
						return res.notFound();
					}
					return res.json(categories);
			})
	}
};

