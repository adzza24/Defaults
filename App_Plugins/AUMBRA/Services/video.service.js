/* Copyright (c) 2016 Adam Anthony */
(function (ng) {
    "use strict";

    //public
    var videoService = function (ajaxService, $timeout, $q) {
        this.config = ng.extend({}, this.defaults);
        this.ajaxService = ajaxService;
        this.timeout = $timeout;
        this.q = $q;
    };
    videoService.prototype = {
        defaults: {
            minage: 18
        },
        apis: {
            youtube: "",
            vimeo: "http://vimeo.com/api/oembed.json?url=",
            screen9: "//csp.screen9.com/getProperty?key=thumbnail"
            //vimeo: "http://vimeo.com/api/v2/video/%%video_id%%.json"
        },
        tests: {
            youtube: [
                new RegExp(/[_\-+*\^\£\$%a-z0-9]{11,11}/i),
                new RegExp(/youtu/)
            ],
            vimeo: [
                new RegExp(/[0-9]{9,9}/),
                new RegExp(/vimeo/),
                new RegExp(/(https?:\/\/)?(www.)?(player.)?vimeo.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/)
            ],
            screen9: [
                new RegExp(/screen9/),
                new RegExp(/[_\-a-z0-9]{12,}/i),
                new RegExp(/video\?a\=/),
                new RegExp(/video\?auth\=/)
            ]
        },
        stripUrl: function (url) {
            var test = new RegExp(/[_\-+*@\^\£\$%a-z0-9]{9,}/i);
            return test.exec(url);
        },
        setAuthCode: function () {
            window.picsearch_ajax_auth = "weJwhIrGVR8QZ8vIht4qu_ieF8CP243U1BQGeIYkR0elSZ0AuPBbzQ";
        },
        getScreen9Thumbnail: function (mediaid, fields) {
            var deferred = this.q.defer();
            ps.getMediaDetails(mediaid, { fields: fields }, function (result) {
                deferred.resolve(result);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getType: function (url) {
            var type = false;
            var self = this;
            this.timer && this.timeout.cancel(this.timer);
            this.timer = this.timeout(function () {
                ng.forEach(self.tests, function (a, t) {
                    ng.forEach(a, function (exp) {
                        if (exp.test(url)) {
                            type = t;
                        }
                    });
                });
                return type;
            }, 100);
            return this.timer;
        },
        getThumbnail: function (link, type) {
            var id = this.stripUrl(link);
            var self = this;
            switch (type) {
                case "youtube":
                    return this.timeout(function() {
                        return 'http://i2.ytimg.com/vi/' + id + '/hqdefault.jpg';
                    },1);
                    break;
                case "screen9":
                    this.setAuthCode();
                    var media = [];
                    if (window.ps) {
                        return getMedia();
                    }
                    else {
                        return this.timeout(function () {
                            if (window.ps) {
                                return getMedia();
                            }
                        }, 1000);
                    }
                    function getMedia() {
                        return self.getScreen9Thumbnail(id, ["thumbnail"]).then(function (res) {
                            console.log(res);
                        }).always(function (res) {
                            console.log(res);
                        });
                    }
                    break;
                case "vimeo":
                default:
                    return this.ajaxService.get(this.apis[type] + encodeURI(link)).then(function (resp) {
                        console.log(resp);
                        return resp.thumbnail_url_with_play_button;
                    });
            }
        }

        
    };

    angular.module("umbraco.services").service("AUMBRA.Services.VideoService", ['AUMBRA.Services.AjaxService', '$timeout', '$q', videoService]);

}(angular));