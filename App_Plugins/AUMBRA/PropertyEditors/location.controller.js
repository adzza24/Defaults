angular.module("umbraco").controller("AUMBRA.LocationController", function ($scope, assetsService) {

    assetsService.loadJs("http://www.google.com/jsapi")
    .then(function () {
        google.load("maps", "3", {
            callback: intitalize,
            other_params: "sensor=false&key=AIzaSyAjeAmB8Ljf7RoFEUtgs-ECjD1bQgti_NI&key=AIzaSyAjeAmB8Ljf7RoFEUtgs-ECjD1bQgti_NI"
        });
    });
    var marker;
    var map;
    var intitalize = function () {

        var latLng = $scope.getLtnLng();
        
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: latLng
        });

        $scope.updateMap();
        
        google.maps.event.addListener(marker, "position_changed", function (e) {
            $scope.model.value.lat = marker.getPosition().lat();
            $scope.model.value.lng = marker.getPosition().lng();
        });
    };

    

    $scope.getLtnLng = function () {
        return new google.maps.LatLng($scope.model.value.lat, $scope.model.value.lng);
    };

    $scope.updateMap = function () {
        var latLng = $scope.getLtnLng();
        marker && marker.setMap(null);
        marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: 'Hello World!',
            draggable: true
        });
        map.setCenter(latLng);
    };

});