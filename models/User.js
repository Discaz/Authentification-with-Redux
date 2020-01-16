// this our file that deal with user authnetification
// our user model have only an email and password

const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
   
        firstname: {
          type: String,
          
          required: true
        },
        
        lastname: {
          type: String,
          
          required: true
        },
        
        email: {
          type: String,
          lowercase: true,
          trim: true,
          unique: true,
          required: true
        },
        
        password: {
          type: String,
          required: true
        }



})

const User= mongoose.model('User', UserSchema)
module.exports = User;