const jwt = require('jsonwebtoken');

require('dotenv').config();

// export de la fonction qui décode le token
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, process.env.Random_token);
       const userId = decodedToken.userId;
       //création objet auth qui contient la valeur du token décodé
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};