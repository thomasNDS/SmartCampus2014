/*
 * SmartCampus
 */

var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
var mqtt = require('mqtt')
var Schema = mongoose.Schema;
var restify = require('express-restify-mongoose')


// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

//////////////////////////////////
/////// MONGODB  /////////////////
//////////////////////////////////
//Connection to the a mongodb database path localhost:port/nameOfCollection
mongoose.connect("mongodb://localhost:27017/Client", function(err) {
    if (err) {
        throw err;
    }
});

//////////////////////////////////
//Definition of a schema /////////
//////////////////////////////////
var Building = new Schema({
	name: { type: String, required: true },
	comment: { type: String }
});
var BuildingModel = mongoose.model('Building', Building);

var Item = new Schema({
    name: { type: String, required: true },
    position: { type: String },
    room_number: { type: Number }
});
var ItemModel = mongoose.model('Item', Item);

var Sensors_data = new Schema({
    type: { type: String},
    position: { type: String }
});
var Sensors_dataModel = mongoose.model('Sensors_data', Sensors_data);

var Mesure = new Schema({
    date: { type: Date, default: Date.now },
    value: String
});
var MesureModel = mongoose.model('Mesure', Mesure);

var Comment = new Schema({
    value: String
});
var CommentModel = mongoose.model('Comment', Comment);

var Administrator = new Schema({
    room_number: Number,
    name: String,
    first_name: String
});
var AdministratorModel = mongoose.model('Administrator', Administrator);

var Entity = new Schema({
    room_number: Number,
    name: String,
    first_name: String
});
var EntityModel = mongoose.model('Entity', Entity);

var Tram = new Schema({
    value: String
});
var TramModel = mongoose.model('Tram', Tram);

var Lampadaire = new Schema({
    value: String
});
var LampadaireModel = mongoose.model('Lampadaire', Lampadaire);

var Parking = new Schema({
    total_place : Number,
    vacant_place : Number
});
var ParkingModel = mongoose.model('Parking', Parking);

var Building_parking = new Schema({
    total_place : Number,
    vacant_place : Number
});
var BuildingModel = mongoose.model('Building', Sensors_data);

var Cafeteria = new Schema({
    name : String
});
var CafeteriaModel = mongoose.model('Cafeteria', Cafeteria);

var Classroom = new Schema({
    total_place : Number
});
var ClassroomModel = mongoose.model('Classroom', Classroom);

//Creation of an object which respect the model define before
//var myBuildingModel = new BuildingModel({_id: 1473, temp: 16});

//saved the Building in the mongodb database
/*myBuildingModel.save(function(err){
 if (err) { throw err; }
 console.log('Commentaire ajouté avec succès !');
 // On se déconnecte de MongoDB maintenant
 mongoose.connection.close();
 });*/

/*var query = BuildingModel.findOne({_id: 123}, function(err, tempFind) {
    if (err)
        return handleError(err);
    console.log('Temp find : %d', tempFind.temp)
})*/

////////////////////////////////
/////// MQTT  //////////////////
////////////////////////////////

client = mqtt.createClient(1883, 'localhost');

client.subscribe('Building');
var i = 12;
client.on('message', function(topic, message) {
    console.log(message);
    var myBuildingModel = new BuildingModel({_id: i++, temp: message});
    myBuildingModel.save(function(err) {
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
    restify.serve(app, BuildingModel);
});


//Run the server
http.createServer(app).listen(4242, function() {
    console.log("http://localhost:4242");
});
