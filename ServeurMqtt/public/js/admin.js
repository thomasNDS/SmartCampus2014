/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var current_entity = null;

function initialize() {
    build_menu();
    var menus = ['configuration', 'comments', 'events', 'rights'];
    $(menus).each(function(index, menu) {
        $("#menu_" + menu).click(function() {
            displayLeftPanel(menu);
        });
    });
}

// gathers entities from DB and builds the top menu
// and the corresponding panels
function build_menu() {
    var entities = get_entities(), entity = 0;
    if (entities) {
        while (entities[entity]) {
            $.getJSON('http://localhost:4242/api/entity/' + entities[entity],
                    function(data) {
                        var name = data.payload.name.replace(" ", "_");
                        $("#entities_list").append(
                                "<li><a href=\"#entity_"
                                + name
                                + "\" data-toggle=\"tab\" onclick=\"update_current_entity('" + data.payload._id + "')\">"
                                + "<i class=\"glyphicon glyphicon-home\"></i>"
                                + data.payload.name
                                + "</a></li>"
                                );
                        $("#entities_content").append(
                                "<div class=\"tab-pane\" id=\"entity_"
                                + name
                                + "\">"
                                + "</div>"
                                );
                    });
            entity++;
        }
    }
}

function update_current_entity(entity_id) {
    current_entity = entity_id;
}

function get_entities() {
    var entities;
    $.ajax({
        url: 'http://localhost:4242/whoami/',
        dataType: 'json',
        async: false,
        success: function(data) {
            entities = data.entity;
        }
    });
    return entities;
}

// display the left panel content according to
// the selected menu (left menu)
function displayLeftPanel(link) {
    $.ajax({
        url: 'admin/' + link + '.html',
        type: 'GET',
        dataType: 'html',
        success: function(data) {
            $("#leftpanel").html(data);
        },
        error: function() {
            $("#leftpanel").html('');
        }
    });
}

function get_sensors() {
    if (current_entity) {
        $.getJSON('http://localhost:4242/api/entity/' + current_entity,
                function(data) {
                    var items = data.payload.items;
                    $(items).each(function(index, value) {
                        $.getJSON('http://localhost:4242/api/item/' + value,
                                function(item) {
                                    $("#div_sensors").append("<p>" + item.payload.name + "</p><table class=\"table\"><tbody id=\"tbody_" + item.payload._id + "\"></tbody></table>");
                                    $(item.payload.Sensors_data).each(function(index, value) {
                                        console.log(value);
                                        $.getJSON('http://localhost:4242/api/sensors_data/' + value,
                                                function(sensor) {
                                                    console.log(sensor);
                                                    $("#tbody_" + item.payload._id).append("<tr><td>" + sensor.payload.identifiant + "</td>"
                                                    +"<td><a href=\"#\" title=\"Modifier\"><i class=\"glyphicon glyphicon-pencil\"></i></a></td>"
                                                    +"<td><a href=\"#\" title=\"Supprimer\"><i class=\"glyphicon glyphicon-remove\"></i></a></td></tr>");
                                                });
                                    });
                                });
                    });
                });
    }
}

function get_comments() {
    $("#div_comments").html("");
    if (current_entity) {
        $.getJSON('http://localhost:4242/api/entity/' + current_entity,
                function(data) {
                    var comments = data.payload.comments;
                    $(comments).each(function(index, value) {
                        $.getJSON('http://localhost:4242/api/comment/' + value,
                                function(com) {
                                    $("#div_comments").append("<blockquote>" + com.payload.value + "</blockquote>");
                                    $("#div_comments").append($.date(com.payload.date));
                                });
                    });
                });
    }
}

$.date = function(dateObject) {
    var d = new Date(dateObject);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var hour = d.getHours();
    var minute = d.getMinutes();
    var date = "<p class=\"text-right\">" + day + "/" + month + "/" + year + ", " + hour + "h" + minute + "</p>";

    return date;
};



