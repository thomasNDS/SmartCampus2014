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
var mers = require('mers');
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

    app.use(express.cookieParser('S3CRE7'));
    app.use(express.cookieSession());
    app.use(app.router);

    app.use(express.methodOverride());
    app.use(express.static(path.join(__dirname, "/public")));
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

includeInThisContext(__dirname + "/mqtt.js");

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
//routes for authentication
//app.post('/login', routes.authenticate.login);

//app.get('/vote/vote_ruG', routes.crowdsourcing.voteRuGet);
app.post('/vote/moyenne_ru', routes.crowdsourcing.getRu);
app.post('/vote/vote_ru2', routes.crowdsourcing.voteRu2);

app.post('/add_comment', routes.add_comment);

app.post('/covoiturage', function(req, res) {
    var dataRes = "OK";
    var spawn = require('child_process').spawn,
            pythonProcess = spawn('python', ['script/covoiturage.py', req.body.destination, req.body.day, req.body.month, req.body.year]);

    pythonProcess.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
        dataRes += data;
    });

    pythonProcess.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });

    pythonProcess.on('close', function(code) {
        console.log('child process exited with code ' + code);
        res.send("" + dataRes + req.body.destination);
    });
});

app.use('/api', mers({uri: addrmongo}).rest());



function restrict(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}


app.get('/logout', function(request, response) {
    request.session.admin = null;
    request.session.user = null;
    response.redirect('/');
});


//Example of a restricted route !
app.get('/restricted', restrict, function(request, response) {
    response.send('This is the restricted area! Hello ' + request.session.user + '! click <a href="/logout">here to logout</a>');
});

//Run the server
http.createServer(app).listen(4242, function() {
    console.log("\n Start on http://localhost:4242 \n");
});
//exports.authCallback = function (req, res, next) {
//  //Check if the logged in user is an admin
//  Admin.findOne( { user : req.user.id },function ( err, admin, count ){
//    var old = req.session;
//      if(!err && admin)
//        req.session.isAdmin = true;
//      res.redirect('/')
//  })
//}