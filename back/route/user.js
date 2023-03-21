//gestionnaires de route modulaires
const express = require('express');

const router = express.Router();

const password = require('../middleware/password');
const userCtrl = require('../controller/user');

//on créée la route pour l'inscription
router.post('/signup', password, userCtrl.signup);

//on créée la route pour la conexion
router.post('/login', userCtrl.login );

module.exports = router; 