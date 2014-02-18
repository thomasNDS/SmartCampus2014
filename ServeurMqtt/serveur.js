/*
 * SmartCampus
 */

var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
var mqtt = require('mqtt')
var Schema = mongoose.Schema;
var restify = require('express-restify-mongoose')

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/smart';

// The http server will listen to an appropriate port, or default to
// port 5000.
var theport = process.env.PORT || 5000;

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

var Customer = new Schema({
    name: { type: String, required: true },
    comment: { type: String }
});
var CustomerModel = mongoose.model('Customer', Customer);

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
    console.log("http://localhost:4242");
});
