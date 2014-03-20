


exports.login = function(req, res) {
    AdministratorModel.findOne({'login':req.body.login,'password':req.body.password},'name',function(err, admin) {
        if (err)
            return handleError(err);
        if (admin!=null){
            req.session.admin = admin;
            console.log("success");
        }else{
            req.session.admin = null;
            console.log("fail");
        }
        res.send('admin: ' + req.session.admin);
    });
    res.json(true);
    
};