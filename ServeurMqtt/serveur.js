/*
 * SmartCampus
 */

var http = require('http'),
        express = require('express'),
        mongoose = require('mongoose'),
        extend = require('mongoose-schema-extend'),
        path = require("path"),
        mqtt = require('mqtt'),
        Schema = mongoose.Schema,
        restify = require('express-restify-mongoose'),
        routes = require('./routes');

var app = express();

// Config
app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, "/views")));
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
//// Makes connection asynchronously.  Mongoose will queue up database
//// operations and release them when the connection is complete.
//mongoose.connect(uristring, function (err, res) {
//  if (err) {
//  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
//  } else {
//  console.log ('Succeeded connected to: ' + uristring);
//  }
//});

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
    name: {type: String, required: true},
    comment: {type: String}
});

var Item = new Schema({
    name: {type: String, required: true},
    position: {type: String},
    room_number: {type: Number}
});

var Sensors_data = new Schema({
    type: {type: String},
    position: {type: String}
});

var Mesure = new Schema({
    date: {type: Date, default: Date.now},
    value: String
});

var Comment = new Schema({
    value: String
});

var Administrator = new Schema({
    name: String,
    first_name: String
});

var Entity = new Schema({
    room_number: Number,
    name: String,
    first_name: String
});

var Tram = Entity.extend({
    value: String
});

var Lampadaire = Entity.extend({
    value: String
});

var Parking = Entity.extend({
    total_place: Number,
    vacant_place: Number
});

var Building_parking = Item.extend({
    total_place: Number,
    vacant_place: Number
});

var Cafeteria = Item.extend({
    name: String
});

var Classroom = Item.extend({
    total_place: Number
});
// models
var ClassroomModel = mongoose.model('Classroom', Classroom);
var CafeteriaModel = mongoose.model('Cafeteria', Cafeteria);
var BuildingModel = mongoose.model('Building', Sensors_data);
var ParkingModel = mongoose.model('Parking', Parking);
var LampadaireModel = mongoose.model('Lampadaire', Lampadaire);
var ItemModel = mongoose.model('Item', Item);
var TramModel = mongoose.model('Tram', Tram);
var EntityModel = mongoose.model('Entity', Entity);
var AdministratorModel = mongoose.model('Administrator', Administrator);
var CommentModel = mongoose.model('Comment', Comment);
var MesureModel = mongoose.model('Mesure', Mesure);
var Sensors_dataModel = mongoose.model('Sensors_data', Sensors_data);


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

app.get('/api', function(req, res) {
    res.send('API is running');
});

app.get('/api/administrator', function(req, res) {
    return AdministratorModel.find(function(err, Administrator) {
        if (!err) {
            return res.send(Administrator);
        } else {
            return console.log(err);
        }
    });
});

app.post('/api/administrator', function(req, res) {
    var admin;
    console.log("POST: ");
    console.log(req.body);
    admin = new AdministratorModel({
        first_name: req.body.first_name,
        name: req.body.name
    });
    admin.save(function(err) {
        if (!err) {
            return console.log("created");
        } else {
            return console.log(err);
        }
    });
    return res.send(admin);
});

app.get('/api/administrator/:id', function(req, res) {
    return AdministratorModel.findById(req.params.id, function(err, Administrator) {
        if (!err) {
            return res.send(Administrator);
        } else {
            return console.log(err);
        }
    });
});

app.put('/api/administrator/:id', function(req, res) {
    return AdministratorModel.findById(req.params.id, function(err, administrator) {
        administrator.first_name = req.body.first_name;
        administrator.name = req.body.name;
        return administrator.save(function(err) {
            if (!err) {
                console.log("updated");
            } else {
                console.log(err);
            }
            return res.send(administrator);
        });
    });
});

app.delete('/api/administrator/:id', function(req, res) {
    return AdministratorModel.findById(req.params.id, function(err, administrator) {
        return administrator.remove(function(err) {
            if (!err) {
                console.log("removed");
                return res.send('');
            } else {
                console.log(err);
            }
        });
    });
});

app.get('/', routes.index);
//app.get('/add', routes.add);
//app.get('/get', routes.get);
//app.get('/delete', routes.delete);
//app.get('/update', routes.update);

//app.get(':name?', function hello(req, res, next) {
//    res.render(req.params.name + 'html');
//});

//Run the server
http.createServer(app).listen(4242, function() {
    console.log("http://localhost:4242");
});
