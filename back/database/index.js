//Connection à la base de données
const mongoose = require('mongoose');
//Permet de cacher les données sensibles
require('dotenv').config();

mongoose.set('strictQuery', false);

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@clusteroc.nhb2j9t.mongodb.net/${process.env.DB_CLUSTER_NAME}?retryWrites=true&w=majority`)
        .then(() => {console.log('connexion db ok !')})
        .catch(err => console.log(err));