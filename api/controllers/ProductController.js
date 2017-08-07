/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Cart = require('../../cart.js');
var Compare = require('../../compare.js');

module.exports = {
	
	getAllProducts: function (req, res){

		Product.find()
			   .populate('owner')
			   .populate('comments')
			   .exec(function (err, products){
			   	if(err){
			   		return res.negotiate(err); 
			   	}
			   	if(!products){
			   		return res.json("No products found"); 
			   	}
			   	return res.json(products); 

			   })
	}, 

	getProductOne: function (req, res){
		Product.findOne(req.param('id'))
			   .populate('owner')
			   .populate('comments')
			   .exec(function (err, product){
			   	if(err){
			   		return res.negotiate(err); 
			   	}
			   	if(!product){
			   		return res.json("that product is not found"); 
			   	}
			   	return res.json(product); 
			   })
	}, 

	createProduct: function (req, res){
		User.findOne(req.session.userId)
			.exec(function  (err, userFound) {
				if(err) { return negotiate(err); }
				//if(!userFound) {return res.notFound(); }
			var product = {
				name: req.param('name'), 
				category: req.param('category'), 
				price: req.param('price'), 
				picture: req.param('picture'), 
				morePictures: req.param('morePictures'), 
				quantity: req.param('quantity'),  
				status: req.param('status'), 
				createdAt: req.param('createdAt'), 
				description: req.param('description'), 
				owner: userFound.id
			};

			Product.create(product)
				   .exec(function (err, product){
				   	if(err){
				   		console.log(err);
				   		return res.negotiate(err);
				   	}
				   	return res.json(product);
				   })
				})
	
	}, 

	updateProduct: function (req, res){
		var product = {}; 
		product = _.merge({}, req.params.all(), req.body); 

		if(!req.param && req.param('id')){
			return res.badRequest("Id parameter is required"); 
		}

		Product.update(req.param('id'), product, function (err, productUpdated){
					if(err) return res.negotiate(err); 
					//if(!productUpdated) return res.notFound(); 
					return res.json(productUpdated);
				});
	},

	deleteProduct: function(req, res){
		if(!req.param && req.param('id')){
			return res.badRequest("Id parameter is required"); 
		}

		Product.destroy(req.param('id')).exec(function (err, productFound){
			if (err) return res.negotiate(err); 
			if(productFound.length === 0){
				return res.notFound(); 
			}

			return res.ok();
		});
	}, 

	addToCart: function (req, res) {
		var productId = { id: req.param('id')}; 
		var cart = new Cart(req.session.cart ? req.session.cart : {}); 

		if(!req.param){
			return res.badRequest("You should provide an Id Parameter"); 
		}

		Product.findOne(productId)
			   .exec(function (err, product){
				   	if(err){
				   		return res.negotiate(err);
				   	}
			   		cart.add(product, product.id);
			   		req.session.cart = cart; 
			   		console.log(req.session.cart);

			   		return res.ok();
			   })
	}, 

	addToCompare: function (req, res) {
		var productId = { id: req.param('id')}; 
		var compare = new Compare(req.session.compare ? req.session.compare : {}); 

		if(!req.param){
			return res.badRequest("You should provide an Id Parameter"); 
		}

		Product.findOne(productId)
			   .exec(function (err, product){
				   	if(err){
				   		return res.negotiate(err);
				   	}
			   		compare.add(product, product.id);
			   		req.session.compare = compare; 
			   		console.log(req.session.compare);

			   		return res.ok();
			   }); 
	}, 

	reduceItemToTheCart : function (req, res){
		var productId = { id: req.param('id')}; 
		var cart = new Cart(req.session.cart ? req.session.cart : {}); 

		if(!req.param){
			return res.badRequest("You should provide an Id Parameter"); 
		}

		Product.findOne(productId)
			   .exec(function (err, product){
				   	if(err){
				   		return res.negotiate(err);
				   	}
			   		cart.reduceByOne(product.id);
					req.session.cart = cart; 
					return res.redirect('/app/cart'); 
			   })	
	},

	removeItemToCompare : function (req, res){
		var productId = { id: req.param('id')}; 
		var compare = new Compare(req.session.compare ? req.session.compare : {}); 

		if(!req.param){
			return res.badRequest("You should provide an Id Parameter"); 
		}

		Product.findOne(productId)
			   .exec(function (err, product){
				   	if(err){
				   		return res.negotiate(err);
				   	}
			   		compare.remove(product.id);
					req.session.compare = compare; 
					return res.ok(); 
			   })	
	},
	
	removeItemToTheCart : function (req, res){
		var productId = { id: req.param('id')}; 
		var cart = new Cart(req.session.cart ? req.session.cart : {}); 

		if(!req.param){
			return res.badRequest("You should provide an Id Parameter"); 
		}

		Product.findOne(productId)
			   .exec(function (err, product){
				   	if(err){
				   		return res.negotiate(err);
				   	}
			   		cart.remove(product.id);
					req.session.cart = cart; 
					return res.redirect('/app/cart'); 
			   })	
	},
	addItemToTheCart: function (req, res){
		var productId = { id: req.param('id')}; 
		var cart = new Cart(req.session.cart ? req.session.cart : {}); 

		if(!req.param){
			return res.badRequest("You should provide an Id Parameter"); 
		}

		Product.findOne(productId)
			   .exec(function (err, product){
				   	if(err){
				   		return res.negotiate(err);
				   	}
			   		cart.addByOne(product.id);
					req.session.cart = cart; 
					return res.redirect('/app/cart'); 
			   })
	},

	getAllProductPerCategories: function (req, res){
		var category = { category: req.param('name')}; 

		if(!req.param){
			return res.badRequest("You should provide an Id Parameter"); 
		}

		Product.find(category)
			   .exec( function (err, products){
			   	if(err){
			   		return res.negotiate(err);
			   	}
			   	if(!products){
			   		return res.notFound();
			   	}
			   	return res.json(products);
			   })
	}, 
 
	allCommentsByProduct: function (req, res){
		Product.find()
				.populate('comments')
				.exec( function (err, products){
					if (err){
						return res.negotiate(err); 
					}

					if(!products){
						return res.notFound();
					}

					return res.json(products); 
				})
	}, 

	searchProduct: function (req, res){
		Product.count().exec( function (err, found){
			if (err) return res.negotiate(err); 
			if (!found) return res.notFound(); 

			Product.find({
				or: [
					{
						name: {
							'contains': req.param('searchCriteria')
						}, 
						description: {
							'contains': req.param('searchCriteria')
						}, 
						category: {
							'contains': req.param('searchCriteria')
						}
					}
				]
			})
			.populate('owner')
			.populate('comments')
			.exec( function (err, productFound){
				if (err){
					return res.negotiate(err);
				}

				console.log(productFound); 
				return res.json(productFound); 
			})
		})
	}
};

