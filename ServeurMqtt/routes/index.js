/*
 * SmartCampus
 *  ©SmartCampus 2014 https://github.com/thomasNDS/SmartCampus2014
 *  License MIT
 */

exports.index = function(req, res) {
    res.send("<h1>Welcome</h1> Discover our API doc <a href='/help'> here </a>");
};
exports.help = function(req, res) {
    res.render('doc.html');
}
exports.json = function(req, res) {
    res.json(200, {message: "Welcome in our site ! , see /help if needed"});
};

exports.test_init = function(req, res) {
    var resultat = false;
    EntityModel.findOne({name: "barnave"}, function(err, doc) {
        console.log(doc);
        if (!doc) {
            console.log("Could not load Document");
            res.json(false);
        }
        else {
            res.json(true);
        }
    });
};

exports.administrator = require("./administrator.js");
exports.building = require("./building.js");
