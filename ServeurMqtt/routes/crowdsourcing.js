/*
 * SmartCampus
 *  ©SmartCampus 2014 https://github.com/thomasNDS/SmartCampus2014
 *  License MIT
 */

average = 5;

//Pour pouvoir faire une action sur le avg sans passer par une requete post (pour test)
exports.voteRuGet = function(req, res) {
    console.log("vote ru");
    average++;
    processAvg();
    res.send("à voter !");
};

exports.voteRu2 = function(req, res) {
    console.log(parseInt(req.body.value) + 2);
    var valueVote = parseInt(req.body.value);
    processAvg(valueVote);
    res.json(true);
};

exports.getRu = function(req, res) {
    console.log("vote ru");
    res.send("moyenne : " + average);
};

function processAvg(newVote){
    average += newVote;
}