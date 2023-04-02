// on importe le model user
const User = require('../database/models/user');
//on importe le module de cryptage
const bcrypt = require('bcrypt');

//on importe d'identification de token
const jwt = require('jsonwebtoken');
require('dotenv').config();


//on exporte la fonction de création d'utilisateur

exports.signup = async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, parseInt(process.env.SALT_ROUNDS));
        const user = new User({
            email: req.body.email,
            password: hash
        });
        await user.save();
        res.status(201).json({message: 'Utilisateur créé !'});
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({error, message: 'Email déja utilisé'});
        } else {
            res.status(500).json ({ error });
        }
    }
};


exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: 'Paire identifiant/mote de passe incorrect' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Paire identifiant/mote de passe incorrect' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.RANDOM_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      userId: user._id,
      token: token
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};