/* Copyright (c) 2016 Adam Anthony */
(function (ng) {

    /**
     * @ngdoc controller
     * @name Umbraco.SearchController
     * @function
     * 
     * @description
     * Controls the search functionality in the site
     *  
     */


    //from Umbraco.SearchController
    function SearchController($scope, searchService, $log, $location, navigationService, $q, entityResource, umbRequestHelper, $rootScope, eventsService, utilService, appState) {
        //from Umbraco.SearchService
        function configureMemberResult(member) {
            member.menuUrl = umbRequestHelper.getApiUrl("memberTreeBaseUrl", "GetMenu", [{ id: member.id }, { application: 'member' }]);
            member.editorPath = "member/member/edit/" + (member.key ? member.key : member.id);
            member.metaData = angular.extend(member.metaData || { Email: "" }, { treeAlias: "member" });
            member.subTitle = member.metaData.Email;
        }

        function configureMediaResult(media) {
            media.menuUrl = umbRequestHelper.getApiUrl("mediaTreeBaseUrl", "GetMenu", [{ id: media.id }, { application: 'media' }]);
            media.editorPath = "media/media/edit/" + media.id;
            media.metaData = angular.extend(media.metaData || {}, { treeAlias: "media" });
        }

        function configureContentResult(content) {
            content.menuUrl = umbRequestHelper.getApiUrl("contentTreeBaseUrl", "GetMenu", [{ id: content.id }, { application: 'content' }]);
            content.editorPath = "content/content/edit/" + content.id;
            content.metaData = angular.extend(content.metaData || { Url: "" }, { treeAlias: "content" });
            content.subTitle = content.metaData.Url;
        }

        /*#region as per umbraco */
        $scope.searchTerm = null;
        $scope.searchResults = [];
        $scope.isSearching = false;
        $scope.selectedResult = -1;


        $scope.navigateResults = function (ev) {
            //38: up 40: down, 13: enter

            switch (ev.keyCode) {
                case 38:
                    iterateResults(true);
                    break;
                case 40:
                    iterateResults(false);
                    break;
                case 13:
                    if ($scope.selectedItem) {
                        $location.path($scope.selectedItem.editorPath);
                    }
                    break;
            }
        };


        var group = undefined;
        var groupIndex = -1;
        var itemIndex = -1;
        $scope.selectedItem = undefined;


        function iterateResults(up) {
            //default group
            if (!group) {
                group = $scope.groups[0];
                groupIndex = 0;
            }

            if (up) {
                if (itemIndex === 0) {
                    if (groupIndex === 0) {
                        gotoGroup($scope.groups.length - 1, true);
                    } else {
                        gotoGroup(groupIndex - 1, true);
                    }
                } else {
                    gotoItem(itemIndex - 1);
                }
            } else {
                if (itemIndex < group.results.length - 1) {
                    gotoItem(itemIndex + 1);
                } else {
                    if (groupIndex === $scope.groups.length - 1) {
                        gotoGroup(0);
                    } else {
                        gotoGroup(groupIndex + 1);
                    }
                }
            }
        }

        function gotoGroup(index, up) {
            groupIndex = index;
            group = $scope.groups[groupIndex];

            if (up) {
                gotoItem(group.results.length - 1);
            } else {
                gotoItem(0);
            }
        }

        function gotoItem(index) {
            itemIndex = index;
            $scope.selectedItem = group.results[itemIndex];
        }

        //used to cancel any request in progress if another one needs to take it's place
        var canceler = null;
        /*#endregion */

        var sortData = function (data) {
            _.each(data, function (resultByType) {
                resultByType.type = resultByType.type === "Document" ? "content" : resultByType.type.toLowerCase();
                if (resultByType.results.length) {
                    switch (resultByType.type) {
                        case "content":
                            _.each(resultByType.results, function (item) {
                                configureContentResult(item);
                            });
                            break;
                        case "media":
                            _.each(resultByType.results, function (item) {
                                configureMediaResult(item);
                            });
                            break;
                        case "member":
                            _.each(resultByType.results, function (item) {
                                configureMemberResult(item);
                            });
                            break;
                    }
                }
                else {
                    resultByType.results = [{ name: "no results", id: -1 }];
                }
            });
            return data;
        };

        var searchAll = function (term) {
            if (!term) {
                throw "search term is required";
            }
            return utilService.getDocumentsWithZincCode(term);
        }

        $scope.clearSearch = function () {
            $scope.isSearching = false;
            eventsService.emit("app.loading", false);
            navigationService.hideSearch();
            $scope.groups = [];
            $scope.selectedItem = undefined;
            $scope.searchTerm = "";
        };

        var currentState = appState.getSectionState("currentSection");
        eventsService.on("appState.sectionState.changed", function () {
            if (currentState !== appState.getSectionState("currentSection")) {
                currentState = appState.getSectionState("currentSection")
                $scope.clearSearch();
            }
        });

        $scope.$watch("searchTerm", _.debounce(function (newVal, oldVal) {
            $scope.$apply(function () {
                if ($scope.searchTerm) {
                    if (newVal !== null && newVal !== undefined && newVal !== oldVal) {
                        $scope.isSearching = true;
                        navigationService.showSearch();
                        $scope.selectedItem = undefined;

                        //a canceler exists, so perform the cancelation operation and reset
                        if (canceler) {
                            console.log("CANCELED!");
                            canceler.resolve();
                            canceler = $q.defer();
                        }
                        else {
                            canceler = $q.defer();
                        }

                        eventsService.emit("app.loading", true);
                        entityResource.searchAll($scope.searchTerm, canceler).then(function (r) {
                            searchAll($scope.searchTerm).then(function (result) {
                                _.each(r, function (R) {
                                    add = _.filter(result, function (res) {
                                        return res.type === R.type && res.results.length && (res.results[0].id > -1);
                                    })[0] || {};
                                    if (add.results && add.results.length) {
                                        R.results = R.results.concat(add.results);
                                    }
                                });
                                r = sortData(r);
                                $scope.groups = _.filter(r, function (group) {
                                    return group.results.length > 0 && group.type === currentState && group.results[0].id > -1;
                                });
                                if (!$scope.groups.length) {
                                    $scope.groups = [{ results: [{ name: "no results", id: -1 }] }];
                                }
                                //set back to null so it can be re-created
                                eventsService.emit("app.loading", false);
                                canceler = null;
                            });
                        });
                    }
                }
                else {
                    $scope.clearSearch();
                }
            });
        }, 500));


    }
    //register it
    angular.module('umbraco').controller("Umbraco.SearchController", ['$scope', 'searchService', '$log', '$location', 'navigationService', '$q', 'entityResource', 'umbRequestHelper', '$rootScope', 'eventsService', 'AUMBRA.Services.utilService', 'appState', SearchController]);
}(angular));