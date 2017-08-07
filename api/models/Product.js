/**
 * Product.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	name: {type: 'string', required: true}, 
	category: {type: 'string', required: true}, 
	price: { type: 'float', required: true}, 
	picture: { type: 'string' , required: true},
	quantity: {type: 'float', required: true}, 
	status: { 
		type: 'string', 
		enum: ['Pending', 'In Progress', 'Cancelled', 'Done'], 
		defaultsTo: 'Pending' 
	},  
	description: { type: 'string', required: true}, 
	comments: {
		collection: 'comment', 
		via: 'byProduct'
	},
	owner: {model: 'user'}
  }
};

