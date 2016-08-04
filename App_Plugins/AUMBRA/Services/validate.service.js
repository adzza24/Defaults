/* Copyright (c) 2016 Adam Anthony */
(function (ng) {
    "use strict";
    //private
    var library = {
        maxAge: 18,
        email: new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i),
        //Original: /^(?:[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*|""(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*"")@(?:(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[\w-]*[\w]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/
        password: {
            count: new RegExp(/[A-Z0-9]{6,}/i),
            alpha: new RegExp(/[A-Z]/i),
            numeric: new RegExp(/[0-9]/i),
            upper: new RegExp(/[A-Z]/),
            lower: new RegExp(/[a-z]/)
        },
        postcode: new RegExp(/[0-9]{4}/),
        searches: {
            domain: new RegExp(/@[A-Z0-9.-]+\.[A-Z]{2,}$/i)
        }
    }

    //public
    var validationService = function (settings) {
        this.config = ng.extend({}, this.defaults, settings);
    };
    validationService.prototype = {
        defaults: {
            minage: 18
        },

        checkEmail: function (email) {
            return library.email.test(email);
        },

        getDomainInclusions: function () {
            return this.ajaxService.get("/Scripts/app/data/merckDomains.js");
        },

        getDomain: function (email) {
            if (ng.isString(email)) {
                var domain = email.match(library.searches.domain);
                domain = ng.isArray(domain) ? domain[0].substr(domain[0].indexOf("@") + 1) : "";
                return domain;
            }
            return false;
        },

        checkForm: function (form) {
            
            form.$setDirty();
            var errors = [];

            ng.forEach(form, function (v, k) {
                if (k.toString().indexOf('$') == -1) {
                    if (v.$invalid) {
                        errors.push(v.$error)
                    }
                }
            });

            var valid = form.$valid;
            if (!valid && errors.length) {
                ng.forEach(form.$error, function (errType) {
                    ng.forEach(errType, function (err) {
                        err.$setDirty();
                    });
                });
            }
            else {
                valid = true;
            }
            return valid;
        },
        checkPassword: function (password) {
            var valid = true;

            ng.forEach(library.password, function (exp) {
                if (!exp.test(password)) {
                    valid = false;
                    return;
                }
            });
            return valid;
        },
        checkDob: function (date) {
            var valid = true;
            var dob = new Date(date);
            var now = new Date();

            valid = dob.getYear() < now.getYear() - this.config.minage;
            if (dob.getYear() == now.getYear() - this.config.minage) {
                valid = dob.getMonth() < now.getMonth() || (dob.getMonth() == now.getMonth() && dob.getDate() <= now.getDate());
            }
            return valid;
        }
    };

    angular.module("umbraco.services").service("AUMBRA.Services.ValidationService", [validationService]);

}(angular));