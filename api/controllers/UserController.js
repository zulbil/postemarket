/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var emailAddress = require('machinepack-emailaddresses'); 
var passwords = require('machinepack-passwords'); 
var Strings = require('machinepack-strings'); 
var Mailgun = require('machinepack-mailgun');

module.exports = {
	
	signup: function (req, res){
		if(_.isUndefined(req.param('email'))){
			return res.badRequest('An email is required'); 
		}

		if(_.isUndefined(req.param('fullname'))){
			return res.badRequest('Your fullname is required'); 
		}

		if(_.isUndefined(req.param('password'))){
			return res.badRequest('A password is required'); 
		}

		if(_.isUndefined(req.param('username'))){
			return res.badRequest('Username is required'); 
		}

		if(req.param('username').length < 6){
			return res.badRequest('A Username should have a least 6 characters'); 
		}

		if(req.param('password').length < 6){
			return res.badRequest('Your password should have a least 6 characters'); 
		} 

		// using machine packs for validating the email format
		emailAddress.validate({
			string: req.param('email')
		}).exec({
			error: function (err){
				return res.serverError(err); 
			}, 
			invalid: function (){
				return res.badRequest('Doesn\'t like a valid email');
			}, 
			success: function (){
			//using machine packs for encrypting password
			passwords.encryptPassword({
				password: req.param('password')
			}).exec({
				error: function (err){
					return res.serverError(err);
				}, 
				invalid: function (){
					return res.badRequest("It's an invalid password");
				}, 
				success: function (result){
					var user = {
						fullname: req.param('fullname'), 
						email: req.param('email'), 
						username: req.param('username'),
						role: req.param('role'),
						password : result
					}; 

					User.create(user).exec(function (err, userCreated){
						if (err){
							if (err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0] && err.invalidAttributes.email[0].rule === 'unique') {
 
                              return res.alreadyInUse(err);
                             }
 
                           if (err.invalidAttributes && err.invalidAttributes.username && err.invalidAttributes.username[0] && err.invalidAttributes.username[0].rule === 'unique') {
 
                                 return res.alreadyInUse(err);
                             }
							return res.negotiate(err);
						}
						req.session.userId = userCreated; 
						return res.json(userCreated);
					});
				}
			})
		  }
		})
	}, 

	login : function (req, res){
		User.findOne({
			or: [
				{email: req.param('email')}, 
				{username: req.param('username')}
			]
		}, function fondUser(err, userFound){
			if (err) return res.negotiate(err); 
			if(!userFound) {
				return res.notFound();
			}
			passwords.checkPassword({
				passwordAttempt: req.param('password'),
        		encryptedPassword: userFound.password
			}).exec({
				error: function (err){
					return res.negotiate(err);
				}, 
				incorrect: function (){
					return res.badRequest("Username or Password are incorrect, Please try again"); 
				}, 
				success : function (){
					if(userFound.deleted){
						return res.forbidden("'Your account has been deleted. Please visit ecommerce.com/restore to restore your account'"); 
					}
					if(userFound.banned){
						return res.forbidden("'Your account has been banned completly because you didn't respect the use term of our site"); 
					}
					// Store user id in a session
					req.session.userId = userFound;
					console.log(req.session); 
					if(req.session.oldUrl){
						var myoldUrl = req.session.oldUrl; 
						console.log(myoldUrl); 
						req.session.oldUrl = null; 
						return res.redirect(myoldUrl); 
					} 
					return res.json(userFound); 
				}
			})
		})
	}, 


	profile : function (req, res){
		if(!req.param && !req.param('id')){
			return res.json("You should provide parameter"); 
		}

		else {
		
			User.findOne(req.param('id'))
				.populate('products')
				.exec(function (err, userFound){
				if(err){
					return res.negotiate(err);
				}
				if (!userFound){
					return res.notFound();
				}

				return res.json(userFound); 
			});
		}
	}, 

	setSession : function (req, res){
		req.session.userId = req.param('sessionVar'); 

		return res.json(req.session.userId || 'Not set yet'); 
	}, 

	getSession : function(req, res){
		return res.json(req.session.userId || 'Not set yet'); 
	}, 

	logout : function(req, res){
		if(!req.session.userId){
			return res.redirect('/'); 
		}
		User.findOne(req.session.userId).exec(function (err, userFound){
			if (err){
				return res.negotiate(err); 
			}
			if(!userFound){
				sails.log.verbose("User no longer exist");
				return res.redirect('/');
			}
			req.session.userId = null; 
			req.session.cart = null; 
			req.session.compare = null;
			console.log(req.session); 
			return res.redirect('/'); 
		});
	}, 

	delete: function (req, res){
		if(!req.param && req.param('id')){
			return res.badRequest("Id parameter is required"); 
		}

		User.destroy(req.param('id')).exec(function (err, userFound){
			if (err) return res.negotiate(err); 
			if(userFound.length === 0){
				return res.notFound(); 
			}

			return res.ok();
		});
	}, 

	removeProfile : function (req, res){
		if(!req.param && req.param('id')){
			return res.badRequest("Id parameter is required"); 
		}
		User.update(
			{id:req.param('id')},
			{deleted: true}, function (err, userToRemove){
				if(err) return res.negotiate(err); 
				if(userToRemove.length === 0){
					return res.notFound(); 
				}
				req.session.userId= null; 
				return res.ok(); 
			}
			)
	},  

	updateProfile: function  (req, res) {
		var user = _.merge({}, req.params.all(), req.body); 
		var id = req.param('id'); 

		if(!id){
			return res.badRequest('You should provide an Id'); 
		}

		User.update(id, user, function (err, userUpdated){
			if(err){
				return res.negotiate(err);
			}
			if (!userUpdated){
				return res.notFound();
			}
			return res.json(userUpdated); 
		})
	},

	restoreProfile: function (req, res){

	   User.findOne({                    
      		email: req.param('email')
    	}, function foundUser(err, user) {
		    if (err) return res.negotiate(err);       
            if (!user) return res.notFound();
 
		      passwords.checkPassword({                 
		        passwordAttempt: req.param('password'),
		        encryptedPassword: user.password
		      }).exec({
		 
		        error: function(err) {                   
		          return res.negotiate(err);
		        },
		 
		        incorrect: function() {                  
		          return res.notFound();
		        },
		 
		        success: function() {
		          User.update({                          
		            id: user.id
		          }, {
		            deleted: false
		          },function(err, updatedUser) {
		            req.session.userId = null; 
		            return res.json(updatedUser);        
		          });
		        }
		      });
    	});
	}, 

	adminUser: function (req, res){
		User.find()
			.populate('products')
			.populate('devis')
			.populate('orders')
			.exec(function (err, users){
			if (err) return res.negotiate(err); 

			if(!users) return res.notFound(); 

			return res.json(users); 
		})
	}, 

	updateDeleted: function (req, res){
		User.update(req.param('id'), {deleted: req.param('deleted')})
			.exec(function (err, userDeleted){
				if(err){
					return res.negotiate(err);
				}
				return res.ok(); 
			})
	}, 

	updateBanned: function (req, res){
		User.update(req.param('id'), {banned: req.param('banned')})
			.exec(function (err, userBanned){
				if(err){
					return res.negotiate(err);
				}
				return res.ok(); 
			})
	},

	updateProfilePicture: function (req, res){
		var id = req.param('id'); 
		var criteria = { 
			profilePicture: req.param('profilePicture')
		}; 
		User.update(id, criteria, function (err, userUpdated){
				if(err){ 
					return res.negotiate(err); 
				}

				if(!userUpdated){
					return res.badRequest("User doesn't exist"); 
				}
				
				return res.json(userUpdated); 
			});
 	}, 

	generateRecoveryEmail: function (req, res){
		if(_.isUndefined(req.param('email'))){
			return res.badRequest('An email is required'); 
		}

		var criteria = {email: req.param('email')}; 
		User.findOne(criteria)
			.exec(function (err, user){
				if (err) return res.negotiate(err);

				if(!user) return res.notFound(); 

				try {
					var randomString = Strings.random({}).execSync(); 
				} catch (err){
					return res.serverError(err);
				}

				var id = user.id; 
				var criteria = {passwordRecoveryToken: randomString}; 
				User.update(id, criteria, function (err, userUpdated){
					if (err) return res.negotiate(err); 
					console.log(userUpdated[0]); 
				var recoveryUrl = sails.config.mailgun.baseUrl+'/app/password-reset-form/'+userUpdated[0].passwordRecoveryToken;
				
				var messageTemplate = 'Il semble que vous avez perdu votre mot de passe!! \n'+
										'\n'+
				'Aucune crainte à vous faire, vous pouvez utiliser ce lien pour réinitialiser votre mot de passe\n'+
				recoveryUrl + '\n' + '\n'+ 'Merci et à nous revoir bientôt :)'; 

				Mailgun.sendPlaintextEmail({
					apiKey: sails.config.mailgun.apiKey, 
					domain: sails.config.mailgun.domain, 
					toEmail: userUpdated[0].email, 
					subject: '[E-Market] Réinitialiser votre mot de passe', 
					message: messageTemplate, 
					fromEmail: 'postmaster@sandbox78b5d122c9724868bb9e40c5eade6f50.mailgun.org', 
					fromName: 'Joel Alexandre C.O'
				}).exec({
					error: function (err){
						return res.negotiate(err); 
					}, 
					success: function (){
						return res.ok(); 
					}
				})

				})
			})
	}, 

	changePassword: function (req, res){
		if(_.isUndefined(req.param('newPassword'))){
			return res.badRequest('A password is required'); 
		}

		if(req.param('newPassword').length < 6){
			return res.badRequest('A password must have a least 6 characters'); 
		}

		passwords.encryptPassword({
			password: req.param('newPassword')
		}).exec({
			error: function (err){
				return res.negotiate(err)
			}, 

			success: function (result){
				var id = req.param('id'); 
				var criteria = {password: result}; 
				User.update(id, criteria, function (err, userUpdated){
					if(err){
						return res.negotiate(err);
					}
					if (!userUpdated){
						return res.json("User is not found");
					}

					return res.json(userUpdated); 
				})
			}
		})


	}, 

	resetPassword: function (req, res){
		if(!_.isString(req.param('passwordRecoveryToken'))){
			return res.badRequest("A Password recovery token is required"); 
		}

		 // secondary check for password parameter
	    if (!_.isString(req.param('password'))) {
	      return res.badRequest('A password is required!');
	    }

	    // Fallback to client-side length check validation
	    if (req.param('password').length < 6) {
	      return res.badRequest('Password must be at least 6 characters!');
	    }

		var token = {passwordRecoveryToken: req.param('passwordRecoveryToken')};
		User.findOne(token)
			.exec( function (err, user){
				if(err){
					return res.negotiate(err);
				}
				if (!user){
					return res.notFound(); 
				}

				passwords.encryptPassword({
					password: req.param('password')
				}).exec({
					error: function (err){
						return res.negotiate(err);
					}, 

					success: function (password){
						var criteria = {
							password: password, 
							passwordRecoveryToken : null
						};
						User.update(user.id, criteria, function (err, userUpdated){
							if(err){
								return res.negotiate(err);
							}
							req.session.userId = userUpdated[0].id; 

							return res.json(userUpdated[0]); 
						})
					}
				})
			})
	}, 

	getAllSuppliers : function (req, res){
		User.find({role: 'supplier'})
			.populate('products')
			.exec( function (err, suppliers){
				if (err){
					return res.negotiate(err);
				}

				if(!suppliers){
					return res.notFound();
				}

				return res.json(suppliers);
			})	

	}

};

