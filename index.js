const restify = require('restify')
const mongoose = require('mongoose')
const config = require('./config')

// for protected road
const rjwt= require('restify-jwt-community')

const app = restify.createServer();



const corsMiddleware = require("restify-cors-middleware")

const cors = corsMiddleware({  
    origins: ["*"],
    allowHeaders: ["Authorization"],
    exposeHeaders: ["Authorization"]
});


// Middleware

app.pre(cors.preflight)
app.use(cors.actual)

app.use(restify.plugins.bodyParser())

// protect road
// it takes an object with the secret
// unless the route is authentification
app.use(rjwt({secret: config.JWT_SECRET}).unless({path: ['/auth','/register']}));

// va chercher PORT Value in config file
app.listen(config.PORT, () => {
    //to avoid depreacation error 
    mongoose.set('useFindAndModify', false)
    
    mongoose.connect(config.MONGODB_URI, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true})
})

const db= mongoose.connection;

// handle error
db.on('error', (error) => console.log(error))

// handle opening of database

db.once('open', () => {
    // it is where we create our routes but we are not gonna list them here but one file for eache ressources
    
    // routes/customers gonna export au fucntion and we pass in the server instance (app)
    //because it is where we crezte routes app.get, app.post and so on...
    require('./routes/customers')(app)
    require('./routes/users')(app)
    console.log(`server started on port ${config.PORT}`)
} )