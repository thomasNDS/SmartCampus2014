
//function to authentify the admin
function authentify() {
    $.ajax({url: 'http://localhost:4242/login',
        type: 'POST',
        data: {login: $('#username').val(), password: $('#password').val()},
        error: function(){
            console.log("Error");
        },
        success: function() {
            console.log("Success");
        },
        async: false,
        cache: false
    })
}