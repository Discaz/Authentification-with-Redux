const bcrypt = require('bcryptjs')

const mongoose = require('mongoose')



// other way to import model / Schema with mongoose
const User = mongoose.model('User')

// authentification function that see if email and password matches

exports.authenticate = (email, password) => {
    return new Promise (async (resolve, reject) => {
        try {
            //Get user by email

            const user = await User.findOne({email : email})
            // Match password
            // takes in the password we try and the password in database : user.password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if(isMatch) {
                        resolve(user)
                    } else {
                    // Pass didn't match
                    reject('Authentification failed');
                    }
            }
            
            );
        // if email not found : 
        } catch(err) {
            //Email not found
            reject('Authentification failed')
        }

    }


    )
}