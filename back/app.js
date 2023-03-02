const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
require('./database/index');
const userRoutes = require('./route/user');
const app = express();
require('dotenv').config();


app.use(helmet());

//Gestion des erreurs CORS
//app.use(cors());
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


app.use((req, res) => {
   res.json({ message: 'Votre requête a bien été reçue !' }); 
});


//on exporte l'application
module.exports = app;