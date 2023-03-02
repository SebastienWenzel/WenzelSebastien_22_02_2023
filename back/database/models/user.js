const mongoose = require('mongoose');
const schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = schema({

    email: {type: String ,required: true ,unique: true },
    password: {type: String ,required: true, minlength: [3, 'Password trop court']}

}); 

// plugin ajoute une validation avant enregistrement pour les champs uniques
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);
