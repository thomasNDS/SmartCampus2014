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
};
exports.json = function(req, res) {
    res.json(200, {message: "Welcome in our site ! , see /help if needed"});
};
exports.test_init = function(req, res) {
    AdministratorModel.findOne({name: "guelorgette"}, function(err, doc) {
        console.log(doc);
        if (!doc) {
            console.log("DB not init");
            res.json(false);
        }
        else {
            res.json(true);
        }
    });
};

exports.add_comment = function(req, res) {
    var entityId = req.body.entityId;
    var commentValue = req.body.commentValue;
//    console.log("entite = " + entityId + " commentValue " + commentValue);

    //Creation du commentaire dans la BD
    var newComment = new CommentModel({
        value: commentValue
    });
    newComment.save(function(err) {
        if (!err) {
            return console.log("comment created");
        } else {
            return console.log(err);
        }
    });

    //Ajout du commentaire dans l'entite
    EntityModel.findById(entityId, function(err, ent) {
//        console.log(" ent: " + ent + "newCom" + newComment);
        ent.comments.push(newComment._id);
        ent.save(function(err) {
            if (!err) {
                return console.log("Lien created");
            } else {
                return console.log(err);
            }
        });
        return res.send(newComment);
    });

};

exports.administrator = require("./administrator.js");
exports.authenticate = require("./authenticate.js");
exports.crowdsourcing = require("./crowdsourcing.js");
exports.adminapp = require("./adminapp.js");
