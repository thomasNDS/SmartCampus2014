/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// Find the right method, call on correct element
function launchFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

/*
 * Gestion du plein écran
 */
function manageFullScreen(elementToFullScreened) {
    var isFullScreen = document.mozFullScreen || document.webkitIsFullScreen || document.fullScreen;
    if (isFullScreen) {
        $("#btnFullScreen").html("<i class=\"fa icon-white fa-arrows-alt logoFont\"></i>");
        exitFullscreen();
    } else {
        launchFullscreen(elementToFullScreened);
        $("#btnFullScreen").html("<i class=\"fa icon-white fa-compress logoFont\"></i>");
    }
}
