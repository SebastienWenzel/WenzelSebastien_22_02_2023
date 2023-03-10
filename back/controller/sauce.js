const modelSauce = require('../database/models/sauce');

const fs = require('fs');

//export de la fonction de création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
    //on parse l'objet pour pouvoir exploiter les données
    const sauceObjet = JSON.parse(req.body.sauce);
    //suppression deux champ _id géner auto par la DB et userID (pas confiance au client)
    // delete sauceObjet._id;
    // delete sauceObjet.userId;

    const sauce = new modelSauce({
        ...sauceObjet,
        //userId: req.auth.userId,
        likes:0,
        dislikes: 0,
        usersLiked:[],
        usersDisliked: [],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

    });
    sauce.save()
    .then(() => res.status(201).json({message : 'Sauce ajoutée'}))
    .catch(error => res.status(400).json({error}));

};
//export de la fonction de modification d'une sauce
exports.modifySauce = (req,res,next) => {
    //on vérifie si un fichier image est joint
    const sauceObject = req.filename?{
        //si c'est le cas
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body}; // sinon, on récupère le corps de la requête

    //on supprime le userId venant de la requête
    delete sauceObject._userId;
    //on cherche la sauce dans la base de données
    modelSauce.findOne({_id:req.params.id})
    .then((sauce) => {
        //on vérifie que ce soit l'utilisateur qui a créé la sauce qui cherche à la modifier
        if(sauce.userId != req.auth.userId) { // si le userId est différent
            res.status(400).json({message: 'Non-autorisé'});
        } else { //si l'utilisateur est le bon
            //on met la sauce à jour
            modelSauce.updateOne({_id: req.params.id},{...sauceObject,_id:req.params.id})
            .then(() => res.status(200).json({message: 'La sauce a été mise à jour'}))
            .catch(error => res.status(401).json({error}));
        }
    })
    .catch((error) => {res.status(400).json({error})});
};

//export de la fonction de suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    modelSauce.findOne({_id: req.params.id})
        .then(sauce => {// on vérifie les droits d'accès
            if(sauce.userId != req.auth.userId){// si celui qui veut supprimer la sauce n'en est pas le créateur
                res.stauts(401).json({message: 'Non-autorisé'})
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];// on récupère le nom de fichier
                fs.unlink(`images/${filename}`, () => {
                    modelSauce.deleteOne({_id: req.params.id})
                        .then(() => res.status(200).json({message: 'Objet supprimé !'}))
                        .catch(error => res.status(401).jso({error}));
                });
            }
        })
        .catch(error => res.status(500).json({error}));
};
//export de la fonction de récupération d'une sauce spécifique
exports.getOneSauce = (req, res, next) => {
    modelSauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};
//export de la fonction de récupération du tableau de toutes les sauces
exports.getSauces = async (req, res) => {
    try {
      const sauces = await modelSauce.find() 
      res.json(sauces);
    } catch (error) {
      res.status(500).json();
    }
  };