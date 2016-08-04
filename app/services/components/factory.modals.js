/* Copyright (c) 2016 Adam Anthony
 * @description A factory that provides all the functions necessary to open and close modal windows, and keep track of them all.
 */
(function (ng) {
    ng.module('services').factory('modalFactory', ['$timeout', '$location', '$rootScope', 'animService', function ($timeout, $location, $rootScope, animService) {

        return {
            bindings: [], //callback bindings stored here for later later destruction
            closeQueue: [], //queued functions to be called upon close are stored here
            body: $rootScope.body || ng.element('header, main, footer'), //body elements of the application used in blurring animation if used

            //object to keep track of the modal state
            modal: {
                open: false,
                current: ""
            },

            //config object for managing configurable options
            config: {
                blur: false //set to true to include a blur animation on the body when a modal opens
            },

            /**
             * @name  modalFactory.open
             * @module  services
             * @description  Opens a modal window (a pop-up) and queues any callbacks to be called when the window closes
             * 
             * @param {string} modal  The name of the modal window to be opened.
             * @param {function} callback  A function to be called when this window closes [optional]
            **/
            open: function (modal, callback) {
                this.modal.current = modal;
                this.modal.open = true;
                this.updateAll();
                //animate the body blur-in
                this.config.blur && animService.blurIn(this.body);

                ng.isFunction(callback) && this.closeQueue.push(callback)

            },
            /**
             * @name  modalFactory.close
             * @module  services
             * @description  Closes a modal window (a pop-up) and triggers any callbacks that are queued in the closeQueue
            **/
            close: function () {
                this.open("");
                this.modal.open = false;
                this.updateAll();
                //animate the body blur-out
                this.config.blur && animService.blurOut(this.body);

                this.closeQueue.forEach(function (callback) {
                    callback();
                });
                this.closeQueue = [];

            },
            /**
             * @description  Stores a function in the bindings array which can be called at a later time.
             * All hooks get called on open and close of any modal.
             * Removal of the hook must be controlled from within the hook itself
             * 
             * @example
             * var callback = function (modal) {
             *      //do some stuff when the modal is updated
             * };
             * var hook = modalFactory.addHook(function (modal) {
                    modalFactory.deleteHook(hook);
                    callback(modal);
                });
             * 
             * @param {function} callback  A function to be called when this window closes [optional]
             * @returns {int}  The ID of the item in the queue, so it can be used later to retrieve the item
            **/
            addHook: function (callback) {
                var id = this.bindings.length ? this.bindings[this.bindings.length - 1].id + 11 : this.bindings.length + 1;
                this.bindings.push({
                    id: id,
                    action: callback
                });
                return id;
            },
            deleteHook: function (id) {
                this.bindings = this.bindings.filter(function (bind) {
                    return bind.id !== id;
                });
            },
            updateAll: function () {
                var self = this;
                this.bindings.forEach(function (binding) {
                    binding.action(self.modal);
                });
                this.digest();
            },
            update: function (id) {
                this.bindings.filter(function () {
                    return bind.id !== id;
                })[0].action(self.modal);
                this.digest();
            },
            digest: function () {
                $timeout(function () {
                    $rootScope.$digest();
                }, 10);
            }
        }
    }]);
}(angular));
