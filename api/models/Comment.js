/**
 * Comment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	review: {type: 'string' , required: true}, 
  	byProduct: {model: 'product'},
  	postedBy: {model: 'user'}
  }
};

