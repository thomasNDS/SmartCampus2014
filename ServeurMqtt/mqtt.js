/*
 * SmartCampus
 *  ©SmartCampus 2014 https://github.com/thomasNDS/SmartCampus2014
 *  License MIT
 */

////////////////////////////////
/////// MQTT  //////////////////
////////////////////////////////

var crousClient = mqtt.createClient(1883, 'localhost');
//17,3,4,24,46,18,19
crousClient.subscribe('menu_crous_3');
crousClient.subscribe('menu_crous_4');
crousClient.subscribe('menu_crous_17');
crousClient.subscribe('menu_crous_18');
crousClient.subscribe('menu_crous_19');
crousClient.subscribe('menu_crous_24');
crousClient.subscribe('menu_crous_46');

crousClient.on('message', function(topic, message) {
    console.log("-----------------\n message= " + message);
    //verify it's a crous topic
    if (/menu_crous/.test(topic)) {
//        Extract from the topic name the ID
        var id2search = parseInt((topic.match(/[0-9]+/))[0]);

//      Search in DB the item coresponding
        ItemModel.findOne({identifiant: id2search}, function(err, doc) {
            console.log(doc);
            if (!doc) {
                console.log("Could not load Document");
                return (new Error('Could not load Document'));
            }
            else {
//              We find the document and we update it's infos
//              infos coresponding to menus of the week
                console.log(message.split(/@/));
                doc.infos = message.split(/@/);
                console.log("update");
                doc.save(function(err) {
                    if (err)
                        console.log('\n\n !!! ERROR with ' + topic);
                    else
                        console.log('\n update success for ' + topic);
                });
            }
        });
        console.log("--------------");
    } else {
        console.log("no topic found");
    }
});


var eventCrousClient = mqtt.createClient(1883, 'localhost');
eventCrousClient.subscribe('crous_event');
var CrousEntityWhoSubscribe = ["Barnave", "Diderot", "Condillac"];
eventCrousClient.on('message', function(topic, message) {

    tabEvent = message.split(/@/);
    for (var key in tabEvent) {

        (function(key) {
            EventModel.findOne({"description": tabEvent[key]}, function(err, doc) {
                if (err) {
                    throw err;
                } else
                if (doc) {
                    console.log("Already in DB !");
                } else {
                    for (var entitySub in CrousEntityWhoSubscribe) {
                        EntityModel.findOne({name: CrousEntityWhoSubscribe[entitySub]}, function(err, doc) {
                            if (!doc) {
                                console.log("Could not load Document");
                            } else {
                                console.log(tabEvent[key])
                                var event = new EventModel({
                                    name: key,
                                    description: tabEvent[key]
                                });
                                event.save(function(err) {
                                    if (!err) {
                                        return console.log("created");
                                    } else {
                                        return console.log(err);
                                    }
                                });
                                doc.events.push(event._id);
                                doc.save(function(err) {
                                    if (err)
                                        console.log('\n\n !!! ERROR with ' + topic);
                                    else
                                        console.log('\n update success for ' + topic);
                                });
                            }
                        });
                    }
                }
            });
        })(key);
    }
});

var tagClient = mqtt.createClient(1883, 'localhost');
tagClient.subscribe('hours_ST-MARTIN-D_HERES_CONDILLAC-UNIVERSITES');
tagClient.subscribe('hours_ST-MARTIN-D_HERES_BIBLIOTHEQUES_UNIVERSITAIRES');
tagClient.subscribe('hours_ST-MARTIN-D_HERES_GABRIEL_FAURE');
tagClient.subscribe('hours_ST-MARTIN-D_HERES_LES_TAILLEES-UNIVERSITES');
var tagEntityWhoSubscribe = ["", , ""];
tagClient.on('message', function(topic, message) {
    console.log(message);
    var stop = "";
    switch (topic) {
        case 'hours_ST-MARTIN-D_HERES_CONDILLAC-UNIVERSITES':
            stop = "CONDILLAC UNIVERSITAIRES";
            break;
        case 'hours_ST-MARTIN-D_HERES_BIBLIOTHEQUES_UNIVERSITAIRES':
            stop = "BIBLIOTHEQUES UNIVERSITAIRES";
            break;
        case 'hours_ST-MARTIN-D_HERES_GABRIEL_FAURE':
            stop = "GABRIEL FAURE";
            break;
        case 'hours_ST-MARTIN-D_HERES_LES_TAILLEES-UNIVERSITES':
            stop = "Taille UNIVERSITE";
            break;
    }
    ItemModel.findOne({identifiantString: stop}, function(err, doc) {
        if (!doc) {
            console.log("Could not load Document");
        } else {

            if (message !== "undefined") {
                console.log()
                myData = message;
                    doc.infos = myData;
                    doc.save(function(err) {
                        if (err)
                            console.log('\n\n !!! ERROR with ' + topic);
                        else
                            console.log('\n update success for ' + topic);
                    });

            }
        }
    });
});