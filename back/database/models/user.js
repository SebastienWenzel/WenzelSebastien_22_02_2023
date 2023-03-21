const mongoose = require('mongoose');
const schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = schema({

    email: {type: String ,required: true ,unique: true },
    password: {type: String ,required: true}

}); 

//plugin ajoute une validation avant enregistrement pour les champs uniques
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);
