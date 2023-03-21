//Connection à la base de données
const mongoose = require('mongoose');
//Permet de cacher les données sensibles
require('dotenv').config();

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
        .then(() => {console.log('connexion db ok !')})
        .catch(err => console.log(err));     