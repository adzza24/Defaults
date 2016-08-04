/* Copyright (c) 2016 Adam Anthony */
(function (ng) {

    ng.module('filters').filter('inGroupsOf', function () {
        var newArr = [];
        return function (array, groupsize) {
            if (ng.isDefined(array) && !newArr.length && array.length > groupsize) {
                var tempArr = [];
                ng.forEach(array, function (item) {
                    tempArr.push(item);
                    if (tempArr.length === groupsize) {
                        newArr.push(tempArr);
                        tempArr = [];
                    }
                });
                return array = newArr;
            }
            else {
                return newArr.length ? newArr : array;
            }
        }
    });
}(angular));