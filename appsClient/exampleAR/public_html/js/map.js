/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//var map = L.map('map').setView([45.19091427, 5.76828361], 14);
//L.tileLayer('http://{s}.tile.cloudmade.com/ec5901144ac74caeb0bf17aeaeea442f/997/256/{z}/{x}/{y}.png', {
//    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
//    maxZoom: 18
//}).addTo(map);
//// add a marker
//var marker = L.marker([45.19, 5.77]).addTo(map);

function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(45.19091427, 5.76828361), // centrer sur le campus de SMH
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);

    // bounds of the desired area
    var allowedBounds = new google.maps.LatLngBounds(// limites du campus
            new google.maps.LatLng(45.18575736, 5.75114965),
            new google.maps.LatLng(45.20112086, 5.78054667)
            );
    var boundLimits = {
        maxLat: allowedBounds.getNorthEast().lat(),
        maxLng: allowedBounds.getNorthEast().lng(),
        minLat: allowedBounds.getSouthWest().lat(),
        minLng: allowedBounds.getSouthWest().lng()
    };

    var lastValidCenter = map.getCenter();
    var newLat, newLng;
    google.maps.event.addListener(map, 'center_changed', function() {
        center = map.getCenter();
        if (allowedBounds.contains(center)) {
            // still within valid bounds, so save the last valid position
            lastValidCenter = map.getCenter();
            return;
        }
        newLat = lastValidCenter.lat();
        newLng = lastValidCenter.lng();
        if (center.lng() > boundLimits.minLng && center.lng() < boundLimits.maxLng) {
            newLng = center.lng();
        }
        if (center.lat() > boundLimits.minLat && center.lat() < boundLimits.maxLat) {
            newLat = center.lat();
        }
        map.panTo(new google.maps.LatLng(newLat, newLng));
    });


    var latLng = new google.maps.LatLng(45.187778, 5.726945);

    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: "titre"
                //icon     : "marker.gif"
    });
    marker.setMap(map);

    var infoWindow = new google.maps.InfoWindow({
        content: 'infobulle',
        position: latLng
    });
    infoWindow.setMap(map);
}
google.maps.event.addDomListener(window, 'load', initialize);

