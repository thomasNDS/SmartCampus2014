
exports.index = function(req, res) {
    res.json(200, {message: "Une route"});
};
    exports.administrator = require("./administrator.js");
    exports.building = require("./building.js");
