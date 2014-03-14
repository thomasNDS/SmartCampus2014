/*
 * SmartCampus
 *  ©SmartCampus 2014 https://github.com/thomasNDS/SmartCampus2014
 *  License MIT
 */

average = 5;

exports.voteRu = function(req, res) {
    console.log("vote ru");
    average++;
    res.send("à voter !");
};

exports.getRu = function(req, res) {
    console.log("vote ru");
    res.send("moyenne : " + average);
};
