const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controller/sauce');

// on gère l'authentification avant les gestionnaires de routes

//création de nouvelle sauce
router.post('/', auth, multer, sauceCtrl.createSauce);
//Modification d'une sauce
router.put('/:id', auth, multer ,sauceCtrl.modifySauce);
//suppression d'une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);
// Récupération du tableau des sauces
router.get('/', auth, sauceCtrl.getSauces);
// Récupération d'une sauce spécifique
router.get('/:id', auth, sauceCtrl.getOneSauce);

//création de like 
router.post ('/:id/like', auth, sauceCtrl.likeSauce);


module.exports = router;