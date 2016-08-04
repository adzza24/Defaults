(function (ng) {
    angular.module("umbraco.services").service("AUMBRA.Services.MceService", ['$timeout', 'tinyMceService', function ($timeout, tinyMceService) {
        //copied these settings from line 6053 from umbraco.controllers.js (for property editors)
        //to stop and restart tinyMCE on drag start and drag stop
        this.draggedRteSettings = {};
        this.kill = function (id) {
            this.draggedRteSettings[id] = ng.isObject(this.draggedRteSettings[id]) ? this.draggedRteSettings[id] : ng.isObject(_.findWhere(tinyMCE.editors, { id: id })) && _.findWhere(tinyMCE.editors, { id: id }).settings;
            tinyMCE.execCommand("mceRemoveEditor", false, id);
        };
        this.restart = function (id) {
            // reset all RTEs affected by the dragging
            this.draggedRteSettings[id] = ng.isObject(this.draggedRteSettings[id]) ? this.draggedRteSettings[id] : ng.isObject(_.findWhere(tinyMCE.editors, { id: id })) && _.findWhere(tinyMCE.editors, { id: id }).settings;
            tinyMCE.execCommand("mceRemoveEditor", false, id);
            tinyMCE.init(this.draggedRteSettings[id]);
        };
        this.getConfig = function (optsArr) {
            var config = {
                stylesheets: ["rte"],
                entity_encoding: "named",
                toolbar: [
                    "bold",
                    "italic",
                    "link",
                    "subscript",
                    "superscript"
                ]
            };
            ng.isArray(optsArr) && (config.toolbar = config.toolbar.concat(optsArr));

            return ng.extend({}, tinyMceService.defaultPrevalues(), config);
        };
    }]);
}(angular));