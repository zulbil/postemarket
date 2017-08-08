/**
 * Category.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'MongoDbServer', 
  
  attributes: {
  	name: {type: 'string', required: true},
  	parent: {
  		type: 'string', 
  		model: 'category'
  	},
  	ancestors: [{
  		type: 'string', 
  		model: 'category'
  	}]
  }
};

