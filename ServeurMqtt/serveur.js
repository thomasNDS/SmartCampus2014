/*
 * SmartCampus
 */

var addrmongo ='mongodb://localhost:27017/Client';

var fs = require("fs");
http = require('http'),
        express = require('express'),
        mongoose = require('mongoose'),
        extend = require('mongoose-schema-extend'),
        path = require("path"),
        mqtt = require('mqtt'),
        Schema = mongoose.Schema,
        restify = require('express-restify-mongoose');

var app = express();
var vm = require('vm');

var includeInThisContext = function(path) {
    var code = fs.readFileSync(path);
    vm.runInThisContext(code, path);
}.bind(this);
var routes = require('./routes');

includeInThisContext(__dirname + "/model.js");

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

//////////////////////////////////
/////// MONGODB  /////////////////
//////////////////////////////////
//Connection to the a mongodb database path localhost:port/nameOfCollection
mongoose.connect(addrmongo, function(err) {
    if (err) {
        throw err;
    }
});

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

app.get('/', routes.index);

var mers = require('mers');
app.use('/api', mers({uri: addrmongo}).rest());

//Run the server
http.createServer(app).listen(4242, function() {
    console.log("http://localhost:4242");
});
