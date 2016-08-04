/* Copyright (c) 2016 Adam Anthony */
/* Modified from the Fisher–Yates shuffle algorithm - details here: https://bost.ocks.org/mike/shuffle/ */
(function (ng) {
    ng.module('filters').filter('max', function () {
        return function (array, max) {
            return array.splice(0, max);
        }
    });
}(angular));