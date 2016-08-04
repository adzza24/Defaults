/* Copyright (c) 2016 Adam Anthony */
/* Modified from the Fisher–Yates shuffle algorithm - details here: https://bost.ocks.org/mike/shuffle/ */
(function (ng) {
    ng.module('filters').filter('shuffle', function () {
        return function (array) {
            return _.shuffle(array);
        }
    });
}(angular));