//import express
var express = require('express');

//import cluster module for parallel processing(number of cpus times cores)
var cluster =require('cluster');

//import os module
var os= require('os');

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


//import body-parser
var bodyParser= require('body-parser');

//import cors module
var cors= require('cors');

//add log module
var morgan= require('morgan');

//import path
var path = require('path');

//import compression module

var compression = require('compression');

//initialize express cursor
var app=express()


//use cors middleware
app.use(cors({

    origin: ["http://localhost:3001"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]

}));

//use compression middleware
app.use(compression());

////helmet middleware

app.use(helmet());


//add view engine middleware
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





app.get('/',function(req,res){

    //res.send("Atishani apo.");
    res.render('index');

});



//start the server
app.listen(3000,function(){

        console.log('server started on 3000.')

});