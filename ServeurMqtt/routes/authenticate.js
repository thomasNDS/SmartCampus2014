
/*exports.login = function(req, res) {
 var username = request.body.username;
 var password = request.body.password;
 AdministratorModel.findOne({'login': username, 'password': password}, 'name', function(err, admin) {
 if (err)
 return handleError(err);
 if (admin != null) {
 req.session.admin = admin;
 console.log("success");
 } else {
 req.session.admin = null;
 console.log("fail");
 }
 res.send('admin: ' + req.session.admin);
 });
 res.json(true);
 
 };*/

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

// Un exemple qui marche sinon :p
// 
//app.get('/login', function(request, response) {
//    response.send('<form method="post" action="/login">' +
//            '<p>' +
//            '<label>Username:</label>' +
//            '<input type="text" name="username">' +
//            '</p>' +
//            '<p>' +
//            '<label>Password:</label>' +
//            '<input type="text" name="password">' +
//            '</p>' +
//            '<p>' +
//            '<input type="submit" value="Login">' +
//            '</p>' +
//            '</form>');
//});

//app.post('/login', function(request, response) {
//
//    var username = request.body.username;
//    var password = request.body.password;
//
//    if (username == 'demo' && password == 'demo') {
//        console.log(request.session)
////        request.session.regenerate(function() {
//        request.session.user = username;
//        response.redirect('/restricted');
////        });
//    }
//    else {
//        res.redirect('login');
//    }
//});