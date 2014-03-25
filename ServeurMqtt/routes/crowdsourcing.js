/*
 * SmartCampus
 *  ©SmartCampus 2014 https://github.com/thomasNDS/SmartCampus2014
 *  License MIT
 */

voteFake = 1;
average = 0;
var table_polls = [];
maxTime = 1800; // time from which polls are ignored (seconds)

//Pour pouvoir faire une action sur le avg sans passer par une requete post (pour test)
//exports.voteRuGet = function(req, res) {
//    console.log("vote ru");
//    voteFake = (voteFake * 2) % 5;
//    average++;
//    processAvg(voteFake);
//    res.send("à voter ! value = " + voteFake);
//};

//POST
exports.voteRu2 = function(req, res) {
    var valueVote = parseInt(req.body.value);
    var idEntity = req.body.idEntity;
    processAvg(valueVote, idEntity);
    res.json(true);
};

//GET
exports.getRu = function(req, res) {
//    res.send("" + average);
//    updateTable();
    var idEntity = req.body.idEntity;
//    console.log("Get vote ru id : " + idEntity);
    var vote = getVoteEntityById(idEntity, function(voterecup) {
//        console.log("recup vote : " + voterecup);
        res.json(voterecup);
    });
};

function processAvg(newPoll, idEntity) {
//    console.log("nouveau vote : " + newPoll);
    var mean = 0, coeffsSum = 0;
    var currentTime = new Date();
    table_polls.push({"date": new Date(), "poll": newPoll});

    table_polls.forEach(function(value) {
        var delay = (currentTime - value.date) / 1000;
        currentCoeff = getCoeff(delay);
        mean += value.poll * currentCoeff;
        coeffsSum += currentCoeff;
    });
//    average = mean / coeffsSum;
    var newValue = mean / coeffsSum;
//    console.log("value= " + newValue + "id= " + idEntity);
    setVoteEntityById(idEntity, newValue);
    updateTable();
}

// delay: difference between the poll time and current time
function getCoeff(delay) {
    var res = maxTime - delay;
    return (res >= 0 ? res : 0);
}

// remove polls that older than the limit
function updateTable() {
    var now = new Date();
    while (table_polls.length > 0) {
        if (table_polls[0].date < (now - maxTime)) {
            table_polls.shift();
        } else {
            break;
        }
    }
}

function getVoteEntityById(idEntity, callback) {
    var vote = 0;
    EntityModel.findById(idEntity, function(err, ent) {
        if (err) {
            console.log(err);
        } else {
//            console.log("getVoteEntityById OK, vote " + ent.voteValue);
            vote = ent.voteValue;
            return callback(vote);
        }
    });
}

function setVoteEntityById(idEntity, vote) {
    EntityModel.findById(idEntity, function(err, ent) {
        ent.voteValue = vote;
        ent.save(function(err) {
            if (!err) {
                return console.log("Maj vote");
            } else {
                return console.log(err);
            }
        });
    });
}
