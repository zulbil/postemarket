/**
 * OrderController
 *
 * @description :: Server-side logic for managing Orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Cart = require('../../cart.js');

module.exports = {
	
		checkout: function (req, res){

			if(!req.session.cart){
				return res.redirect('/app/cart');
			}

			var cart = new Cart(req.session.cart); 

			var cartCreated = cart; 
			
			var stripe = require("stripe")(sails.config.stripe.secretKey);

			stripe.charges.create({
			  amount: cart.totalPrice * 100,
			  currency: "usd",
			  source: req.body.source, 
			  description: "Charge for shopping"
			}, function(err, charge) {
			   if (err){
			   	res.json(err.message);
			   	return res.redirect('/app/checkout');
			   }

			   User.findOne(req.session.userId)
				.exec(function  (err, userFound) {
					if(err) { return negotiate(err); }

				var order = {
					user: userFound.id, 
					cart: JSON.stringify(cartCreated), 
					address: req.param('address'), 
					paymentId: charge.id,
					name: req.param('name')
				};

				Order.create(order)
					 .exec(function (err, orderCreated){
					   	if(err){
					   		console.log(err);
					   	}
					   	console.log(orderCreated);
					   	return res.ok();
					   })
				})

			   cart = null;
			   req.session.cart = cart; 
			   console.log(req.session.cart); 
			   return res.redirect('/');
			});
	}, 

	getAllOrders: function (req, res){
		Order.find()
			 .populate('user')
			 .exec (function (err, orders){
			 	if (err){
			 		return res.negotiate(err);
			 	}

			 	if(!orders){
			 		return res.notFound();
			 	}

			 	return res.json(orders); 
			 })
	}, 

	getOrderBySupplier: function (req, res){
		var criteria = {id: req.session.userId.id};
		User.findOne(criteria)
			.exec( function (err, userFound){
				if (err){
					return res.negotiate(err);
				}

				if (!userFound){
					return res.notFound();
				}

				Order.find()
					 .exec( function (err, orders){
					 	if (err){
					 		return res.negotiate(err);
					 	}

					 	_.each(orders, function (order){
					 		var cart = new Cart(order.cart); 
					 		_.each(cart.items, function(item){
					 			if(item.owner === userFound.id){
					 				console.log(item); 
					 			}
					 		})

					 	}); 

					 	return res.ok();  
					 })
			})
	}, 

	getOrderByUser: function (req, res){
		User.findOne({id: req.param('id')})
			.exec( function (err, userFound){
				if (err){
					return res.negotiate(err);
				}

				if (!userFound){
					return res.notFound();
				}

				Order.find({user: userFound})
					 .exec( function (err, orders){
					 	if (err){
					 		return res.negotiate(err);
					 	}

					 	return res.json(orders); 
					 })
			})
	}, 

};

