/*
 * SmartCampus
 *  ©SmartCampus 2014 https://github.com/thomasNDS/SmartCampus2014
 *  License MIT
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
//EntityModel.findOne({name: "UPMF"}, function(err, doc) {
//    console.log("==START MQTT==");
//    if (!doc) {
//        console.log("\n\nMQTT fail => init DB !\n\n");
//    }
//    else {
var crousClient = mqtt.createClient(1883, 'localhost');
//17,3,4,24,46,18,19
crousClient.subscribe('menu_crous_3');
crousClient.subscribe('menu_crous_4');
crousClient.subscribe('menu_crous_17');
crousClient.subscribe('menu_crous_18');
crousClient.subscribe('menu_crous_19');
crousClient.subscribe('menu_crous_24');
crousClient.subscribe('menu_crous_46');

crousClient.on('message', function(topic, message) {
    console.log("-----------------\n message= " + message);
    //verify it's a crous topic
    if (/menu_crous/.test(topic)) {
//        Extract from the topic name the ID
        var id2search = parseInt((topic.match(/[0-9]+/))[0]);

//      Search in DB the item coresponding
        ItemModel.findOne({identifiant: id2search}, function(err, doc) {
            console.log(doc);
            if (!doc) {
                console.log("Could not load Document");
                return (new Error('Could not load Document'));
            }
            else {
//              We find the document and we update it's infos
//              infos coresponding to menus of the week
                console.log(message.split(/@/));
                doc.infos = message.split(/@/);
                console.log("update");
                doc.save(function(err) {
                    if (err)
                        console.log('\n\n !!! ERROR with ' + topic);
                    else
                        console.log('\n update success for ' + topic);
                });
            }
        });
        console.log("--------------");
    } else {
        console.log("no topic found");
    }
});

var eventClient = mqtt.createClient(1883, 'localhost');
eventClient.subscribe('crous_event');
var CrousEntityWhoSubscribe = ["Barnave", "Diderot","Condillac"]
eventClient.on('message', function(topic, message) {

    tabEvent = message.split(/@/);
    for (var key in tabEvent) {

        (function(key) {
            EventModel.findOne({"description": tabEvent[key]}, function(err, doc) {
                if (err) {
                    throw err;
                } else
                if (doc) {
                    console.log("Already in DB !");
                } else {
                    for (var entitySub in CrousEntityWhoSubscribe) {
                        EntityModel.findOne({name: CrousEntityWhoSubscribe[entitySub]}, function(err, doc) {
                            if (!doc) {
                                console.log("Could not load Document");
                            } else {
                                console.log(tabEvent[key])
                                var event = new EventModel({
                                    name: key,
                                    description: tabEvent[key]
                                });
                                event.save(function(err) {
                                    if (!err) {
                                        return console.log("created");
                                    } else {
                                        return console.log(err);
                                    }
                                });
                                doc.events.push(event._id);
                                doc.save(function(err) {
                                    if (err)
                                        console.log('\n\n !!! ERROR with ' + topic);
                                    else
                                        console.log('\n update success for ' + topic);
                                });
                            }
                        });
                    }
                }
//        });
            });
        })(key);
    }


//    console.log("-----------------\n message= " + message);
    //      Search in DB the item coresponding
//    ItemModel.findOne({identifiant: id2search}, function(err, doc) {
//        console.log(doc);
//        if (!doc) {
//            console.log("Could not load Document");
//            return (new Error('Could not load Document'));
//        }
//        else {
////              We find the document and we update it's infos
////              infos coresponding to menus of the week
//            console.log(message.split(/@/));
//            doc.infos = message.split(/@/);
//            console.log("update");
//            doc.save(function(err) {
//                if (err)
//                    console.log('\n\n !!! ERROR with ' + topic);
//                else
//                    console.log('\n update success for ' + topic);
//            });
//        }
    console.log("--------------");
//    });
});
//    }
//});
//////////////

/**
 * CORS support.
 */

app.all('*', function(req, res, next) {
    if (!req.get('Origin'))
        return next();
    // use "*" here to accept any origin
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.set('Access-Control-Allow-Max-Age', 3600);
    if ('OPTIONS' === req.method)
        return res.send(200);
    next();
});
app.get('/api', routes.help);
app.get('/help', routes.help);
app.get('/', routes.index);
app.get('/is-init', routes.test_init);
var mers = require('mers');
app.use('/api', mers({uri: addrmongo}).rest());
//Run the server
http.createServer(app).listen(4242, function() {
    console.log("\n Start on http://localhost:4242 \n");
});

