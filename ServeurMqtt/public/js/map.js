/*
 * SmartCampus
 *  ©SmartCampus 2014 https://github.com/thomasNDS/SmartCampus2014
 *  License MIT
 */

// campus boundaries
var area = {
    sw: {lat: 45.18361, lon: 5.750477},
    ne: {lat: 45.20112086, lon: 5.78054667},
    center: {lat: 45.19091427, lon: 5.76828361},
    zoom: 14
};
var map;
var IMG_DIR = "/images/";
var ICONS = {
    "Université": IMG_DIR + "school.png",
    "Ecole d'ingénieur": IMG_DIR + "school.png",
    "Ecole": IMG_DIR + "school.png",
    "Tramway": IMG_DIR + "tramway.png",
    "Tram": IMG_DIR + "tramway.png",
    "Commerce": IMG_DIR + "store.png",
    "Restaurant Universitaire": IMG_DIR + "food.png",
    "Cité Universitaire": IMG_DIR + "bed.png",
    "Laboratoire": IMG_DIR + "school.png",
    "Bibliothèque": IMG_DIR + "library.png",
    "Bar": IMG_DIR + "bar.png"
};

function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(area.center.lat, area.center.lon), // centrer sur le campus de SMH
        zoom: area.zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    // bounds of the desired area
    var allowedBounds = new google.maps.LatLngBounds(// limites du campus
            new google.maps.LatLng(area.sw.lat, area.sw.lon),
            new google.maps.LatLng(area.ne.lat, area.ne.lon)
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

    var pois = [];
    $.getJSON('/api/entity/',
            function(data) {
                var entity = 0;
                while (data.payload[entity]) {
                    if (data.payload[entity].latitude && data.payload[entity].longitude) {
                        pois.push(
                                data.payload[entity]
                                );
                    }
                    entity++;
                }
                var marker;
                console.log(pois);
                $.each(pois, function(index, value) {
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(value.latitude, value.longitude),
                        map: map,
                        title: value.name,
                        icon: ICONS[value.type]
                    });
                    google.maps.event.addListener(marker, 'click', function() {
                        buildPanel(value);
                    });

                });
            });


}
google.maps.event.addDomListener(window, 'load', initialize);
