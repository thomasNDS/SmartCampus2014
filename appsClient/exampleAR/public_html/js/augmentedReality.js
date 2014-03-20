

            //Fonction en cas d'erreur
            function onFailure(err) {
                alert("The following error occured: " + err.name);
            }

            //////////////////////////
            //GESTION LECTURE MARKER//
            //////////////////////////

            //Nombre de marqueurs possibles à lire??
            threshold = 128;
            //Var booleen pour savoir si on voit un qrCode
            qrVisible = false;
            //Marqueur courant
            currentMarker = null;
            //Marqueur du panel courant
            currentPanelMarker = null;
            //APPLI//

            //Var booleen pour savoir si un panel est affiché ou non
            isPanelDisplayed = false;
            //Tableau contenant les différents éléments 
            entitiesArray = new Array();
            //Adresse du serveur web
//            serverAddress = "192.168.1.2";
            serverAddress = "localhost";
            $(window).ready(function() {

                scrollBarWidth = 0; //getScrollerWidth();
                menuHeight = $("#menu").height() + 5;
//                console.log("sc : " + scrollBarWidth);
//                console.log("menu height : " + $("#menu").height());

                ////////////////////////
                //// GESTION CAMERA ////
                ////////////////////////

                //Creation et configuration d'un element video, il sera utilise pour streamer la camera
                //L'element n'est pas affiche et est integre dans un canvas plus loin..
                var video = document.createElement('video');
//                video.width = 640;
//                video.height = 480;
//                console.log("Avt fonction" + $(document).width());
                video.width = $(document).width() - scrollBarWidth;
                video.height = $(document).height() - menuHeight;
                video.loop = true;
                video.volume = 0;
                video.autoplay = true;
                video.style.display = 'none';
                video.controls = true;
                //getUser mutliplateforme
                navigator.getUserMedia = (navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia);
                //Si getUser a marche, on le conf pour la video
                //En cas d'erreur, fonction de failure
                if (navigator.getUserMedia) {
                    navigator.getUserMedia({video: true},
                    function(localMediaStream) {
                        video.src = window.URL.createObjectURL(localMediaStream);
                    }, onFailure);
                }
                else {
                    alert('No browser Support');
                }

                //Canvas pour la detection des marqueurs
                var canvas = document.createElement('canvas');
                canvas.width = $(document).width(); // - scrollBarWidth;
                canvas.height = $(document).height(); // - menuHeight;

                //Canvas pour l'affichage de la video
                var videoCanvas = document.createElement('canvas');
                videoCanvas.setAttribute("id", "videoCanvas");
                videoCanvas.width = video.width - scrollBarWidth;
                videoCanvas.height = video.height - menuHeight;
                // Create a RGB raster (image matricielle) object for the 2D canvas.
                // JSARToolKit uses raster objects to read image data.
                var raster = new NyARRgbRaster_Canvas2D(canvas);
                // FLARParam is the thing used by FLARToolKit to set camera parameters.
                var param = new FLARParam(canvas.width, canvas.height);
                // The FLARMultiIdMarkerDetector is the actual detection engine for marker detection.
                // It detects multiple ID markers. ID markers are special markers that encode a number.
                var detector = new FLARMultiIdMarkerDetector(param, 120);
                // For tracking video set continue mode to true. In continue mode, the detector
                // tracks markers across multiple frames.
                detector.setContinueMode(true);
                //Contexte du canvas, utilise plus tard pour afficher la video
                var ctx = canvas.getContext('2d');
                //Ajout du canvas de video a la page
//                document.body.appendChild(videoCanvas);
                $("#backgroundVideo").append(videoCanvas);
                //Fonction appele a chaque interval
                setInterval(function() {

                    //Affichage image dans les deux canvas crees
                    //Affichage pour la video
                    videoCanvas.getContext('2d').drawImage(video, 0, 0, video.width, video.height);
//                    ctx.drawImage(videoCanvas, 0, 0, 320, 240);
                    //Prise de l'image du canvas pour la detection marker
                    ctx.drawImage(videoCanvas, 0, 0);
                    //Prevenir que le canvas a changer
                    canvas.changed = true;
                    //initialise avant d'entrer dans la boucle le qrvisible vu a faux
                    qrVisible = false;
                    //Creation du detecteur de marques, avec l'image matricielle et le nombre de marqueurs a detectes (surement..)
                    var detected = detector.detectMarkerLite(raster, threshold);
                    //id du marqueur lu
                    var currId;
                    // Go through the detected markers (and get their IDs and transformation matrices)
                    for (var idx = 0; idx < detected; idx++) {

                        //Si on entre dans cette boucle, c'est qu'on a lu un marqueur
                        qrVisible = true;
                        // Get the ID marker data for the current marker.
                        // ID markers are special kind of markers that encode a number.
                        // The bytes for the number are in the ID marker data.
                        var id = detector.getIdMarkerData(idx);
                        // This code handles only 32-bit numbers or shorter.
                        if (id.packetLength > 4) {
                            currId = -1;
                        } else {
                            currId = 0;
                            for (var i = 0; i < id.packetLength; i++) {
                                currId = (currId << 8) | id.getPacketData(i);
                            }
                        }
//                        console.log("[add] : ID = " + currId);
                    }

                    ////////////////////////
                    ///// INTERFACE AR /////
                    ////////////////////////

                    var isPopUpShown = $('#popUpInfos').hasClass('in');
                    var isBottomPopUpShown = $('#bottomPopUp').css("display") === 'block';
                    //Exemple de ce qu'on peut faire une fois un marqueur lu
                    //Si on a lu un marqueur on popup pour demander si on veut afficher info de l'element lu?
                    //TODO: possiblement plusieurs marqueurs lu..
                    if (qrVisible && !isPopUpShown && !isBottomPopUpShown) {
                        //Si le marker que l'on lit est différent de celui affiché on affiche le popup pour changer de panel
//                        if (getPanelFromMarker(currId) !== getPanelFromMarker(currentPanelMarker)) {
                        if (currId !== currentPanelMarker) {
                            showPopUp(currId);
                            currentMarker = currId;
                        }
                    }
                }, 15);
                /// FULL SCREEN ///
                //// TODO : Probleme avec le canvas de detection + paysage / portrait resize foireux ////
                function onResizeHandler(e) {
//                    console.log("full");
//                    var isFullScreen = document.mozFullScreen || document.webkitIsFullScreen || document.fullScreen;
//                    if (isFullScreen) {
                    menuHeight = $("#menu").height() + 5;
//                    console.log("menu height : " + $("#menu").height());

                    video.width = window.innerWidth - scrollBarWidth;
                    video.height = window.innerHeight - menuHeight;
                    videoCanvas.width = window.innerWidth - scrollBarWidth;
                    videoCanvas.height = window.innerHeight - menuHeight;
                    changeMaxHeightContentTabs();
//                    canvas.width = $(document).width();// - scrollBarWidth;
//                    canvas.height = $(document).height();

//                    console.log("larg " + window.innerWidth + "haut " + window.innerHeight);
//                    videoCanvas.getContext('2d').drawImage(video, 0, 0, window.innerWidth - scrollBarWidth, window.innerHeight - menuHeight);
//                    videoCanvas.getContext('2d').drawImage(video, 0, 0, video.width, video.height);
//                    }
                }
                window.onresize = onResizeHandler;
//                window.onfullscreenchange = onResizeHandler;
//                window.onwebkitfullscreenchange = onResizeHandler;
//                window.onmozfullscreenchange = onResizeHandler;

                //////////////////////

                function changeMaxHeightContentTabs() {
                    var height = parseInt($("#backgroundVideo").css("height"));
//                    console.log("h " + height);
                    var maxHeightContentTab = height * (65 / 100);
//                    console.log("max: " + maxHeightContentTab);
                    $("#contentTabs").css("max-height", maxHeightContentTab);
                }

            });
            /*
             * Fonction pour afficher le panneau d'information du batiment que l'on a repéré
             */
            function showInfoPanel() {
                //On enregistre le marqueur
                currentPanelMarker = currentMarker;
                //Si le panel du bas est affiché
                if ($("#bottomPopUp").css('display') === 'block') {
                    //On ferme le popUp du bas
                    closeBottomPopUp();
                }

                //On cherche l'element actuellement detecte dans le tableau via un id
                var elemDetected = entitiesArray[currentPanelMarker];
                //Construction du panel d'info en fonction de l'element
                buildPanel(elemDetected);
//                $("#informationPanel").css("display", "block");
                isPanelDisplayed = true;
            }

            /*
             * Ouverture du pop en fonction du batiment detecté
             * @returns {undefined}
             */
            function showPopUp(curMarker) {
                var elem = entitiesArray[curMarker];
                var textTitle = elem.name;
                var textBody = elem.description;
                var textType = elem.type;
                $("#popUpTitle").html(textTitle);
                $("#popUpContent").html(textType + ", voulez-vous l'afficher ?");
//                $("#popUpContent").html(textBody);
                $("#bottomPopUpDescription").html("<strong>" + textTitle + "</strong> - " + textType);
                //Si le panel centrale n'est pas affiché, popup centrale
                //Sinon popUp bottom
                if (!isPanelDisplayed) {
                    $("#popUpInfos").modal('show');
                } else {
                    showBottomPopUp();
                }

            }


            /*
             * Ferme le panel actuellement ouvert
             */
            function closePanel() {
                $("#informationPanel").css("display", "none");
                resetMarkerAndBoolean();
            }

            function resetMarkerAndBoolean() {
                currentPanelMarker = null;
                isPanelDisplayed = false;
            }

            function switchAction() {
                window.location = 'index.html';
            }

            function paramaterAction() {
//                currentMarker = 5;
//                showPopUp(currentMarker);
                getVoteValue();
            }

            function helpAction() {
//                currentMarker = 3;
//                showPopUp(currentMarker);
                voteTest();
            }

            /*
             * Afficher le popup du bas
             */
            function showBottomPopUp() {
                $("#bottomPopUp").animate({
                    height: "toggle"
                }, 600, "linear", function() {
//                    console.log("show!!");
                });
            }

            /*
             * Fermer le popup du bas
             */
            function closeBottomPopUp() {
                $("#bottomPopUp").animate({
                    height: "toggle"
                }, 500, "linear", function() {
//                    console.log("close!!");
                });
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
