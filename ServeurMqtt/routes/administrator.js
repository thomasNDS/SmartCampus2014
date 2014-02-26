
exports.get = function(req, res) {
    return AdministratorModel.find(function(err, Administrator) {
        if (!err) {
            console.log("GET administrator");
            return res.send(Administrator);
        } else {
            return console.log(err);
        }
    });
};

exports.add = function(req, res) {
    var admin;
    console.log("POST: ");
    console.log(req.body);
    admin = new AdministratorModel({
        first_name: req.body.first_name,
        name: req.body.name,
        building: [Building]
    });
    admin.save(function(err) {
        if (!err) {
            return console.log("created");
        } else {
            return console.log(err);
        }
    });
    return res.send(admin);
};

exports.getById = function(req, res) {
    return AdministratorModel.findById(req.params.id, function(err, Administrator) {
        if (!err) {
            return res.send(Administrator);
        } else {
            return console.log(err);
        }
    });
};

exports.up = function(req, res) {
    return AdministratorModel.findById(req.params.id, function(err, administrator) {
        administrator.first_name = req.body.first_name;
        administrator.name = req.body.name;
        administrator.building = req.body.building;
        return administrator.save(function(err) {
            if (!err) {
                console.log("updated");
            } else {
                console.log(err);
            }
            return res.send(administrator);
        });
    });
};

exports.delete = function(req, res) {
    return AdministratorModel.findById(req.params.id, function(err, administrator) {
        return administrator.remove(function(err) {
            if (!err) {
                console.log("removed");
                return res.send('');
            } else {
                console.log(err);
            }
        });
    });
};