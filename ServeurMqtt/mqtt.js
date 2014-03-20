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



var eventUjfClient = mqtt.createClient(1883, 'localhost');
eventUjfClient.subscribe('ujf_event');
var ujfEntityWhoSubscribe = ["Polytech Grenoble"];
eventUjfClient.on('message', function(topic, message) {

    tabEvent = message.split(/@/);
    for (var key in tabEvent) {

        (function(key) {
            EventModel.findOne({"description": tabEvent[key]}, function(err, doc) {
                if (err) {
                    throw err;
                } else
                if (doc) {
//                    console.log("Already in DB !");
                } else {
                    for (var entitySub in ujfEntityWhoSubscribe) {
                        EntityModel.findOne({name: ujfEntityWhoSubscribe[entitySub]}, function(err, doc) {
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

/////////////////////////////
/////// SENSORS ////////////
////////////////////////////

var sensor = mqtt.createClient(1883, 'localhost');
sensor.subscribe('sensor');
sensor.on('message', function(topic, message) {
    //The message follow the regex _id@value
    tabInfo = message.split("@");
    //Create the mesure form the sensor
    var newMesure = new MesureModel({
        value: tabInfo[1]
    });
    Sensors_dataModel.findById(tabInfo[1],function(err,sensor){
        if(sensor){
            
        }else{
            
        }
    });
    
    
    
   /* EntityModel.findOne({'name': tabInfo[0]}, 'items', function(err, entity) {
        if (err) {
            throw err;
        } else
        if (entity) {
            //console.log("this entity already exist" + entity);
            //See if the item exist
            var exist = false;
            var i = 0;
            ItemModel.findOne({'name': tabInfo[1], 'room_number': tabInfo[2]}, function(err, item) {
                //if the item already exist
                //console.log("value item" + item);
                if (item) {
                    //console.log("item already exist");
                    //verify if the sensor already exist or not
                    Sensors_dataModel.findOne({'position': tabInfo[3], 'type': tabInfo[4]}, function(err, sensorData) {
                        //if the sensor does not already exist

                        if (sensorData == null) {
                            //console.log("create a newSensors Data");
                            var newSensors_data = new Sensors_dataModel({
                                type: tabInfo[4],
                                position: tabInfo[3],
                                mesure: [newMesure]
                            });
                            newSensors_data.save(function(err) {
                                if (err) // ...
                                    console.log('Register sensor data in DB failed');
                                else {
                                    item.Sensors_data.push(newSensors_data);
                                    item.save(function(err) {
                                        if (err) // ...
                                            console.log('Register mesure in DB failed');
                                        else {
                                            entity.items = item;
                                            entity.save(function(err) {
                                                if (err)
                                                    console.log('Register mesure in DB failed')
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            //console.log("add mesure");
                            //if the sensor already exist
                            newMesure.save(function(err) {
                                if (err)
                                    console.log('Register mesure in DB failed');
                                else {
                                    sensorData.mesure.push(newMesure);
                                    sensorData.save(function(err) {
                                        if (err) // ...
                                            console.log('Register mesure in DB failed');
                                        else {
                                            item.Sensors_data = sensorData;
                                            item.save(function(err) {
                                                if (err)
                                                    console.log('Register mesure in DB failed')
                                                else {
                                                    entity.items = item
                                                    entity.save(function(err) {
                                                        if (err)
                                                            console.log('Register mesure in DB failed')
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });

                        }
                    })
                }
                //if the item doesn't exist
                else {
                    //console.log("item does not exist " );
                    var newSensors_data = new Sensors_dataModel({
                        type: tabInfo[4],
                        position: tabInfo[3],
                        mesure: [newMesure]
                    });
                    //Create item
                    var newItem = new ItemModel({
                        name: tabInfo[1],
                        position: tabInfo[3], //be carefull!! the positions is the same as the sensor
                        room_number: tabInfo[2],
                        Sensors_data: [newSensors_data],
                        identifiant: entity.items.length + 1,
                        type: "",
                        infos: [],
                        description: ""
                    });

                    newItem.save(function(err) {
                        if (err) // ...
                            console.log('Register item data in DB failed');
                        else {
                            entity.items.push(newItem);
                            entity.save(function(err) {
                                if (err) // ...
                                    console.log('Register item data in DB failed');
                            });
                        }
                    });

                }
            });
        } else {
            //console.log('The entity does not exist inside the DB')
        }
    }
    );*/
});
