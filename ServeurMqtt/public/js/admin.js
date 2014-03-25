/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

serverAddress = "localhost";
serverPort = "4242";

// entity selected by admin (link)
var current_entity;

function initialize() {
    current_entity = null;
    build_menu();
    var menus = ['configuration', 'comments', 'rights', 'events'];
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
            $.getJSON('http://' + serverAddress + ':' + serverPort + '/api/entity/' + entities[entity],
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

function get_entities() {
    var entities;
    $.ajax({
        url: 'http://' + serverAddress + ':' + serverPort + '/whoami/',
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
        $.getJSON('http://' + serverAddress + ':' + serverPort + '/api/entity/' + current_entity,
                function(data) {
                    var items = data.payload.items;
                    $(items).each(function(index, value) {
                        $.getJSON('http://' + serverAddress + ':' + serverPort + '/api/item/' + value,
                                function(item) {
                                    $("#div_sensors").append("<p>" + item.payload.name + "</p><table class=\"table\"><tbody id=\"tbody_" + item.payload._id + "\"></tbody></table>");
                                    $(item.payload.Sensors_data).each(function(index, value) {
                                        $.getJSON('http://' + serverAddress + ':' + serverPort + '/api/sensors_data/' + value,
                                                function(sensor) {
                                                    $("#tbody_" + item.payload._id).append("<tr><td>" + sensor.payload.identifiant + "</td>"
                                                            + "<td><a href=\"#\" title=\"Modifier\"><i class=\"glyphicon glyphicon-pencil\"></i></a></td>"
                                                            + "<td><a href=\"#\" title=\"Supprimer\"><i class=\"glyphicon glyphicon-remove\"></i></a></td></tr>");
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
        $.getJSON('http://' + serverAddress + ':' + serverPort + '/api/entity/' + current_entity,
                function(data) {
                    var comments = data.payload.comments;
                    $(comments).each(function(index, value) {
                        $.getJSON('http://' + serverAddress + ':' + serverPort + '/api/comment/' + value,
                                function(com) {
                                    $("#div_comments").append("<blockquote>" + com.payload.value + "</blockquote>");
                                    $("#div_comments").append($.date(com.payload.date));
                                });
                    });
                });
    }
}

function get_events() {
    $("#div_events").html("");
    if (current_entity) {
        $.getJSON('http://' + serverAddress + ':' + serverPort + '/api/entity/' + current_entity,
                function(data) {
                    var events = data.payload.events;
                    $(events).each(function(index, value) {
                        $.getJSON('http://' + serverAddress + ':' + serverPort + '/api/event/' + value,
                                function(event) {
                                    $("#div_events").append(event.payload.name);
                                    $("#div_events").append(event.payload.description);
                                    $("#div_events").append($.date(event.payload.date));
                                });
                    });
                });
    }
}

function get_admins() {
    var selectedAdmin = 0;
    if (current_entity) {
        $.getJSON('http://' + serverAddress + ':' + serverPort + '/api/administrator/',
                function(data) {
                    var admin = 0;
                    while (data.payload[admin]) {
                        $("#admins_list").append(
                                "<option value=\""
                                + data.payload[admin]._id
                                + "\">"
                                + data.payload[admin].first_name + ' ' + data.payload[admin].name
                                + "</option>"
                                );
                        admin++;
                    }
                    $("#admins_list").change(function() {
                        $.getJSON('http://' + serverAddress + ':' + serverPort + '/api/administrator/' + $("#admins_list").val(),
                                function(selection) {
                                    selectedAdmin = selection;
                                    $("#admin_descr").html(
                                            selection.payload.first_name + ' ' + selection.payload.name
                                            );
                                    if (selection.payload.entity.indexOf(current_entity) !== -1) {
                                        admin_switch_set_to("on");
                                    } else {
                                        admin_switch_set_to("off");
                                    }
                                });
                    });
                }
        );
        $("#btn_onoff").click(function() {
            toggle_switch();
            if ($("#btn_on").hasClass('active')) {
                console.log(selectedAdmin.payload.login + " va devenir actif");
            } else {
                console.log(selectedAdmin.payload.login + " va devenir passif");
            }
        });
    }
}

function admin_switch_set_to(value) {
    if (($("#btn_on").hasClass('active') && value === "off") ||
            ($("#btn_off").hasClass('active') && value === "on")) {
        toggle_switch();
    }
}

function toggle_switch() {
    $(["btn_on", "btn_off"]).each(function(index, value) {
        $("#" + value).toggleClass('active');
        $("#" + value).toggleClass('btn-primary');
        $("#" + value).toggleClass('btn-default');
    });
}




// utils

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

function update_current_entity(entity_id) {
    current_entity = entity_id;
}