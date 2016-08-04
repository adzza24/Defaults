/* Copyright (c) 2016 Adam Anthony
* @description  Directive to submit Umbraco Forms to the back end without a page reload, as well as handling validation etc
 */
(function (ng) {
    ng.module('directives').directive('contourForm', ['animService', 'validationService', '$timeout', function (animService, validationService, $timeout) {

        return {
            restrict: 'C',
            require: '^form',
            link: function ($scope, element, attrs, form) {
                window.formSucceeded = window.formSucceeded || null;
                window.formFailed = window.formFailed || null;

                $scope.options = {
                    event: "submit",
                    block: true,
                    url: "",
                    data: null,
                    msg: null,
                    errormsg: null,
                    wrapperstart: '',
                    wrapperend: '</div>'
                };

                $scope.options.url = attrs["action"];
                if ($scope.options.msg === null && ng.isString(window.formMsg)) {
                    $scope.options.msg = window.formMsg;
                }
                if ($scope.options.errormsg === null && ng.isString(window.formErrorMsg)) {
                    $scope.options.errormsg = window.formErrorMsg;
                }
                $scope.complete = false;
                $scope.error = false;
                $scope.loading = false;

                console.log($scope)


                //private
                var send = function () {
                    //had to use jQuery here as angular did something to the form hidden values that made it invalid for Umbraco
                    $.ajax({
                        type: "POST",
                        url: $scope.options.url,
                        data: $scope.options.data,
                        dataType: "jsonp",
                        error: function (resp) {
                            var html = $(resp.responseText).find('.submit-success');
                            if (!html.length) {
                                failed(resp);
                            }
                            else {
                                success(html.text());
                            }
                        },
                        success: function (resp) {
                            if (resp.Status && resp.Status != 200) {
                                failed(resp);
                            }
                            else {
                                success(resp);
                            }

                        }
                    });
                };
                var success = function (msg) {
                    $scope.complete = true;
                    $scope.error = false;
                    $scope.loading = false;
                    $scope.successMsg = $scope.options.msg || msg;
                    ng.isFunction(window.formSucceeded) && window.formSucceeded();
                    $timeout(function () {
                        $scope.$digest();
                    }, 200);
                };
                var failed = function (resp) {
                    $scope.loading = false;
                    $scope.error = true;
                    $scope.errorMsg = $scope.options.errormsg;
                    ng.isFunction(window.formFailed) && window.formFailed();
                    $timeout(function () {
                        $scope.$digest();
                    }, 100);
                };

                //public
                $scope.submitForm = function (evt) {
                    if ($scope.options.block) {
                        evt.preventDefault();
                    }
                    $scope.error = false;
                    $scope.loading = false;
                    var check = validationService.checkForm($scope.contourForm);
                    if (check) {
                        $scope.options.data = element.serialize();
                        $scope.loading = true;
                        send();
                    }
                    else {
                        $scope.error = true;
                        $scope.loading = false;
                        $scope.errorMsg = $scope.options.errormsg;
                    }
                    console.log($scope)
                };
            }
        };

    }]);
}(angular));