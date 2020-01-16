// any routes that have to do with customer arre here
const errors = require('restify-errors')
const Customer= require('../models/Customers')

module.exports = (app) => {
    
    //the call back fuction takes in three things : request, response and next
    // app.get('/customers', (req, resp, next) => {
    //     resp.send({msg: 'test'})
    //     next();
    // })

// get Customer

    app.get('/customers', async (req, res, next) => {
         
        // we have use the try , catch block
        // we could also have used the then / catch duo, see below
        
        try {
        //in order to use await we have to put an async function
        
        const Customers = await Customer.find({})
        res.send(Customers)
        } catch(err) {
            // here we use the mongoose-errors plugin
            return next(new errors.InvalidContentError(err))
        }

        })

        // app.get('/customers',  (req, res, next) => {
         
        
            
            
        //     // alternative way of writting with then and catch method
        //     return Customer.find({})
        //     .then((Customers) => res.send(Customers))
            
        //     .catch(err => new errors.InvalidContentError(err)) 
    
        //     }) 



  
 // get single customer       

        
    app.get('/customers/:id', async (req, res, next) => {
         
        try {
       
        const customer = await Customer.findById(req.params.id)
        res.send(customer)
        } catch(err) {
            // here we use the mongoose-errors plugin
            return next(new errors.ResourceNotFoundError(`There is no customer with the id of ${req.params.id}`))
        }

        })

// Add Customer
        app.post('/customers', async(req, res, next) => {
            // check for Json
            // if req is not application json
            if(! req.is('application/json')) {
                return next(new errors.InvalidContentError("Expect 'Application/json'"))
            }
            
            //destructuruation of req.body
            const {name, email, balance}= req.body
            
            // create a new customer
            const customer = new Customer({
                name: name,
                email: email,
                balance: balance
            });
            // and save it

            try {
                // we used await but we could have use then or a callback function
                const newCustomer= await customer.save()
                res.send(201)
                next();
            } catch (err) {
                return next( new errors.InternalError(err.message))
            }
        });

// Update customer

      

        app.put('/customers/:id', async(req, res, next) => {
            // check for Json
            // if req is not application json
            if(! req.is('application/json')) {
                return next(new errors.InvalidContentError("Expect 'Application/json'"))
            }
            
        
            try {
                // we used await but we could have use then or a callback function
                const customer= await Customer.findOneAndUpdate({ _id: req.params.id}, req.body )
                res.send(200)
                next();
            } catch (err) {
                // here we use the mongoose-errors plugin
            return next(new errors.ResourceNotFoundError(`There is no customer with the id of ${req.params.id}`))
            }
        });

        // Delete customer

        app.del('/customers/:id', async (req, res, next) => {
            try {
                const customer= await Customer.findOneAndRemove({_id: req.params.id} )
                res.send(204);
                next();
            } catch(err) {
                // here we use the mongoose-errors plugin
            return next(new errors.ResourceNotFoundError(`There is no customer with the id of ${req.params.id}`))
            }
        })
    };