


exports.login = function(req, res) {
    AdministratorModel.findOne({'login':req.body.login,'password':req.body.password},'name',function(err, admin) {
        if (err)
            return handleError(err);
        if (admin!=null){
            console.log("success")
        }else{
            console.log("fail")
        }
    })
    res.json(true);
    
};