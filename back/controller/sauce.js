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
//export de la fonction des likes 
exports.likeSauce = (req, res, next) => {
	modelSauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			switch (req.body.like) {
				case 1:
                    //Si l'utilisateur n'a pas encore voté pour cette sauce et qu'il apprécie la recette
					if (!sauce.usersLiked.includes(req.body.userId)) {

						modelSauce.updateOne(
							{ _id: req.params.id }, //spécifie l'ID de la sauce à mettre à jour
							{
								$inc: { likes: 1 }, //incrémente le nombre
								$push: { usersLiked: req.body.userId }, //ajoute l'ID de l'utilisateur
							}
						)
							.then(() => {res.status(201).json({ message: 'vous aimez cette sauce' });
							})
							.catch((error) => res.status(400).json({ error }));
					}
					break;
				
				case -1:
                    //si l'utilisateur n'a pas encore voté et qu'il n'aime pas cette sauce
					if (!sauce.usersDisliked.includes(req.body.userId)) {

						modelSauce.updateOne(
							{ _id: req.params.id },
							{
								$inc: { dislikes: 1 },
								$push: { usersDisliked: req.body.userId },
							}
						)
							.then(() => {res.status(201).json({ message: 'vous n\'aimez pas cette sauce' });
							})
							.catch((error) => res.status(400).json({ error }));
					}
					break;
				
				case 0:
                    //si l'utilisateur a déjà voté pour cette sauce et enlève son like
					if (sauce.usersLiked.includes(req.body.userId)) {
						modelSauce.updateOne(
							{ _id: req.params.id },
							{
								$inc: { likes: -1 },
								$pull: { usersLiked: req.body.userId },
								
							}
						)
							.then(() => {res.status(201).json({ message: 'vous avez supprimé votre vote J\'aime' });
							})
							.catch((error) => res.status(400).json({ error }));
                    //si l'utilisateur a dit qu'il n'aimait pas et enlève son dislike        
					} else if (sauce.usersDisliked.includes(req.body.userId)) {

						modelSauce.updateOne(
							{ _id: req.params.id },
							{
								$inc: { dislikes: -1 },
								$pull: { usersDisliked: req.body.userId },
							}
						)
							.then(() => {res.status(201).json({ message: 'vous avez supprimé votre vote négatif' });
							})
							.catch((error) => res.status(400).json({ error }))
					}
					break;
				default:
					res.status(401).json({ message: 'Il s\'agit d\'un vote non autorisé' });
			}
		});
}

 