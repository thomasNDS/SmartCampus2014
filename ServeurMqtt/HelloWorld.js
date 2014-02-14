/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
var mqtt = require('mqtt')
var Schema = mongoose.Schema;
var restify = require('express-restify-mongoose')

///////////////////////////////////
/////// MONGODB  //////////////////
//////////////////////////////////
//Connection to the a mongodb database path localhost:port/nameOfCollection
mongoose.connect("mongodb://localhost:27017/Client", function(err) {
    if (err) {
        throw err;
    }
});

//Definition of a schema
var Temperature = new Schema({
    _id: Number,
    temp: Number
});
//Creation of the model
var TemperatureModel = mongoose.model('tables', Temperature);

//Creation of an object which respect the model define before
var myTemperatureModel = new TemperatureModel({_id: 1473, temp: 16});


//saved the temperature in the mongodb database
/*myTemperatureModel.save(function(err){
 if (err) { throw err; }
 console.log('Commentaire ajouté avec succès !');
 // On se déconnecte de MongoDB maintenant
 mongoose.connection.close();
 });*/

/*var query = TemperatureModel.findOne({_id: 123}, function(err, tempFind) {
    if (err)
        return handleError(err);
    console.log('Temp find : %d', tempFind.temp)
})*/

///////////////////////////////////
/////// MQTT  //////////////////
//////////////////////////////////

client = mqtt.createClient(1883, 'localhost');

client.subscribe('temperature');
var i = 12;
client.on('message', function(topic, message) {
    console.log(message);
    var myTemperatureModel = new TemperatureModel({_id: i++, temp: message});
    myTemperatureModel.save(function(err) {
        if (err) {
            throw err;
        }
        console.log('Température ajouté à la BD avec succès !');
    });
});


var app = express();
app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    restify.serve(app, TemperatureModel);
});


//Run the server
http.createServer(app).listen(4242, function() {
    console.log("Express server listening on port 4242");
});
