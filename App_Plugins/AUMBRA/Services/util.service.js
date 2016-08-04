(function (ng) {
    angular.module("umbraco.services").service("AUMBRA.Services.utilService", ['$timeout', 'tinyMceService', 'dialogService', 'iconHelper', 'entityResource', 'contentResource', '$routeParams', '$q', '$filter', function ($timeout, tinyMceService, dialogService, iconHelper, entityResource, contentResource, $routeParams, $q, $filter) {
        //copied these settings from line 6053 from umbraco.controllers.js (for property editors)
        //to stop and restart tinyMCE on drag start and drag stop
        this.searchForNode = function (query, id) {
            var rootId = $routeParams.id;
            var promise = $q.defer();
            if (ng.isString(query)) {
                entityResource.getByQuery(query, rootId, "Document").then(function (ent) {
                    promise.resolve(ent.id);
                });
            }
            else {
                $timeout(function () {
                    if (ng.isNumber(query) && ng.isUndefined(id)) {
                        promise.resolve(query);
                    }
                    else {
                        promise.resolve(ng.isNumber(id) ? id : rootId);
                    }
                }, 10);
            }
            return promise.promise;
        };
        this.storedReferences = [];
        this.storeReference = function (ref) {
            this.storedReferences.push(ref);
            return this.storedReferences.length - 1;
        }
        this.splitObj = function (obj1, obj2) {
            return [obj1, obj2];
        }

        this.getAll = function (type) {
            var self = this;
            return entityResource.getAll(type).then(function (ents) {
                return self.exposeProps(ents);
            });
        };

        this.getContentById = function (id) {
            var self = this;
            var ids = ng.isArray(id) ? id : [id];

            return contentResource.getByIds(ids).then(function (pages) {
                return self.exposeProps(pages);
            });
        };

        this.getContentPages = function () {
            return this.getDocumentsOfType([
                "TreatmentPage",
                "ContentPage",
                "TreatmentSubPage"
            ]);
        };
        this.getModulePages = function () {
            return this.getDocumentsOfType("Module");
        };

        this.getDocumentsOfType = function (DocTypes) {
            var self = this;
            return this.getDocumentsWithProperty("ContentTypeAlias", DocTypes);
        };

        this.getDocumentsWithProperty = function (prop, value) {
            var self = this;
            return this.getAll("DOCUMENT").then(function (ents) {
                var ids = self.filterContent(ents, prop, value);
                ids = self.getSinglePropertyList(ids, 'id');
                return self.getContentById(ids);
            });
        };

        this.getDocumentsWithZincCode = function (zincCode) {
            var self = this;
            return this.getModulePages().then(function (ents) {
                var data = self.filterContent(ents, 'zincCode', zincCode);
                return [{
                    type: "Document",
                    results: data
                }];
            });
        };

        this.getSinglePropertyList = function (list, prop) {
            var retList = [];
            _.each(list, function (item) {
                retList.push(item[prop]);
            });
            return retList;
        };

        this.filterContent = function (content, filterProp, filterVal) {
            var ids = [];
            var filter = {};
            filterVal = ng.isArray(filterVal) ? filterVal : [filterVal];
            _.each(filterVal, function (val) {
                filter[filterProp] = val;
                ids = ids.concat($filter('filter')(content, filter));
            });
            
            return ids;
        };

        this.stripArray = function (arr) {
            var cont = ng.isArray(arr[0]);
            var ret = cont ? [] : arr;
            while (cont) {
                _.each(arr, function (v) {
                    ret = ret.concat(v);
                });
                if (cont = ng.isArray(ret[0])) arr = ret;
            }
            return ret;
        };

        this.exposeProps = function (pages) {
            pages = ng.isArray(pages) ? pages : [pages];
            _.each(pages, function (page) {
                var tabs = page.tabs ? page.tabs : [page];
                _.each(tabs, function (tab) {
                    _.each(tab.properties, function (prop) {
                        page[prop.alias] = page[prop.alias] || prop.value;
                    });
                });
                _.each(page.metaData, function (value, key) {
                    page[key] = value;
                });
            });
            return pages;
        };

        this.findGrid = function (page) {
            var grid = [];
            if (page.pageGrid) {
                _.each(page.pageGrid.sections, function (section) {
                    _.each(section.rows, function (row) {
                        _.each(row.areas, function (area) {
                            _.each(area.controls, function (control) {
                                grid.push(control);
                            });
                        });
                    });
                });
            }
            return grid;
        };

        this.searchForSyncCode = function (query, id) {
            var rootId = $routeParams.id;
            var promise = $q.defer();
            if (ng.isString(query)) {
                entityResource.getByQuery(query, rootId, "Document").then(function (ent) {
                    promise.resolve(ent.id);
                });
            }
            else {
                $timeout(function () {
                    if (ng.isNumber(query) && ng.isUndefined(id)) {
                        promise.resolve(query);
                    }
                    else {
                        promise.resolve(ng.isNumber(id) ? id : rootId);
                    }
                }, 10);
            }
            return promise.promise;
        };

        this.sortContentNode = function (item) {
            if (item.tabs) {
                _.each(item.tabs, function (tab) {
                    item[tab.alias] = {};
                    _.each(tab.properties, function (prop) {
                        item[tab.alias][prop.alias] = {
                            type: prop.view,
                            value: prop.value
                        }
                    });
                });
                if (item.Preview && item.Preview.previewImage.value !== "") {
                    item.img = item.Preview.previewImage.value;
                }
                else if (item.Hero) {
                    item.img = item.Hero.heroImage.value;
                }
            }
            return item;
        };

        this.trim = function (str, chr) {
            var rgxtrim = (!chr) ? new RegExp('^\\s+|\\s+$', 'g') : new RegExp('^' + chr + '+|' + chr + '+$', 'g');
            return str.replace(rgxtrim, '');
        };

        this.unsubscribe = function ($scope, callback) {
            $scope.$on('$destroy', function () {
                $scope.$on("formSubmitting", function (ev, args) {
                    callback(ev, args);
                });
            });
        };

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