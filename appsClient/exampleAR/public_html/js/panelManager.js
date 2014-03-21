/*
 * SmartCampus
 *  ©SmartCampus 2014 https://github.com/thomasNDS/SmartCampus2014
 *  License MIT
 */

entitiesArray = new Array();
<<<<<<< HEAD
serverAddress = "localhost";
=======
//serverAddress = "localhost";
>>>>>>> 612222d6934b115e60e72f9cb41852fbacbe2e51
//serverAddress = "192.168.43.142";
//Var pour les index des onglets
indexTab = 0;

/// ==== LOADERS ==== ////

/*
 * Fonction pour charger le tableau des elements
 */
function loadEntities() {
//    var entitiesArray = new Array();
    var entities;
    //Requete pour get toutes les entités de la BD
    jQuery.ajax({
        type: 'GET',
        async: false,
        url: "http://" + serverAddress + ":4242/api/entity",
        success: function(data) {
            console.dir(data);
            entities = data;

            //On les stocke dans un tableau
            for (var i = 0; i < entities.payload.length; i++) {
                entitiesArray[i] = entities.payload[i];
            }
            sortEntityArray();
//            return entitiesArray;
        }
    });
}

/*
 * Fonction pour arranger le tableau d'entites a notre sauce
 * @returns {undefined}
 */
function sortEntityArray() {
    var arraySorted = new Array();
    var entityIndex = null;
    var entity = null;

    //UPMF -> 0
    entityIndex = getIndexElementByName("UPMF");
    entity = entitiesArray[entityIndex];
    arraySorted[0] = entity;
    arrayUnset(entitiesArray, entity);

    //Polytech Grenoble -> 4
    entityIndex = getIndexElementByName("Polytech Grenoble");
    entity = entitiesArray[entityIndex];
    arraySorted[4] = entity;
    arrayUnset(entitiesArray, entity);

    //IAE -> 8
    entityIndex = getIndexElementByName("IAE");
    entity = entitiesArray[entityIndex];
    arraySorted[8] = entity;
    arrayUnset(entitiesArray, entity);

    //Université Stendhal -> 12
    entityIndex = getIndexElementByName("Université Stendhal");
    entity = entitiesArray[entityIndex];
    arraySorted[12] = entity;
    arrayUnset(entitiesArray, entity);

    //BIBLIOTHEQUES UNIVERSITAIRES -> 16
    entityIndex = getIndexElementByName("BIBLIOTHEQUES UNIVERSITAIRES");
    entity = entitiesArray[entityIndex];
    arraySorted[16] = entity;
    arrayUnset(entitiesArray, entity);

    //CONDILLAC UNIVERSITAIRES -> 20
    entityIndex = getIndexElementByName("CONDILLAC UNIVERSITAIRES");
    entity = entitiesArray[entityIndex];
    arraySorted[20] = entity;
    arrayUnset(entitiesArray, entity);

    entitiesArray = arraySorted;

}

/*
 * Retourne l'index d'un element dans le tableau entitesArray
 * @param {type} name
 * @returns {Number}
 */
function getIndexElementByName(name) {
    var found = false;
    var i = 0;
    while (i < entitiesArray.length && !found) {
        if (entitiesArray[i].name === name) {
            found = true;
        } else {
            i++;
        }
    }
    return i;
}

/*
 * Fonction pour enlever un element d'un tableau
 * @param {type} array
 * @param {type} value
 * @returns {undefined}
 */
function arrayUnset(array, value) {
    array.splice(array.indexOf(value), 1);
}

/*
 * Fonction pour charger le tableau des elements
 */
function loadEntitiesCallback(callback) {
    var entitiesArray = new Array();
    var entities;
    //Requete pour get toutes les entités de la BD
    jQuery.ajax({
        type: 'GET',
        async: false,
        url: "http://" + serverAddress + ":4242/api/entity",
        success: function(data) {
            console.dir(data);
            entities = data;

            //On les stocke dans un tableau
            for (var i = 0; i < entities.payload.length; i++) {
                entitiesArray[i] = entities.payload[i];
            }
            console.log("tab otenu");
            console.dir(entitiesArray);
            callback(entitiesArray);
        }
    });
}

/*
 * Charger les items d'une entite
 * @param {type} entity
 * @returns {loadItemsOfEntity.items}
 */
function loadItemsOfEntity(entity) {
    var items;
    entity.items.forEach(function(item) {
        items.push(loadItemById(item.id));
    });
    return items;
}

/*
 * Charge les elements d'un item (Requete)
 * @param {type} objElem
 * @returns {undefined}
 */
function loadItemById(id) {
    var item;
    jQuery.ajax({
        type: 'GET',
        async: false,
        url: "http://" + serverAddress + ":4242/api/item/" + id,
        success: function(data) {
            console.dir(data.payload[0]);
            item = data.payload[0];
        }
    });
    return item;
}

/*
 * Charge un commentaire à partir de son id
 * @param {type} id
 * @returns {unresolved}
 */
function loadComById(id) {
    var com;
    jQuery.ajax({
        type: 'GET',
        async: false,
        url: "http://" + serverAddress + ":4242/api/comment/" + id,
        success: function(data) {
//            console.dir(data.payload[0]);
            com = data.payload[0];
        },
        error: function(err) {
            console.log(err);
        }
    });
    return com;
}

/*
 * Charge un sensor à partir de son id
 * @param {type} id
 * @returns {unresolved}
 */
function loadSensorById(id) {
    var sensor;
    jQuery.ajax({
        type: 'GET',
        async: false,
        url: "http://" + serverAddress + ":4242/api/sensors_data/" + id,
        success: function(data) {
            console.dir(data.payload[0]);
            sensor = data.payload[0];
        },
        error: function(err) {
            console.log(err);
        }
    });
    return sensor;
}

/*
 * Charge un sensor à partir de son id
 * @param {type} id
 * @returns {unresolved}
 */
function loadMesureById(id) {
    var mesure;
    jQuery.ajax({
        type: 'GET',
        async: false,
        url: "http://" + serverAddress + ":4242/api/mesure/" + id,
        success: function(data) {
            console.dir(data.payload[0]);
            mesure = data.payload[0];
        },
        error: function(err) {
            console.log(err);
        }
    });
    return mesure;
}


/// ==== PANEL ==== ////

/*
 * Ajout d'un commentaire 'comment' à un entite d'id 'entityId'
 * @param {type} objElem
 * @returns {undefined}
 */
function addComment(entityId, comment) {
    console.log(entityId, comment);
    var com;
    jQuery.ajax({
        type: 'POST',
        async: false,
        data: {
            entityId: entityId,
            commentValue: comment
        },
        url: "http://" + serverAddress + ":4242/add_comment",
        success: function(data) {
            console.log("Comment created" + data);
        },
        error: function(err) {
            console.log("Loupé :P");
            console.log(err);
        }
    });
    refreshEntity(entityId);
    return com;
}

function makeVote(idEntity) {

    //recupere le vote choisis
    var vote = $('input[name="vote"]:checked').val();

    console.log("vote = " + vote);
    jQuery.ajax({
        type: 'POST',
        async: false,
        data: {
            value: vote,
            idEntity: idEntity
        },
        url: "http://" + serverAddress + ":4242/vote/vote_ru2",
        success: function(data) {
//            console.log("vote effectué\n" + data);
        },
        error: function(err) {
            console.log(er);
        }
    });

    //Met a jour la moyenne
    $("#avgVote").html(getVoteValue(idEntity));
}

function getVoteValue(idEntity) {
    var vote = 0;
    jQuery.ajax({
        type: 'POST',
        async: false,
        url: "http://" + serverAddress + ":4242/vote/moyenne_ru",
        data: {
            idEntity: idEntity
        },
        success: function(data) {
//            console.log("vote récupéré = " + data);
            vote = data;
        },
        error: function(err) {
            console.log("erreur dans la recup");
            console.log(err);
        }
    });
    return vote;
}

function checkDescriptionHeight() {
//    console.log($("#entityDescription").css("height"));
}

function activeBtn() {
    $("#btnVote").attr("disabled", false);
}

/*
 * Fonction pour mettre à jour une entité d'id "entityId"
 * @param {type} objElem
 * @returns {undefined}
 */
function refreshEntity(entityId) {
    var i = 0;
    var isFound = false;
    var indexEntity;
    //Recupere l'index de l'entite dans le tableau
    while (i < entitiesArray.length && !isFound) {
        console.log("boucle " + i);
        if (entitiesArray[i]._id === entityId) {
            isFound = true;
            indexEntity = i;
        }
        i = i + 4;
    }
    //Mise a jour de l'entite dans le tableau
    jQuery.ajax({
        type: 'GET',
        async: false,
        url: "http://" + serverAddress + ":4242/api/entity/" + entityId,
        success: function(data) {
            console.dir(data);
            entitiesArray[indexEntity] = data.payload[0];
        }
    });
    //Rebuild du panel pour mettre à jour l'item commentaire
    //@TODO : Optimiser (rechargement d'un seul item)
    buildPanel(entitiesArray[indexEntity]);
}

/*
 * Ferme le panel actuellement ouvert
 */
function closePanel() {
    $("#informationPanel").css("display", "none");
}

/*
 * Fonction appelé lors de la construction du panel de vote, type Queue
 * @param {type} objElem
 * @returns {undefined}
 */
function buildVotePanelQueue(idEntity) {
    var avg = getVoteValue(idEntity);
    var txtActualAvg = "Estimation queue";
    var html = "<div id=\"votePanel\">";
    html += "<div>" + txtActualAvg + " : <span id=\"avgVote\">" + avg + "</span></div>";
    html += "<input type = \"radio\" name = \"vote\" value = \"1\" onclick=\"activeBtn()\")\"> Un peu  ";
    html += "<input type = \"radio\" name = \"vote\" value = \"2\" onclick=\"activeBtn()\"> Moyen  ";
    html += "<input type = \"radio\" name = \"vote\" value = \"3\" onclick=\"activeBtn()\"> Beaucoup  ";
    html += "<button id=\"btnVote\" type=\"button\" class=\"btn btn-primary\" onclick=\"makeVote('" + idEntity + "')\" disabled>Alerte les autres :)</button>";
    html += "</div>";

    return html;
}

function buildPanelByIndex(indexElem) {
    buildPanel(entitiesArray[indexElem]);
}

/**
 * Build un onglet du panel d'information
 * @param {type} title : Titre de l'onglet
 * @param {type} content : Contenu
 * @param {type} i : index de l'onglet
 * @returns {undefined}
 */
function buildTab(title, content, i) {
    (function(index) {
        var tabContent = "";
        var tabTitle = "";
        if (index !== 0) {
            tabTitle = "<li><a href=\"#tabPan" + index + "\" data-toggle=\"tab\">" + title + "</a></li>";
            tabContent = "<div id=\"tabPan" + index + "\" class=\"tab-pane\">";
        } else {
            tabTitle = "<li class=\"active\"><a href=\"#tabPan" + index + "\" data-toggle=\"tab\">" + title + "</a></li>";
            tabContent = "<div id=\"tabPan" + index + "\" class=\"tab-pane active\">";
        }
        tabContent += content;
        tabContent += "</div>";
        $("#tabsPanel").append(tabTitle);
        $("#contentTabs").append(tabContent);
//        index++;
    })(i);
    indexTab++;
}

/*
 * Chargement d'un objet représentant l'element detecté
 */
function buildPanel(objElem) {
    console.log(objElem);

    /* Clean le panel */
    cleanChildOfNodeID("tabsPanel");
    cleanChildOfNodeID("contentTabs");

    //Titre du panel info
    $("#informationTitle").html(objElem.name);

    //Onglet Description
    var descriptionContent = objElem.description;
    if (objElem.typeCrowdsourcing === "queue") {
        descriptionContent += buildVotePanelQueue(objElem._id);
    }
    descriptionContent += "<div class=\"moreBtn\"><button class=\"btn btn-primary\">Plus d'infos</button></div>";

    buildTab("Description", descriptionContent, indexTab);

    //Onglets Items
    objElem.items.forEach(function(itemId) {
        var itemLoaded = loadItemById(itemId);

        if (itemLoaded.show !== false) {
            var itemContent = itemLoaded.description;
            if (itemLoaded.Sensors_data.length > 0) {
                itemContent += "<div id=\"sensorsDiv\">Capteurs : <br>";
                itemContent += "<div>";
                //Sensors
                itemLoaded.Sensors_data.forEach(function(sensorId) {
                    var sensorLoaded = loadSensorById(sensorId);
                    var mesure = loadMesureById(sensorLoaded.mesure[0]);
                    itemContent += sensorLoaded.type + " : " + mesure.value + "<br>";
                });
                itemContent += "</div>";
                itemContent += "</div>";
            }
            buildTab(itemLoaded.name, itemContent, indexTab);
        }
    });

    //Onglet Com
    var commentContent = "";
    objElem.comments.forEach(function(comId) {
        var com = loadComById(comId);
        var date = new Date(com.date);
        commentContent += "<div>" + date.toLocaleDateString() + " : " + com.value + "</div>";
    });
    commentContent += "<div class=\"commentBtn\"><button class=\"btn btn-primary\" onclick=\"addComment('" + objElem._id + "','aaa'" + ")\">Ajouter un commentaire</button></div>";
    commentContent += "</div>";
    buildTab("Avis", commentContent, indexTab);

    $("#informationPanel").css("display", "block");
    indexTab = 0;
}

/**
 * Fonction à appeler pour build le panneau d'information vide
 * A appeler au début
 * @param {type} htmlNodeToAppend
 * @returns {undefined}
 */
function buildEmptyPanel(htmlNodeToAppend) {
//    console.log("Construction Panel vide a : " + htmlNodeToAppend);
    var panel = "<div id=\"informationPanel\">" +
            "<div class=\"titlePanel\">" +
            "<h3 id=\"informationTitle\"></h3>" +
            "<button class=\"btn btn-primary\" onclick=\"closePanel()\">x</button>" +
            "</div>" +
            "<div class=\"tabbable tabs-left\">" +
            "<ul id=\"tabsPanel\" class=\"nav nav-tabs\">" +
            "</ul>" +
            "<div id=\"contentTabs\" class=\"tab-content\"></div>" +
            "</div>" +
            "</div>";
    $(htmlNodeToAppend).append(panel);
}

/*
 * Enleve les child d'un node
 */
function cleanChildOfNodeID(parentNode) {
    var myNode = document.getElementById(parentNode);
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

function showModalParameters(htmlNodeToAppend) {
    var modalParam = "<div id=\"popParam\" class=\"modal hide fade\">" +
            "<div class=\"modal-header\"> <a class=\"close\" data-dismiss=\"modal\">×</a>" +
            "<h3 style=\"text-align:center\">Paramètres</h3>" +
            "</div>" +
            "<div id=\"popUpContent\" class=\"modal-body\">" +
            "Voulez-vous l'afficher ?" +
            "</div>" +
            "</div>";
    $(htmlNodeToAppend).append(modalParam);
//                $("#popParam").modal('show');                
}
