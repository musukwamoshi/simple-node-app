//import express
var express = require('express');

//validation module

var expressValidator = require('express-validator');

//import cluster module for parallel processing(number of cpus times cores)
//var cluster =require('cluster');

//import os module
//var os = require('os');

/*
const CPUS = os.cpus(); 

if (cluster.isMaster)
{  
    CPUS.forEach(function() {
        cluster.fork()
    });
    cluster.on("listening", function(worker) {
        console.log("Cluster %d connected", worker.process.pid);
    });
    cluster.on("disconnect", function(worker) {
        console.log("Cluster %d disconnected", worker.process.pid);
    });
    cluster.on("exit", function(worker) {
        console.log("Cluster %d is dead", worker.process.pid);
        // Ensuring a new cluster will start if an old one dies
        cluster.fork();
    });
} else {
    require("./app.js");
}

*/

//import mongojs orm
var mongojs= require('mongojs');

//get db cursor
var db = mongojs('simplenodeapp', [clients]);

//include session module
var session = require('express-session');

//include flash messages module
var flash = require('req-flash');

//import body-parser
var bodyParser= require('body-parser');

//import cors module
var cors= require('cors');

//add log module
var morgan= require('morgan');

//import path module
var path = require('path');

//import compression module
var compression = require('compression');

//initialize express cursor
var app = express()


//use cors middleware
app.use(cors({

    origin: ["http://localhost:3001"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]

}));

app.use(session({
secret: 'djhxcvxfgshajfgjhgsjhfgsakjeauytsdfy',
resave: false,
saveUninitialized: true
}));


app.use(flash());

//use compression middleware
app.use(compression());

////helmet middleware
app.use(helmet());

//add view engine middleware.alternative is pug and jade
app.set('view engine','ejs');

//specify path for views
app.set('views',path.join(__dirname,'views'));

//bodyparser middlware 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//loggin middleware with morgan

app.use(morgan('common'));

//static path middleware
app.use(express.static(path.join(__dirname,'public')));

//erros global varible

app.use(function(req,res,next{

    res.locals.errors=nulls;
    next();

}));

//express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

      while(namespace.length) {
         formParam += '[' + namespace.shift() + ']';
      }
      return {
         param : formParam,
         msg   : msg,
         value : value
      };
  }
}));


//can be replace with a database call
var clientss = [

        {
            id:1,
            name:'Paul Morphy',
            email:'artsychess@gmail.com'
        },

        {
            id:1,
            name:'Magnus Carlsen',
            email:'grindchess@gmail.com'
        },

        {
            id:1,
            name:'Garry Kasparov',
            email:'technicalchess@gmail.com'
        },

        {
            id:1,
            name:'Bobby Fischer',
            email:'swashbucklingchess@gmail.com'
        }

];


app.get('/client/show/:id',function(req,res){

    //res.send("Hello World.");

    //pull data from database

    db.clients.findOne({'_id': new ObjectID(req.params.id)}, function(err, doc) {
    //add to a variable and pass it view
        if(err){

            req.flash('clientShowErrorMsg', 'Sorry there was an error pulling client details!');
            res.redirect('/');

        }else{

            res.render('show',{

                'title':"Add Client",
                'clients':doc
            });
        }


    }

});


app.get('/',function(req,res){

    //res.send("Hello World.");

    //pull all clients from database and pass to index view for display
        db.clients.find(function (err, docs){
             // docs is an array of all the documents in mycollection
                res.render('index',{

                    'title':"Clients",
                    'clients':docs,
                    'errors':errors

                });

        });

        res.render('index',{

            'title':"Clients",
            'clients':clients,
            'errors':errors
        });

});


app.get('/client/create',function(req,res){

    //res.send("Hello World.");
    
        res.render('create',{

            'title':"Add Client"
        });

});


app.get('/client/edit/:id',function(req,res){

    //pull associated data from database and pass it to create form
        db.clients.findOne({'_id': new ObjectID(req.params.id)}, function(err, doc) {

               if(err){

                    req.flash('clientShowErrorMsg', 'Sorry there was an error pulling client details!');
                    res.redirect('/');

                }else{

                   //console.log(doc);
                    res.render('create',{

                      'title':"Edit Client",
                      'client':doc

                    }

                 
                }
        });


});


app.post('/client/store',function(req,res){

    //insert validation here
        req.checkBody('fullname','Name is required!').notEmpty();
        req.checkBody('email','Email is required!').notEmpty();
        req.checkBody('phonenumber','Phone Number is required!').notEmpty();

        var errors=req.validationErrors();
      
        if(errors){
            //if errors are present redisplay form with errors
                    res.render('create',{
                       'title':"Add Clients",
                       'errors':errors
                    });

        }else{

            //if there are no errors ssave submitted data
                    var newClient = {

                         fullname : req.body.fullname,
                         email : req.body.email,
                         phonenumber: req.body.phonenumber
                    }

            //insert code to add new client to database

                    db.clients.save(newClient,function (err, doc){
             // docs is an array of all the documents in mycollection
                            if(err){

                                 console.log(err);
                                //redirect to home page
                                 req.flash('storeClientSuccessMsg','Sorry there was an error accessing the database !');
                                 res.redirect('/client/create');

                     
                            }else{

                                //redirect to home page
                                 req.flash('createClientSuccessMsg','The Client was successfully added!');
                                 res.redirect('/');

                            }


                    });

        }

});


app.put('/client/update/:id',function(req,res){

 //insert validation here
        req.checkBody('fullname','Name is required!').notEmpty();
        req.checkBody('email','Email is required!').notEmpty();
        req.checkBody('phonenumber','Phone Number is required!').notEmpty();


        var errors=req.validationErrors();
      
        if(errors){
            //if errors are present redisplay form with errors

                res.render('create',{

                   'title':"Update Clients",
                   'errors':errors
                });


        }else{

            //if there are no errors save submitted data
                db.clients.update({query: {_id: mongojs.ObjectId(req.param.id)},update: {$set: {name: req.body.fullname, email: req.body.email, phonenumber: req.body.phonenumber}}},function (err, doc){
             // docs is an array of all the documents in mycollection
                    if(err){

                            db.clients.findOne({'_id': new ObjectID(req.params.id)}, function(err, doc){

                                if(err){

                                      req.flash('clientShowErrorMsg', 'Sorry there was an error pulling client details!');
                                      res.redirect('/');

                                }else{

                                      req.flash('clientUpdateErrorMsg', 'Sorry there was an error updating client details!Please try again');
                                      res.render('create',{

                                         'title':"Edit Client",
                                         'client':doc

                                      }

                                }
                            });

                     
                    }else{

                    //redirect to home page
                            req.flash('updateClientSuccessMsg', 'The client details were succesfully updated!');
                            res.redirect('/');

                    }


                });

        }

});


app.delete('/client/delete/:id',function(req,res){

    //insert database delete query here
        db.clients.removeById(req.params.id, function(err, docs) {
             //res.send("Hello World.");
                if(err){

                     req.flash('deleteClientErrorMsg', 'There was an error deleting the client!');
                     res.redirect('/'); 

                }else{

                     req.flash('deleteClientSuccessMsg', 'The Client was successfully deleted!');
                     res.redirect('/');

                }

        });

});



//start the server
app.listen(3000,function(){

        console.log('server started on 3000.')

});