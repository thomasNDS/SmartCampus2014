/*
 * SmartCampus
 */

var addrmongo = 'mongodb://localhost:27017/Client';

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

/**
 * CORS support.
 */

app.all('*', function(req, res, next) {
    if (!req.get('Origin'))
        return next();
    // use "*" here to accept any origin
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.set('Access-Control-Allow-Max-Age', 3600);
    if ('OPTIONS' === req.method)
        return res.send(200);
    next();
});


app.get('/api', function(req, res) {
    res.send("Show all entities</br>http://localhost:4242/api/entity/ </br></br>Show an entity $id\
</br>http://localhost:4242/api/entity/$id/ </br>Show infos of entity $id\
</br>http://localhost:4242/api/entity/$id/infos </br>Show the first info of entity $id\
</br>http://localhost:4242/api/entity/$id/infos/0 </br>Show the first info of entity $id\
</br>http://localhost:4242/api/entity/$id/infos/0/uneInfo ");
});

app.get('/', routes.index);

var mers = require('mers');
app.use('/api', mers({uri: addrmongo}).rest());

//Run the server
http.createServer(app).listen(4242, function() {
    console.log("http://localhost:4242");
});
