/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * A FINIR
 * Fonction pour chager une entité avec ses différents items / sensor / mesure
 */
function loadFullEntity(idEntity) {

    var entity = {};
    entity._id = idEntity;
//    console.log("idEntity" + idEntity);
    if (idEntity) {
//        console.log("debut");
        $.getJSON('/api/entity/' + idEntity,
                function(data) {
//                    console.log("entité");
//                    console.log(data);
                    entity.name = data.payload[0].name;
                    entity.description = data.payload[0].description;
                    entity.typeCrowdSourcing = data.payload[0].typeCrowdSourcing;
                    entity.schedule = data.payload[0].schedule;
                    entity.type = data.payload[0].type;
                    entity.items = new Array();
                    var items = data.payload[0].items;
                    $(items).each(function(index, idItem) {
                        $.getJSON('/api/item/' + idItem,
                                function(item) {
//                                    console.log("item");
                                    var itemLoad = {};
                                    itemLoad._id = idItem;
                                    itemLoad.name = item.payload[0].name;
                                    itemLoad.infos = item.payload[0].infos;
                                    itemLoad.show = item.payload[0].show;
                                    itemLoad.Sensor_data = new Array();
                                    $(item.payload[0].Sensors_data).each(function(index, idSensor) {
                                        $.getJSON('/api/sensors_data/' + idSensor,
                                                function(sensor) {
//                                                    console.log("sensor");
                                                    var sensorLoad = {};
                                                    sensorLoad._id = idSensor;
                                                    sensorLoad.type = sensor.payload[0].type;
                                                    sensorLoad.identifiant = sensor.payload[0].identifiant;
                                                    sensorLoad.mesure = new Array();
                                                    var idMesure = sensor.payload[0].mesure[0];
                                                    $.getJSON('/api/mesure/' + idMesure,
                                                            function(mesure) {
                                                                var mesureLoad = {};
                                                                mesureLoad.value = mesure.payload[0].value;
                                                                sensorLoad.mesure.push(mesureLoad);
                                                                itemLoad.Sensor_data.push(sensorLoad);
                                                            });
                                                });
                                    });
                                    entity.items.push(itemLoad);
                                });
                    });
//                    console.log("fin loader");
//                    console.dir(entity);
                    return entity;
                });
    }
}