(function (ng) {
    'use strict';
    
    var globals = function() {
        return {
            language: "",
            setLanguage: function (lang) {
                this.language = lang;
            },
            userScope:  {
                complete: false,
                errors: [],
                user: {
                    Email: "",
                    Password: "",
                    Pending: 0
                }
            }
        }
    };
    ng.module('services').factory('globalFactory', globals);
}(angular));