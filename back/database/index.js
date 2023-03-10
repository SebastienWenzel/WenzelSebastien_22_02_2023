//Connection à la base de données
const mongoose = require('mongoose');
//Permet de cacher les données sensibles
require('dotenv').config();

mongoose.set('strictQuery', false);

mongoose.connect(`mongodb+srv://fisher:0CqLtUt6MYU8uOJl@clusteroc.nhb2j9t.mongodb.net/Piiquante?retryWrites=true&w=majority`)
        .then(() => {console.log('connexion db ok !')})
        .catch(err => console.log(err));