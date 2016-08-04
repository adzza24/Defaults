/* Copyright (c) 2016 Adam Anthony
 * @description A utility of functions that are useful, especially when working with an Umbraco front end.
 */
(function (ng) {
    angular.module("services").service("utilService", ['$timeout', '$routeParams', '$q', '$filter', function ($timeout, $routeParams, $q, $filter) {
        
        this.getSinglePropertyList = function (list, prop) {
            var retList = [];
            if (list.length && ng.isDefined(list[0][prop])) {
                ng.forEach(list, function (item) {
                    var action = ng.isArray(item[prop]) ? "concat" : "push";
                    retList = retList[action](item[prop]);
                });
                return retList;
            }
            return false;
        };

        /**
         * @name utilServices.resetForm
         * @module services
         * @description Resets an angular form so all the fields are empty and not marked as invalid.
         * 
         * @param {object} form  An angular form object.
        **/
        this.resetForm = function (form) {
            ng.forEach(form, function (v, k) {
                if (!k.includes('$')) {
                    v.$setViewValue("");
                    v.$modelValue = "";
                    v.$setUntouched();
                    v.$setPristine();
                }
            });
        };

        /**
         * @name utilServices.await
         * @module services
         * @description Waits for a variable to exist if it
         * doesn't already. Rejects after a maximum time limit.
         * 
         * @param {*} await  The variable to wait for.
         * @param {int} max  The maximum number of loops [optional]
         * @param {int} loop  Internal value used to track iterations
         * @returns {object}  A promise
        **/
        var await_deferred = null;
        this.await = function (await, max, loop) {
            var self = this;
            loop = ng.isNumber(loop) ? ++loop : 0;
            max = ng.isNumber(max) ? max : 10;
            if (loop === 0) {
                if (await_deferred) {
                    await_deferred.reject();
                }
                await_deferred = $q.defer();
            }
            if (await) {
                $timeout(function () {
                    await_deferred.resolve();
                }, 10);
            }
            else if (loop < max) {
                //Didn't find anything
                $timeout(function () {
                    //Trying again
                    self.await(await, max, loop);
                }, 200);
            }
            else {
                //Still nothing and reached the maximum allowed loops. Rejecting.
                await_deferred.reject();
            }
            return await_deferred.promise;
        }

        /**
         * @name utilServices.getUnique
         * @module services
         * @description Gets all unique items in a list. For example:
         * [0,1,1,2,2] ==> [0,1,2]
         * 
         * @param {array} list  An array to be searched for unique items only.
         * @returns {array}  A filtered array containing only unique items from the original array
        **/
        this.getUnique = function (arr) {
            var ret = [];
            ng.forEach(arr, function (item) {
                ng.isObject(item) && (item.$$hashKey = null);
                if (!$filter('filter')(ret, item).length) {
                    ret.push(item);
                }
            });
            return ret;
        };

        /**
         * @name utilServices.stripArray
         * @module services
         * @description Reduces an array of arrays to a single level array. For example:
         * [[0,1,2], [[1,2], [3,4]]] ==> [0,1,2,1,2,3,4]
         * 
         * @param {array} arr  An array that needs to be reduced to one level deep.
         * @returns {array}  A reduced array is only one level deep with values
        **/
        this.stripArray = function (arr) {
            var cont = ng.isArray(arr[0]);
            var ret = cont ? [] : arr;
            while (cont) {
                ng.forEach(arr, function (v) {
                    ret = ret.concat(v);
                });
                if (cont = ng.isArray(ret[0])) arr = ret;
            }
            return ret;
        };
        /*
         * @name utilServices.convertToArray
         * @module services
         * @description Converts an object to an array of the values from that object. For example:
         * { firstname: "John", lastname: "Smith" } ==> ["John", "Smith"]
         * 
         * @param {object} obj  An object to be converted to an array.
         * @returns {array}  A array containing only the values from the original object
        **/
        this.convertToArray = function (obj) {
            var arr = [];
            ng.forEach(obj, function (v) {
                arr.push(v);
            });
            return arr;
        };

        /*
         * @name utilServices.convertToArray
         * @module services
         * @description Converts an object to an array of the values from that object. For example:
         * { firstname: "John", lastname: "Smith" } ==> ["John", "Smith"]
         * 
         * @param {object} obj  An object to be converted to an array.
         * @returns {array}  A array containing only the values from the original object
        **/
        this.trim = function (str, chr) {
            var rgxtrim = (!chr) ? new RegExp('^\\s+|\\s+$', 'g') : new RegExp('^' + chr + '+|' + chr + '+$', 'g');
            return str.replace(rgxtrim, '');
        };

        /*
         * @name utilServices.getCropUrl
         * @module services
         * @description Given an Umbraco ImageCropper object,
         * this will return the URL for the cropped image. For example:
         * var image = @(!string.IsNullOrEmpty(CurrentPage.CroppedImage.ToString()) ? CurrentPage.CroppedImage.ToString() : "{}");
         * utilServices.getCropUrl(image, {width:100, height: 300}) ==> "http://image.path?width=100&height=300&mode=crop";
         * 
         * @param {object} image  An Umbraco ImageCropper object.
         * @param {object} size  An object containing the width and height the image should be.
         * @returns {string}  The URL of the cropped image
        **/
        this.getCropUrl = function (image, size) {
            var url = image;
            if (image.image) {
                var url = image.image;
                if (size) {
                    url += "?width=" + size.width;
                    url += "&height=" + size.height;
                    url += "&mode=crop";
                    if (image.focalPoint) {
                        url += "&center=" + image.focalPoint.top + "," + image.focalPoint.left;
                    }
                }
            }
            return url;
        }

    }]);
}(angular));