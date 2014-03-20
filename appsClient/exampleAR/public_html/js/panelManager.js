/*
 * SmartCampus
 *  ©SmartCampus 2014 https://github.com/thomasNDS/SmartCampus2014
 *  License MIT
 */

entitiesArray = new Array();
serverAddress = "localhost";

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
//            return entitiesArray;
        }
    });
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
            console.dir(data.payload[0]);
            com = data.payload[0];
        },
        error: function(err) {
            console.log(err);
        }
    });
    return com;
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

function voteTest(idEntity) {

    //recupere le vote choisis
    var vote = $('input[name="vote"]:checked').val();
//                var vote = 5;

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
        if (entitiesArray[i]._id === entityId) {
            isFound = true;
            indexEntity = i;
        }
        i++;
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
    html += "<input type = \"radio\" name = \"vote\" value = \"1\" onclick=\"activeBtn()\")\"> Quasiment pas  ";
    html += "<input type = \"radio\" name = \"vote\" value = \"2\" onclick=\"activeBtn()\"> Un peu  ";
    html += "<input type = \"radio\" name = \"vote\" value = \"3\" onclick=\"activeBtn()\"> Ca va  ";
    html += "<input type = \"radio\" name = \"vote\" value = \"4\" onclick=\"activeBtn()\"> Pas mal  ";
    html += "<input type = \"radio\" name = \"vote\" value = \"5\" onclick=\"activeBtn()\"> Abusé gros!<br/>";
    html += "<button id=\"btnVote\" type=\"button\" class=\"btn btn-primary\" onclick=\"voteTest('" + idEntity + "')\" disabled>Alerte les autres :)</button>";
    html += "</div>";

    return html;
}

function buildPanelByIndex(indexElem) {
    buildPanel(entitiesArray[indexElem]);
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
    var tabTitle = "";
    var tabContent = "";
    tabTitle = "<li class=\"active\"><a href=\"#entityDescription\" data-toggle=\"tab\">Description</a></li>";
    tabContent = "<div id=\"entityDescription\" class=\"tab-pane active\" id=\"tabbedPanDesc\">";
    tabContent += objElem.description;
//                console.log("nb cara :" + objElem.description.length);

//    console.log("idElem: " + objElem._id);
    tabContent += buildVotePanelQueue(objElem._id);
    console.log("idElem: " + objElem._id);
//    tabContent += buildVotePanelQueue(objElem._id);

    //Div pour bouton addComment
    tabContent += "<div class=\"moreBtn\"><button class=\"btn btn-primary\">Plus d'infos</button></div>";
    tabContent += "</div>";
    $("#tabsPanel").append(tabTitle);
    $("#contentTabs").append(tabContent);
    checkDescriptionHeight();
    //Onglets Items
    objElem.items.forEach(function(itemId, index) {

        var itemLoaded = loadItemById(itemId);
        if (itemLoaded) {
        tabTitle = "<li><a href=\"#tabbedPan" + index + "\" data-toggle=\"tab\">" + itemLoaded.name + "</a></li>";
        $("#tabsPanel").append(tabTitle);
        tabContent = "<div class=\"tab-pane\" id=\"tabbedPan" + index + "\">" + itemLoaded.description + "</div>";
        $("#contentTabs").append(tabContent);
        }
    });
    //Onglet Com
//    var coms = objElem.comments;
//    tabTitle = "<li><a href=\"#tabbedPan" + (objElem.items.length) + "\" data-toggle=\"tab\">Avis</a></li>";
//    $("#tabsPanel").append(tabTitle);
//    tabContent = "<div class=\"tab-pane\" id=\"tabbedPan" + (objElem.items.length) + "\">";
//    objElem.comments.forEach(function(comId) {
//        var com = loadComById(comId);
//        var date = new Date(com.date);
//        tabContent += "<div>" + date.toLocaleDateString() + " : " + com.value + "</div>";
//    });
    //Div pour bouton addComment
//                console.log("id" + objElem._id + "!!!!");
    tabContent += "<div class=\"commentBtn\"><button class=\"btn btn-primary\" onclick=\"addComment('" + objElem._id + "','aaa'" + ")\">Ajouter un commentaire</button></div>";
    tabContent += "</div>";
    $("#contentTabs").append(tabContent);

    $("#informationPanel").css("display", "block");
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
