module.exports = function (err){

	var res = this.res; 

	if (err.invalidAttributes.email) {
       return res.send(409, 'Usrname or password are incorrect');
  }
 
  if (err.invalidAttributes.username) {
	return res.send(409, 'Usrname or password are incorrect');
  }   

	return res.send(500);                 
}