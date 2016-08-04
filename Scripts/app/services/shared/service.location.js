/* Copyright (c) 2016 Adam Anthony */
(function (ng) {
    var locationService = function ($location, $rootScope, $timeout, $sce) {

        //private
        var self = this;
        this.timer = null;
        this.loaded = [];

        this.setActiveClass = function (cls) {
            this.activeClass = cls;
        }
        this.setUrlStructure = function (prefix, suffix) {
            this.url = {
                template: prefix + '##url##' + suffix,
                prefix: prefix.replace('\?','\\?'),
                suffix: suffix.replace('\?','\\?')
            }
        }
        this.setActiveClass("active");
        this.setUrlStructure("", "?AltTemplate=SpecialismPartial")
        this.currentElem = ng.element('[data-url').first();

        this.createUrl = function (url) {
            url = url.replace(this.url.suffix, "").replace(this.url.prefix, "");
            return $sce.trustAsResourceUrl(this.url.template.replace('##url##', url));
        }

        this.updateView = function (url) {
            this.currentElem = ng.element('[data-url="' + url + '"]').closest('li').addBack();
        }

        this.set = function (url, $scope) {
            var prev = this.get();
            var force = false;
            if (!ng.isString(url)) {
                url = prev;
                force = true;
            }
            
            $scope.currentPage = url.length ? this.createUrl(url) : "";
            if ($scope.currentPage !== "" && (url !== prev || force)) {
                //clear and set a timeout incase the page never loads
                this.timer && $timeout.cancel(this.timer);
                this.timer = $timeout(function () {
                    $scope.currentPageError = "Sorry, looks this page could not be found.";
                    $timeout(function () {
                        self.set(null, $scope)
                    }, 3000);
                }, 2000);
                //unbind function is returned by $on, so we store them in an array to unload later
                this.loaded.push($scope.$on("PartialLoaded", function (e) {
                    self.timer && $timeout.cancel(self.timer);
                    $scope.currentPageError = false;
                    var unload = self.loaded.pop();
                    unload();
                    
                }));
            }
            this.updateView(url);
            $location.search("page", "null");
            $location.search("page", url);
            
            return $timeout(function () {
                $rootScope.$digest();
            }, 10);
        }

        this.get = function () {
            var qs = $location.search();
            return qs.page || "";
        }
        this.bindChange = function (callback) {
            $rootScope.$on('$locationChangeSuccess', function () {
                var url = self.get();
                callback && callback(url);
            });
        }
    };
    ng.module('services').service('locationService', ['$location', '$rootScope', '$timeout', '$sce', locationService]);
}(angular));