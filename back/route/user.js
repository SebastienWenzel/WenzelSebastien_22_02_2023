//gestionnaires de route modulaires
const express = require('express');

const router = express.Router();

const userCtrl = require('../controller/user');

//on créée la route pour l'inscription
router.post('/signup', userCtrl.signup);

//on créée la route pour l'inscription
router.post('/login', userCtrl.login );

module.exports = router; 