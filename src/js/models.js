(function(window, $, Backbone) {
    'use strict';

    window.DBApp.module('Models', function(Models, App, Backbone, Marionette) {

        Models.SearchForm = Backbone.Model.extend({
            defaults: {
                query: '',
                homeCountry: '',
                homeCity: '',
                workCompany: '',
                workCountry: '',
                workCity: '',
                loginFrom: '',
                loginTo: '',
                datalists: {
                    home_countries: [],
                    home_cities: [],
                    work_countries: [],
                    work_cities: []
                }
            }
        });

        Models.User = Backbone.Model.extend({});

        Models.UsersCollection = Backbone.Collection.extend({
            model: Models.User
        });
    });
})(window, jQuery, Backbone);
