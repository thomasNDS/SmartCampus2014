/*
 * SmartCampus
 *  ©SmartCampus 2014 https://github.com/thomasNDS/SmartCampus2014
 *  License MIT
 */

exports.login = function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    AdministratorModel.findOne({'login': username, 'password': password}, 'username entity', function(err, admin) {
        if (err)
            return handleError(err);
        if (admin !== null) {
            request.session.regenerate(function() {
                request.session.user = username;
                request.session.id = admin._id;
                request.session.entity = admin.entity;
//                response.redirect('/restricted');
                response.redirect('/admin');
            });
        } else {
            response.redirect('authentication.html');
        }
    });

};

exports.whoami = function(request, res) {
    if (request.session && request.session.user) {
        res.json({id: request.session.id, user: request.session.user, entity: request.session.entity});
    } else {
        res.send("personne");
    }
};

exports.logout = function(request, response) {
    request.session.admin = null;
    request.session.user = null;
    response.redirect('/');
};
