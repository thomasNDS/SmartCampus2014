/*
 * SmartCampus
 *  ©SmartCampus 2014 https://github.com/thomasNDS/SmartCampus2014
 *  License MIT
 */

average = 5;
var table_polls = [];
maxTime = 1800; // time from which polls are ignored

//Pour pouvoir faire une action sur le avg sans passer par une requete post (pour test)
exports.voteRuGet = function(req, res) {
    console.log("vote ru");
    average++;
    processAvg();
    res.send("à voter !");
};

exports.voteRu2 = function(req, res) {
    var valueVote = parseInt(req.body.value);
    processAvg(valueVote);
    res.json(true);
};

exports.getRu = function(req, res) {
    console.log("vote ru");
    res.send(""+average);
};

function processAvg(newPoll) {
    var mean = 0, coeffsSum = 0;
    var currentTime = new Date();
    table_polls.push({"date": new Date(), "poll": newPoll});
    $.each(table_polls, function(index, value) {
        var delay = (currentTime - value.date) / 1000;
        currentCoeff = getCoeff(delay);
        mean += value.poll * currentCoeff;
        coeffsSum += currentCoeff;
    });
    average = mean / coeffsSum;
    updateTable();
}

// delay: difference between the poll time and current time
function getCoeff(delay) {
    var res = maxTime - delay;
    return (res >= 0 ? res : 0);
}

// remove polls that are too old
function updateTable() {
    var now = new Date();
    while (table_polls.length > 0) {
        if (table_polls[i].date < (now - maxTime)) {
            table_polls.shift();
        } else {
            break;
        }
    }
}