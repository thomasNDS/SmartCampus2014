/*
 * SmartCampus
 *  ©SmartCampus 2014 https://github.com/thomasNDS/SmartCampus2014
 *  License MIT
 */

//Launch child process (python parser here)
exports.covoiturage = function(req, res) {
    var dataRes = "";
    var spawn = require('child_process').spawn,
            pythonProcess = spawn('python', ['script/covoiturage.py', req.body.destination, req.body.day, req.body.month, req.body.year]);

    pythonProcess.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
        dataRes += data;
    });

    pythonProcess.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });

    pythonProcess.on('close', function(code) {
        console.log('child process exited with code ' + code);
        res.send("" + dataRes);
    });
};

exports.translate = function(req, res) {
    var dataRes = "";
    var spawn = require('child_process').spawn,
            pythonProcess = spawn('python', ['script/translate.py', req.body.lang, req.body.corpus]);

    pythonProcess.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
        dataRes += data;
    });

    pythonProcess.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });

    pythonProcess.on('close', function(code) {
        console.log('child process exited with code ' + code);
        res.send("" + dataRes);
    });
};

exports.casierNFC = function(req, res) {
    var dataRes = "";
    var spawn = require('child_process').spawn,
            pythonProcess = spawn('python', ['script/casier_nfc.py']);

    pythonProcess.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
        dataRes += data;
    });

    pythonProcess.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });

    pythonProcess.on('close', function(code) {
        console.log('child process exited with code ' + code);
        res.send("" + dataRes);
    });
};