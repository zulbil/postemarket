/**
 * CommentController
 *
 * @description :: Server-side logic for managing comments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	createComment: function (req, res) {
	
		User.findOne({ id: req.session.userId.id})
			.exec (function (err, userFound){
				if(err){
					return res.negotiate(err);
				}
				if(!userFound){
					return res.notFound(); 
				}
				Product.findOne({id: req.param('id')})
					   .populate('owner')
					   .exec(function (err, product){
					   	if (err){
					   		return res.negotiate(err);
					   	}
					   	if(!product){
					   		console.log("Product not found"); 
					   		return res.notFound();
					   	}
					   	if(userFound.id === product.owner.id){
					   		return res.forbidden();
					   	}

					   	console.log('posting comment....'); 

					   	Comment.create({
					   		review: req.param('review'), 
					   		byProduct: product.id, 
					   		postedBy: userFound.fullname
					   	}).exec( function (err, commentCreated){
					   		if (err){
					   			return res.negotiate(err); 
					   		}
					   		console.log(commentCreated);
					   		return res.ok();
					   	}); 
					   })
			})
	}, 

	allComments: function (req, res){
		User.findOne(req.session.userId)
			.populate('products')
			.populate('comments')
			.exec(function (err, userFound){
				if (err){
					return res.negotiate(err); 
				}
				Comment.find({byProduct: userFound.products})
					   .exec( function (err, comments){
					   	if(err){
					   		return res.negotiate(err); 
					   	}

					   	if(!comments){
					   		return res.notFound();
					   	}
					   	return res.json(comments); 
					   })
			})
	}
};

