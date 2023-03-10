const express = require('express');
const path = require('path');
require('./database/index');
require('dotenv').config();
const userRoutes = require('./route/user');
const sauceRoutes = require('./route/sauce');
const app = express();



//Gestion des erreurs CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//Body-parser présent dans express. Permet de lire le contenu JSON renvoyé par les requêtes POST
app.use(express.json());


//route sur authentification
app.use('/api/auth', userRoutes);
// route sur les sauces
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
//on exporte l'application
module.exports = app;