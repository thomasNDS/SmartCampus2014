/*
 * SmartCampus
 *  ©SmartCampus 2014 https://github.com/thomasNDS/SmartCampus2014
 *  License MIT
 */

exports.login = function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    AdministratorModel.findOne({'login': username, 'password': password}, 'username', function(err, admin) {
        if (err)
            return handleError(err);
        if (admin != null) {
            request.session.regenerate(function() {
                request.session.user = username;
                response.redirect('/restricted');
            });
        } else {
            response.redirect('authentication.html');
        }
    });

};

exports.whoami = function(request, res) {
    if (request.session && request.session.user) {
        res.send(request.session.user);
    } else {
        res.send("personne");
    }
};

exports.logout=function(request, response) {
    request.session.admin = null;
    request.session.user = null;
    response.redirect('/');
};