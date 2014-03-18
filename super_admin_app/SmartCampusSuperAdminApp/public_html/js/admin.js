/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// print entities and commands on them
$.getJSON('http://localhost:4242/api/entity/',
        function(data) {
            var entity = 0;
            while (data.payload[entity]) {
                $("#table_entities_body").append(
                        "<tr id=\"tr_" + data.payload[entity]._id + "\">"
                        + "<th title=\"" + data.payload[entity].description + "\">" + data.payload[entity].name + "</th>"
                        + "<td>" + data.payload[entity]._id + "</td>"
                        + "<td>" + data.payload[entity].type + "</td>"
                        + "<td><a href=\"#panel_item\" title=\"Voir les items de l'entité\" onclick=\"printItem('" + data.payload[entity]._id + "', '" + data.payload[entity].name + "')\">" + "<i class=\"glyphicon glyphicon-th\"></i><a/></td>"
                        + "<td><a href=\"#\" title=\"Supprimer l'entité\" onclick=\"deleteEntity('" + data.payload[entity]._id + "', '" + data.payload[entity].name + "', '" + "tr_" + data.payload[entity]._id + "')\"><i class=\"glyphicon glyphicon-remove\"></i></a></td>"
                        + "<td><a href=\"#panel_modif_entity\" title=\"Modifier l'entité\" onclick=\"modifyEntity('" + data.payload[entity]._id + "')\"><i class=\"glyphicon glyphicon-pencil\"></i></a><td>"
                        + "</tr>"
                        );
                entity++;
            }
        }
);

function addEntity() {
    $("#panel_add_entity").html("<h1>Ajout d'une entité</h1>"
            + "<form role=\"form\" onSubmit=\"finalizeAddEntity()\">"
            + "<div class=\"row\">"
            + "     <div class=\"col-md-1\">"
            + "         <label class=\"label label-info\">Nom : </label for=\"add_entity_area_name\">"
            + "     </div>"
            + "     <div class=\"col-md-2\">"
            + "         <textarea name=\"add_entity_area_name\" id=\"add_entity_area_name\" rows='1' cols='50'></textarea>"
            + "     </div>"
            + "</div>"
            + "<div class=\"row\">"
            + "     <div class=\"col-md-1\">"
            + "         <label class=\"label label-info\">Type : </label for=\"add_entity_area_type\">"
            + "     </div>"
            + "     <div class=\"col-md-2\">"
            + "         <textarea name=\"add_entity_area_type\" id=\"add_entity_area_type\" rows='1' cols='50'></textarea>"
            + "     </div>"
            + "</div>"
            + "<div class=\"row\">"
            + "     <div class=\"col-md-1\">"
            + "         <label class=\"label label-info\">Description : </label for=\"add_entity_area_description\">"
            + "     </div>"
            + "     <div class=\"col-md-2\">"
            + "         <textarea name=\"add_entity_area_description\" id=\"add_entity_area_description\" rows='5' cols='50'></textarea>"
            + "     </div>"
            + "</div>"
            + "<button type=\"button\" class=\"btn\" onclick=\"finalizeAddEntity()\">OK</button>"
            + "<button type=\"button\" class=\"btn\" onclick=\"clearPanel('panel_add_entity')\">Annuler</button>"
            + "</form>"
            );
}

function finalizeAddEntity() {
    console.log($("#add_entity_area_name").val() + "\n" + $("#add_entity_area_type").val() + "\n" + $("#add_entity_area_description").val());
    $.ajax({
        url: "http://localhost:4242/api/entity/",
        type: "POST",
        data: {
            "name": $("#add_entity_area_name").val(),
            "type": $("#add_entity_area_type").val(),
            "description": $("#add_entity_area_description").val()
        },
        success: function() {
            alert('Ajout pris en compte.');
            location.reload();
        }
    }
    );
}

// remove entity from the database
// (line: tr id to remove from the DOM)
function deleteEntity(entity, entity_name, line) {
    if (confirm("Supprimer " + entity_name + " ?")) {
        jQuery.ajax({
            url: "http://localhost:4242/api/entity/" + entity,
            type: "DELETE",
            success: function() {
                $("#" + line).remove();
            }
        });
    }
}

// print one item
function printItem(entity, entity_name) {
    $("#panel_item").html("<table id=\"table_items\" class=\"table table-striped table-condensed\">"
            + "<caption id=\"table_items_caption\"><h1>Items</h1></caption>"
            + "<thead>"
            + " <tr>"
            + "     <th>Identifiant</th>"
            + "     <th>Nom</th>"
            + "     <th>Description</th>"
            + "     <th>Supprimer</th>"
            + "     <th>Modifier</th>"
            + " </tr>"
            + "</thead>"
            + "<tbody id=\"table_items_body\">"
            + "</tbody>"
            + "</table>");
    $("#table_items_caption").html("<h1>Items de <span class=\"label label-primary\">" + entity_name + "</span></h1>");
    $("#table_items_body").html('');
    $.getJSON('http://localhost:4242/api/entity/' + entity,
            function(dataEntity) {
                var item = 0;
                while (dataEntity.payload.items[item]) {
                    $.getJSON('http://localhost:4242/api/item/' + dataEntity.payload.items[item],
                            function(dataItem) {
                                $("#table_items_body").append(
                                        "<tr id=\"tr_" + dataItem.payload._id + "\">"
                                        + "<td>" + dataItem.payload.identifiant + "</td>"
                                        + "<td>" + dataItem.payload.name + "</td>"
                                        + "<td>" + dataItem.payload.description + "</td>"
                                        + "<td><a href=\"#\" title=\"Supprimer\" onclick=\"deleteItem('" + dataItem.payload._id + "', '" + dataItem.payload.name + "', '" + "tr_" + dataItem.payload._id + "', '" + entity + "')\"><i class=\"glyphicon glyphicon-remove\"></i></a></td>"
                                        + "<td><a href=\"#\" title=\"Modifier\" onclick=\"modifyItem('" + dataItem.payload._id + "', '" + dataItem.payload.name + "', '" + "tr_" + dataItem.payload._id + "')\"><i class=\"glyphicon glyphicon-pencil\"></i></a></td>"
                                        + "</tr>"
                                        );
                            }
                    );
                    item++;
                }
            });
}

// remove item from the database
// (line: tr id to remove from the DOM)
function deleteItem(item, item_name, line, entity) {
    if (confirm("Supprimer " + item_name + " ?")) {
        jQuery.ajax({
            url: "http://localhost:4242/api/item/" + item,
            type: "DELETE",
            success: function() {
                $("#" + line).remove();
                $.getJSON('http://localhost:4242/api/entity/' + entity,
                        function(dataEntity) {
                            var i = 0, j = 0;
                            var newItems = {};
                            while (dataEntity.payload.items[i]) {
                                if (dataEntity.payload.items[i] !== item) {
                                    newItems[j] = dataEntity.payload.items[i];
                                    j++;
                                }
                                i++;
                            }
                            $.ajax({
                                url: "http://localhost:4242/api/entity/" + entity,
                                type: "PUT",
                                data: {
                                    "items": newItems
                                },
                                success: function() {
                                    console.log('suppression item: success');
                                },
                                error: function() {
                                    alert('suppression item: error');
                                }
                            });
                        });
            }
        });
    }
}

function modifyEntity(entity_id) {
    $.getJSON('http://localhost:4242/api/entity/' + entity_id,
            function(data) {
                $("#panel_modif_entity").html("<h1>Modification de <span class=\"label label-primary\">" + data.payload.name + "</span></h1>"
                        + "<form role=\"form\" onSubmit=\"setEntityChanges('" + entity_id + "')\">"
                        + "     <div class=\"row\">"
                        + "         <div class=\"col-md-1\">"
                        + "             <label class=\"label label-info\" for=\"entity_area_name\">Nom : </label>"
                        + "         </div>"
                        + "         <div class=\"col-md-2\">"
                        + "             <textarea name=\"entity_area_name\" id=\"entity_area_name\" rows='1' cols='50'>" + data.payload.name + "</textarea>"
                        + "         </div>"
                        + "     </div>"
                        + "     <div class=\"row\"><div class=\"col-md-1\">"
                        + "         <label class=\"label label-info\" for=\"entity_area_type\">Type : </label>"
                        + "     </div>"
                        + "     <div class=\"col-md-2\">"
                        + "         <textarea name=\"entity_area_type\" id=\"entity_area_type\" rows='1' cols='50'>" + data.payload.type + "</textarea>"
                        + "     </div>"
                        + " </div>"
                        + " <div class=\"row\">"
                        + "     <div class=\"col-md-1\">"
                        + "         <label class=\"label label-info\" for=\"entity_area_description\">Description : </label>"
                        + "     </div>"
                        + "     <div class=\"col-md-2\">"
                        + "         <textarea name=\"entity_area_description\" id=\"entity_area_description\" rows='5' cols='50'>" + data.payload.description + "</textarea>"
                        + "     </div>"
                        + " </div>"
                        + "<button type=\"button\" class=\"btn\" onclick=\"setEntityChanges('" + entity_id + "')\">OK</button>"
                        + "<button type=\"button\" class=\"btn\" onclick=\"clearPanel('panel_modif_entity')\">Annuler</button>"
                        + "</form>"
                        );
            });
}

function setEntityChanges(entity_id) {
    $.ajax({
        url: "http://localhost:4242/api/entity/" + entity_id,
        type: "PUT",
        data: {
            "name": $("#entity_area_name").val(),
            "type": $("#entity_area_type").val(),
            "description": $("#entity_area_description").val()
        },
        success: function() {
            alert('Modification prise en compte.');
            location.reload();
        }
    }
    );
    return true;
}

function modifyItem(item_id) {
    $.getJSON('http://localhost:4242/api/item/' + item_id,
            function(data) {
                $("#panel_modif_item").html("<h1>Modification de <span class=\"label label-primary\">" + data.payload.name + "</span></h1>"
                        + "<form role=\"form\" onSubmit=\"setItemChanges('" + item_id + "')\">"
                        + "     <div class=\"row\">"
                        + "         <div class=\"col-md-1\">"
                        + "             <label class=\"label label-info\" for=\"item_area_name\">Nom : </label>"
                        + "         </div>"
                        + "         <div class=\"col-md-2\">"
                        + "             <textarea name=\"item_area_name\" id=\"item_area_name\" rows='1' cols='50'>" + data.payload.name + "</textarea>"
                        + "         </div>"
                        + "     </div>"
                        + "     <div class=\"row\">"
                        + "         <div class=\"col-md-1\">"
                        + "             <label class=\"label label-info\" for=\"item_area_identifiant\">Identifiant : </label>"
                        + "         </div>"
                        + "         <div class=\"col-md-2\">"
                        + "             <textarea name=\"item_area_identifiant\" id=\"item_area_identifiant\" rows='1' cols='50'>" + data.payload.identifiant + "</textarea>"
                        + "         </div>"
                        + "     </div>"
                        + "     <div class=\"row\">"
                        + "         <div class=\"col-md-1\" for=\"item_area_description\">"
                        + "             <label class=\"label label-info\">Description : </label>"
                        + "         </div>"
                        + "         <div class=\"col-md-2\">"
                        + "             <textarea name=\"item_area_description\" id=\"item_area_description\" rows='5' cols='50'>" + data.payload.description + "</textarea>"
                        + "         </div>"
                        + "     </div>"
                        + "     <button type=\"button\" class=\"btn\" onclick=\"setItemChanges('" + item_id + "')\">OK</button>"
                        + "<button type=\"button\" class=\"btn\" onclick=\"clearPanel('panel_modif_item')\">Annuler</button>"
                        + "</form>"
                        );
            });
}

function setItemChanges(item_id) {
    $.ajax({
        url: "http://localhost:4242/api/item/" + item_id,
        type: "PUT",
        data: {
            "name": $("#item_area_name").val(),
            "identifiant": $("#item_area_identifiant").val(),
            "description": $("#item_area_description").val()
        },
        success: function() {
            alert('Modification prise en compte.');
            location.reload();
        }
    }
    );
    return true;
}

function clearPanel(panel) {
    $("#" + panel).html('');
}
