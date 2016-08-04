angular.module("umbraco").controller("AUMBRA.PDFPreviewerController", function ($scope, dialogService, $routeParams, $timeout) {

    var config = {
        template: "PDFRazorExample",
        label: "Preview as PDF"
    };

    $('.pdf-export').closest('.control-group.hidelabel').css({
        "margin-top": "-15px",
        "padding": "0",
        "border": "none"
    });

    var move = angular.element('.move-to-btn-row');
    var moveTo = angular.element('#move-btn-here');

    $scope.config = angular.extend(config, $scope.model.config);

    $scope.openPreview = function () {
        $scope.iframe = "";
        $timeout(function () {
            $scope.iframe = window.location.protocol + '//' + window.location.host + '/' + $routeParams.id + '?AltTemplate=PrintToPDF';
        }, 10);
        //window.open("http://www.web2pdfconvert.com/engine?curl=" + window.location.protocol + '//' + window.location.host + '/' + $routeParams.id)
    };

});