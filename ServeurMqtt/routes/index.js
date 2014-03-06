
exports.index = function(req, res) {
    res.json(200, {message: "Welcome in our site ! , see /help if needed"});
};
 exports.help = function(req, res) {
    res.send("Show all entities</br>http://localhost:4242/api/entity/ </br></br>Show an entity $id\
</br>http://localhost:4242/api/entity/$id/</br> </br>Show infos of entity $id\
</br>http://localhost:4242/api/entity/$id/infos </br></br>Show the first info of entity $id\
</br>http://localhost:4242/api/entity/$id/infos/0</br> </br>Show the first info of entity $id\
</br>http://localhost:4242/api/entity/$id/infos/0/uneInfo ");
}

    exports.administrator = require("./administrator.js");
    exports.building = require("./building.js");
