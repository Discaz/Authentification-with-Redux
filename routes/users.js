const errors = require('restify-errors')
const bcrypt= require('bcryptjs')

// allow us to pass a token once the user isauthenticated with email and password
const jwt = require('jsonwebtoken')


const User = require('../models/User')

const auth = require('../auth')

// import config secret
const config = require('../config')



module.exports = app => {
    
//Register User (signup)
    
    app.post('/register', (req, res, next) => {
        const {email, password, firstname, lastname}= req.body;
        // create new user but doesn't save it yet
       
        // Simple validation
  if(!firstname || !email || !password || !lastname) {
    return res.send(400, {message : 'Please enter all fields' });
  }

       console.log(req.body)
       
        //a simple if/else to check if email already exists in db
User.findOne({ email }) 
    
    .then( user => {
    // if(err) {
    //    //handle error here
    //    console.log('there is an error')
    // }

    //if a user was found, that means the user's email matches the entered email
    if (user) {
        res.send(400,{message : 'User already exists'});
        //   var err = new Error('A user with that email has already registered. Please use a different email..')
        //  err.status = 400;
        //  return next(err);
    } else {
        //code if no user with entered email was found
        const Newuser = new User( {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password
        })
    
        // hash the password
    bcrypt.genSalt(10, (err, salt) => {
        // here we pass the plain text password to the hash method 
        // and we pass in the salt that was given by the genSalt method
        // and a call back async function, because we use wait then
        bcrypt.hash(Newuser.password, salt, async (err, hash) => {
                // hash password is pass in to user.password
                Newuser.password = hash;
        // Save User
        try {
            // here we use the monggose method save for the user we created above
            const user = await Newuser.save();
            
            const token = jwt.sign(user.toJSON(), config.JWT_SECRET, { expiresIn: "50m"} )

            // issued at and expired
            const {iat, exp} = jwt.decode(token);
            //Respond with token
            res.send({iat, exp, token})

            // rem : we display our token but right now the token is useless unless we have a protected road
            next();
            
            
            // res.send(201);
            // next();
        } catch(err) {
            return next(new errors.InternalError(err.message))
        }
        
        }) 
        
    })
    }
})
    }
 ); 





// Auth User (login)
    
    app.post('/auth', async (req, res, next) => {
        const { email, password} = req.body
            // in this try we use the method we create to authenticate 
        try {
            // Authenticate User (auth.authenticate is our function we have imported)
            const user = await auth.authenticate(email, password);
            console.log(user)
            
            // once the user is authenticated with email, password we create a token
            // Create JWT

            // we need to sign the token using jsonwebtoken ; we use sign() method for that
            // the we pass the user , but we can pass anythng we want, and we need the toJSON() method
            // then we need the secret : JWT.secret thant is in our config file
            // and the expire option is the third paramater
            const token = jwt.sign(user.toJSON(), config.JWT_SECRET, { expiresIn: "50m"} )

            // issued at and expired
            const {iat, exp} = jwt.decode(token);
            //Respond with token
            res.send({iat, exp, token})

            // rem : right now the token is useless unless we  have a protected road
            next();
        } catch(err) {
            // if auth.authneticate : User unauthorized
            return next(new errors.UnauthorizedError(err));

        }

    })


// Get all registered users

app.get('/register', async (req, res, next) => {
         
    // we have use the try , catch block
    // we could also have used the then / catch duo, see below
    
    try {
    //in order to use await we have to put an async function
    
    const users = await User.find({})
    res.send(users)
    } catch(err) {
        // here we use the mongoose-errors plugin
        return next(new errors.InvalidContentError(err))
    }

    })


}