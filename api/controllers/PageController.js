/**
 * PageController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 
var Cart = require('../../cart.js');
var Compare = require('../../compare.js');

module.exports = {

	showDashboardPage: function (req, res){
		if(!req.session.userId){
			console.log(req.session);
			return res.redirect('/');
		}
		if(req.session.userId){
			User.findOne(req.session.userId)
				.populate('products')
				.exec(function (err, user){
				if(err){
					console.log(req.session);
					return res.negotiate(err);
				}
				if(!user){
					console.log(req.session);
					sails.log.verbose('Session refers to a user who no longer exist'); 
					return res.redirect('/'); 
				}

				Devis.find({to: user.fullname})
					 .exec(function (err, devisFound){
					 	if (err){
					 		return res.negotiate(err);
					 	}

					 	console.log(req.session);
						return res.view('user/dashboard', {
							layout: 'user/mainUserLayout',
							me: {
								id: user.id, 
								username: user.username, 
								fullname: user.fullname,
								products: user.products, 
								profilePicture: user.profilePicture, 
								role: user.role
							}, 
							devis: devisFound
						}); 
					 })
			}); 
		}
	}, 

		showManagementDevisPage: function (req, res){
		if(!req.session.userId){
			console.log(req.session);
			return res.redirect('/');
		}
		if(req.session.userId){
			User.findOne(req.session.userId)
				.populate('products')
				.exec(function (err, user){
				if(err){
					console.log(req.session);
					return res.negotiate(err);
				}
				if(!user){
					console.log(req.session);
					sails.log.verbose('Session refers to a user who no longer exist'); 
					return res.redirect('/'); 
				}

				Devis.find({to: user.fullname})
					 .exec(function (err, devisFound){
					 	if (err){
					 		return res.negotiate(err);
					 	}

					 	console.log(req.session);
						return res.view('user/devis', {
							layout: 'user/mainUserLayout',
							me: {
								id: user.id, 
								username: user.username, 
								fullname: user.fullname,
								products: user.products, 
								profilePicture: user.profilePicture, 
								role: user.role
							}, 
							devis: devisFound
						}); 
					 })
			}); 
		}
	}, 

	showManagementCommandePage: function (req, res){
		if(!req.session.userId){
			console.log(req.session);
			return res.redirect('/app/login');
		}
		if(req.session.userId){
			User.findOne(req.session.userId)
				.populate('products')
				.exec(function (err, user){
				if(err){
					console.log(req.session);
					return res.negotiate(err);
				}
				if(!user){
					console.log(req.session);
					sails.log.verbose('Session refers to a user who no longer exist'); 
					return res.redirect('/'); 
				}

				Commande.find({to: user.fullname})
					 .exec(function (err, devisFound){
					 	if (err){
					 		return res.negotiate(err);
					 	}

					 	console.log(req.session);
						return res.view('user/commandes', {
							layout: 'user/mainUserLayout',
							me: {
								id: user.id, 
								username: user.username, 
								fullname: user.fullname,
								products: user.products, 
								profilePicture: user.profilePicture, 
								role: user.role
							}, 
							devis: devisFound
						}); 
					 })
			}); 
		}
	}, 

	showDevisDetailPage: function (req, res){
		var devisId = { id: req.param('id')}; 
			if (!req.session.userId){
				return res.redirect('/app/login'); 
			}

		    User.findOne(req.session.userId)
		    	.populate('products')
		    	.exec (function (err, userFound){
		    		if (err){
		    			return res.negotiate(err);
		    		}

		    		if (!userFound){
		    			return res.notFound(); 
		    		}

		    		Devis.findOne(devisId)
		    			 .exec( function (err, devisFound){
		    			 	if (err){
		    			 		return res.negotiate(err); 
		    			 	}

		    			 	return res.view('user/devis-detail',{
		    			 		layout: 'user/mainUserLayout', 
		    			 		me: {
		    			 			id: userFound.id, 
		    			 			products: userFound.products,
		    			 			fullname: userFound.fullname, 
		    			 			username: userFound.username, 
		    			 			profilePicture: userFound.profilePicture, 
		    			 			role: userFound.role
		    			 		}, 
		    			 		oneDevis: devisFound
		    			 	})
		    			 })
		    	})
		
	},

	showCommandeDetailPage: function (req, res){
		var devisId = { id: req.param('id')}; 
			if (!req.session.userId){
				return res.redirect('/app/login'); 
			}

		    User.findOne(req.session.userId)
		    	.populate('products')
		    	.exec (function (err, userFound){
		    		if (err){
		    			return res.negotiate(err);
		    		}

		    		if (!userFound){
		    			return res.notFound(); 
		    		}

		    		Commande.findOne(devisId)
		    			 .exec( function (err, devisFound){
		    			 	if (err){
		    			 		return res.negotiate(err); 
		    			 	}

		    			 	return res.view('user/commande-detail',{
		    			 		layout: 'user/mainUserLayout', 
		    			 		me: {
		    			 			id: userFound.id, 
		    			 			products: userFound.products,
		    			 			fullname: userFound.fullname, 
		    			 			username: userFound.username, 
		    			 			profilePicture: userFound.profilePicture, 
		    			 			role: userFound.role
		    			 		}, 
		    			 		oneDevis: devisFound
		    			 	})
		    			 })
		    	})
		
	},

	showProductPage: function (req, res){
		if(!req.session.userId){
			console.log(req.session);
			return res.redirect('/')
		}
		if(req.session.userId){
			User.findOne(req.session.userId, function (err, user){
				if(err){
					console.log(req.session);
					return res.negotiate(err);
				}
				if(!user){
					console.log(req.session);
					sails.log.verbose('Session refers to a user who no longer exist'); 
					return res.redirect('/'); 
				}

				console.log(req.session);
				return res.view('user/product', {
					layout: 'user/mainUserLayout',
					me: {
						id: user.id, 
						username: user.username, 
						fullname: user.fullname,
						products: user.products, 
						profilePicture: user.profilePicture, 
						role: user.role
					}
				}); 
			});
		}
	}, 

	showProfilePage: function (req, res){
		if(!req.session.userId){
			console.log(req.session);
			return res.redirect('/');
		}
		if(req.session.userId){
			User.findOne(req.session.userId, function (err, user){
				if(err){
					console.log(req.session);
					return res.negotiate(err);
				}
				if(!user){
					console.log(req.session);
					sails.log.verbose('Session refers to a user who no longer exist'); 
					return res.redirect('/'); 
				}

				console.log(req.session);
				return res.view('user/home', {
					layout: 'user/mainUserLayout',
					me: {
						id: user.id, 
						username: user.username, 
						fullname: user.fullname,
						profilePicture: user.profilePicture, 
						role: user.role, 
						tel: user.tel, 
						address: user.address, 
						city: user.city, 
						createdAt: user.createdAt
					}
				}); 
			});
		}
	}, 

	showAdminPage: function (req, res){
		if(!req.session.userId){
			console.log(req.session);
			return res.redirect('/')
		}
		if(req.session.userId){
			User.findOne(req.session.userId, function (err, user){
				if(err){
					console.log(req.session);
					return res.negotiate(err);
				}
				if(!user){
					console.log(req.session);
					sails.log.verbose('Session refers to a user who no longer exist'); 
					return res.redirect('/'); 
				}

				return res.view('user/admin/administration', {
					layout: 'user/mainUserLayout',
					me: {
						id: user.id, 
						username: user.username, 
						fullname: user.fullname,
						profilePicture: user.profilePicture, 
						role: user.role, 
						tel: user.tel, 
						address: user.address, 
						city: user.city, 
						createdAt: user.createdAt
					}
				}); 
			});
		}
	}, 

	showUserProfile: function (req, res){
		var criteria = {id: req.param('id')}; 
	
		User.findOne({id:req.session.userId.id}).exec(function (err, user){
			if(err){
				return res.negotiate(err);
			}
			if(!user){
				return res.notFound();
			}
			
			User.findOne(criteria).exec(function (err, userFound){
					if (err) { return res.negotiate(err); }
					return res.view('user/admin/userProfile', {
					me:user,
					userFound: userFound
				});
			})
		})
	}, 
	
	passwordReset: function (req, res){
		return res.view('passwordRecovery/password-recovery-email', {
			me: null, 
			passwordRecoveryToken : req.param('passwordRecoveryToken')
		}); 
	}, 

	showHomePage: function (req, res) {
		if(!req.session.userId){
			return res.view('./front/home', {
			layout: './front/frontLayout', 
			me: null, 
			product:null, 
			cart: req.session.cart? req.session.cart : {products: [], totalQty: 0, totalPrice: 0}
			});
		}


		User.findOne(req.session.userId).exec(function (err, user){
			if(err){
				return res.negotiate(err);
			}
			if(!user){
				return res.notFound();
			}
			return res.view('front/home', {
				layout: './front/frontLayout', 
				me: {
						id: user.id, 
						username: user.username, 
						fullname: user.fullname,
						profilePicture: user.profilePicture, 
						role: user.role, 
						tel: user.tel, 
						address: user.address, 
						city: user.city, 
						createdAt: user.createdAt 

				},
				product: null, 
				cart: req.session.cart? req.session.cart : {products: [], totalQty: 0, totalPrice: 0}
			});
		})
		
	}, 

	showLoginFrontPage: function (req, res){
		if(!req.session.userId){
			return res.view('front/loginFront'); 	
		}
		return res.redirect('/'); 
	}, 

	showForgotPage: function (req, res){
			if (!req.session.userId){
				return res.view('front/forgot'); 
			}
			return res.redirect('/'); 	
	}, 

	showRegisterFrontPage: function (req, res){
		if(!req.session.userId){
			return res.view('front/registerFront'); 	
		}
		return res.redirect('/'); 
	}, 

	showProductAppPage: function (req, res){
		return res.view('front/products', {
			layout: 'front/frontLayout'
		});
	}, 

	showOneProductAppPage: function (req, res){

		var productId = { id: req.param('id')};

		Product.findOne(productId)
			   .populate('owner')
			   .populate('comments')
			   .exec( function (err, product){
					if(err){
						return res.negotiate(err);
					}
					if(!product){
						return res.notFound();
					}

						Product.find({category: product.category})
							   .exec( function (err, similarProducts){
							   	if (err) return res.negotiate(err); 
							   	if (!similarProducts) return res.notFound(); 

								return res.view('./front/productDetail', {
									layout: './front/frontLayout',
									product: {
										id: product.id, 
										name: product.name, 
										category: product.category, 
										price: product.price, 
										picture: product.picture, 
										morePictures: product.morePictures, 
										quantity: product.quantity,  
										comments: product.comments, 
										createdAt: product.createdAt, 
										description: product.description, 
										owner: product.owner
									}, 
									me: req.session.userId, 
									cart: req.session.cart? req.session.cart : {products: [], totalQty: 0, totalPrice: 0},
									relatedProducts: similarProducts
								});

							   })
				})
	}, 

	showCartPage: function (req, res){
		if(!req.session.cart){
			return res.view('./front/cart', {
			layout: './front/frontLayout', 
			me: req.session.userId, 
			cart: {
				products: [], 
				totalQty: 0, 
				totalPrice: 0
			}
		  })
		}

		console.log(req.session.cart); 
		
		return res.view('./front/cart', {
			layout: './front/frontLayout', 
			me: req.session.userId, 
			cart: {
				products: req.session.cart.items,
				totalQty: req.session.cart.totalQty,
				totalPrice: req.session.cart.totalPrice
			}
		}); 
	},
	showContactPage: function (req, res){
		return res.view('./front/contact', {
			layout: './front/frontLayout', 
			product: null, 
			cart: req.session.cart? req.session.cart : {products: [], totalQty: 0, totalPrice: 0},
			me: req.session.userId? req.session.userId: null
		})
	}, 

	showComparePage: function (req, res){
		return res.view('./front/compare', {
			layout: './front/frontLayout', 
			cart: req.session.cart? req.session.cart : {products: [], totalQty: 0, totalPrice: 0},
			compare: req.session.compare, 
			me: req.session.userId? req.session.userId: null
		})
	}, 

	showCheckoutPage: function (req, res){
		if(!req.session.userId){
			return res.redirect('/app/login'); 
		}

		if(!req.session.cart){
			return res.redirect('/app/cart'); 
		}
		User.findOne(req.session.userId).exec(function (err, user){
			if(err){
				return res.negotiate(err);
			}
			if(!user){
				return res.notFound();
			}
			return res.view('front/checkout', {
				layout: './front/frontLayout', 
				me: {
						id: user.id, 
						username: user.username, 
						fullname: user.fullname,
						profilePicture: user.profilePicture, 
						role: user.role, 
						tel: user.tel, 
						address: user.address, 
						city: user.city, 
						createdAt: user.createdAt 

				},
				product: null, 
				cart: req.session.cart? req.session.cart : {products: [], totalQty: 0, totalPrice: 0}
			});
		})
	}, 

	showCategoryPage: function (req, res){
		var criteria = { category: req.param('name')};

		Product.find(criteria)
			   .populate('comments')
			   .exec (function (err, products){
			if(err){
				return res.negotiate(err);
			}

			if(!products){
				return res.notFound(); 
			}

			return res.view('front/category', {
				layout: './front/frontLayout', 
				me: req.session.userId?req.session.userId : null,  
				productPerCategory: products,
				cart: req.session.cart? req.session.cart : {products: [], totalQty: 0, totalPrice: 0}
			});
		})
	}, 

	showOrderPage : function (req, res){
		if(!req.session.userId){
			return res.redirect('/'); 
		}

		var criteria = { user : req.session.userId.id }; 
		Order.find(criteria)
			 .exec (function (err, orders) {
			 	if (err){
			 		return res.negotiate(err); 
			 	}

			 	if(!orders){
			 		return res.notFound(); 
			 	}

			 	orders.forEach( function (order){
			 		var cart = new Cart (order.cart); 
			 		order.items = cart.toArray(); 
			 	})
			 	console.log(orders);
			 	return res.view('front/orderList', {
			 		layout: './front/frontLayout', 
			 		me: req.session.userId, 
			 		cart: req.session.cart? req.session.cart : {products: [], totalQty: 0, totalPrice: 0}, 
			 		orders: orders
			 	}); 
			 })
	}, 

	showDevisPage: function (req, res){
		if(!req.session.userId){
			return res.redirect('/');
		}

		return res.view('front/management-devis', {
			layout: './front/frontLayout', 
			me: req.session.userId, 
			cart: req.session.cart? req.session.cart : {products: [], totalQty: 0, totalPrice: 0}
		});
	}, 

	showManufacturerPage: function (req, res){
		return res.view('front/manufacturers', {
			layout: './front/frontLayout', 
			me: req.session.userId, 
			cart: req.session.cart? req.session.cart : {products: [], totalQty: 0, totalPrice: 0}
		});
	}, 

	showManufacturerDetailPage: function (req, res){
		User.findOne({id: req.param('id')})
			.populate('products')
			.exec( function (err, supplier){
				if(err){
					return res.negotiate(err); 
				}

				if(!supplier){
					return res.notFound();
				}

				return res.view('front/manufacturer-detail', {
					layout: './front/frontLayout', 
					me: req.session.userId, 
					supplier: supplier,
					devis: req.session.devis,
					cart: req.session.cart? req.session.cart : {products: [], totalQty: 0, totalPrice: 0}
				});
			})
	}, 
	
	showOrderDetailPage : function (req, res){
	    if(!req.session.userId){
	      return res.redirect('/');
	    }

	    var criteria = { id : req.param('id')};
	    
	    User.findOne({id: req.session.userId.id}).exec( function (err, user){
	    	if (err) { 
	    		return res.negotiate(err); 
	    	}
		    Order.findOne(criteria)
			      .exec (function (err, order) {
			        if (err){
			          return res.negotiate(err);
			        }

			        if(!order){
			          return res.notFound();
			        }

			        console.log(order);
			        return res.view('front/detailOrder', {
			          layout: './front/frontLayout',
			          me: user,
			          cart: req.session.cart? req.session.cart : {products: [], totalQty: 0, totalPrice: 0},
			          order: order
			        });
			      })
			    }) 
  	}, 

  	showCustomerProfile: function (req, res) {
  		User.findOne(req.session.userId)
  			.exec(function (err, me){
  				if (err) { return res.negotiate(err); }

  				return res.view('front/profile', {
  					layout: './front/frontLayout',
  					me: me
  				}); 
  			})
  	}
};

