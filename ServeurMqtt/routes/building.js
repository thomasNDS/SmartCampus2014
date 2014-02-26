
exports.get = function(req, res) {
    return BuildingModel.find(function(err, building) {
        if (!err) {
            console.log("GET building");
            return res.send(building);
        } else {
            return console.log(err);
        }
    });
};

exports.add = function(req, res) {
    var elt;
    console.log("POST: ");
    console.log(req.body);
    elt = new BuildingModel({
        comment: req.body.comment,
        name: req.body.name
    });
    elt.save(function(err) {
        if (!err) {
            return console.log("created");
        } else {
            return console.log(err);
        }
    });
    return res.send(elt);
};

exports.getById = function(req, res) {
    return BuildingModel.findById(req.params.id, function(err, Building) {
        if (!err) {
            return res.send(Building);
        } else {
            return console.log(err);
        }
    });
};

exports.up = function(req, res) {
    return BuildingModel.findById(req.params.id, function(err, building) {
        building.comment = req.body.comment;
        building.name = req.body.name;
        return building.save(function(err) {
            if (!err) {
                console.log("updated");
            } else {
                console.log(err);
            }
            return res.send(building);
        });
    });
};

exports.delete = function(req, res) {
    return BuildingModel.findById(req.params.id, function(err, building) {
        return building.remove(function(err) {
            if (!err) {
                console.log("removed");
                return res.send('');
            } else {
                console.log(err);
            }
        });
    });
};