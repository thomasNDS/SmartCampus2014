/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var restify = require('express-restify-mongoose')

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://nicko466@gmail.com:salocin28500@ds031359.mongolab.com:31359/heroku_app17938038';

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

var Invoice = new Schema({
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    amount: { type: Number, required: true }
});
var InvoiceModel = mongoose.model('Invoice', Invoice);


var app = express();
app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    restify.serve(app, CustomerModel);
    restify.serve(app, InvoiceModel);
});

http.createServer(app).listen(4242, function() {
    console.log("Express server listening on port 4242");
});
