module.exports = {

	createAverage: function (argument) {
		var sumProductRating = 0; 

		_.each(argument.comments, function (comment){
			sumProductRating =sumProductRating + comment.stars;
		}); 

		var averageRating = sumProductRating / argument.comments.length; 

		return averageRating; 
	}
}