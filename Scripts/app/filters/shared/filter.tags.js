/* Copyright (c) 2016 Adam Anthony */
(function (ng) {

    var any = false; //if true, returns items that have any tags. If false, returns only items that have all tags.

    ng.module('filters').filter('tags', function () {
        return function (array, tags) {
            if (tags !== "") {
                tags = ng.isArray(tags) ? tags : tags.split(",");
                return array.filter(function (item) {

                    if (any) {
                        for (var i in item.tags) {
                            if (tags.indexOf(item.tags[i].name) != -1) {
                                return true;
                            }
                        }
                        return false;
                    }
                    else {
                        var ret = true;
                        for (var i in tags) {
                            if (!item.tags.filter(function (t) { return t.name === tags[i] }).length) {
                                ret = false;
                            }
                        }
                        return ret;
                    }

                });
            }
            return array;
        }
    });
}(angular));