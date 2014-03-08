
exports.index = function(req, res) {
    res.send("<h1>Welcome</h1> Discover our API doc <a href='/help'> here </a>");
};
exports.help = function(req, res) {
    res.render('doc.html');
}
exports.json = function(req, res) {
    res.json(200, {message: "Welcome in our site ! , see /help if needed"});
};
exports.administrator = require("./administrator.js");
exports.building = require("./building.js");
