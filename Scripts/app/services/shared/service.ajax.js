/* Copyright (c) 2016 Adam Anthony */
(function (ng) {
    var ajaxService = function ($http, $q) {

        this.q = $q;
        this.deferred = this.q.defer();
        this.http = $http;
    };
    ajaxService.prototype = {

        get: function (url) {
            this.deferred = this.q.defer();
            var self = this;
            this.http.get(url)
                 .then(function (result) {
                     self.deferred.resolve(result.data);
                     ng.element(document).trigger('GetSuccess');
                 }, self.deferred.reject);
            return self.deferred.promise;
        },

        post: function (url, data, options) {
            this.deferred = this.q.defer();
            var self = this;
            this.http.post(url, data, options)
                 .then(function (result) {
                     self.deferred.resolve(result.data);
                     ng.element(document).trigger('PostSuccess');
                 }, self.deferred.reject);

            return self.deferred.promise;
        },

        jsonp: function (url, options) {
            this.deferred = this.q.defer();
            var self = this;
            this.http.jsonp(url, options)
                 .then(function (result) {
                     self.deferred.resolve(result.data);
                     ng.element(document).trigger('PostSuccess');
                 }, self.deferred.reject);

            return self.deferred.promise;
        },

        flush: function () {
            this.deferred.reject("cancelled");
        }
    };
    ng.module('services').service('ajaxService', ['$http', '$q', ajaxService]);
}(angular));