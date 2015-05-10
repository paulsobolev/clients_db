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

        Models.FilteredCollection = function(original, searchModel) {
            var filtered = new original.constructor();

            filtered._callbacks = {};

            filtered._model = searchModel;
            filtered.listenTo(filtered._model, 'change', function() {
                if (!this._model.hasChanged('datalists')) {
                    filtered.search();
                }
            });

            filtered.updateDatalists = function(items) {
                var datalists = {
                    home_countries: [],
                    home_cities: [],
                    work_countries: [],
                    work_cities: []
                };

                for (var i = 0; i < items.length; i++) {
                    var item = items[i],
                        home_country = item.attributes.home.country,
                        home_city = item.attributes.home.city,
                        work_country = item.attributes.work.country,
                        work_city = item.attributes.work.city;

                    if (this._model.get('homeCountry')) {
                        if (datalists.home_cities.indexOf(home_city) === -1) {
                            datalists.home_cities.push(home_city);
                        }
                    }

                    if (this._model.get('workCountry')) {
                        if (datalists.work_cities.indexOf(work_city) === -1) {
                            datalists.work_cities.push(work_city);
                        }
                    }
                }

                for (var j = 0; j < original.models.length; j++) {
                    var origItem = original.models[j],
                        hCountry = origItem.attributes.home.country,
                        wCountry = origItem.attributes.work.country;

                    if (datalists.home_countries.indexOf(hCountry) === -1) {
                        datalists.home_countries.push(hCountry);
                    }

                    if (datalists.work_countries.indexOf(wCountry) === -1) {
                        datalists.work_countries.push(wCountry);
                    }
                }

                datalists.home_countries.sort();
                datalists.home_cities.sort();
                datalists.work_countries.sort();
                datalists.work_cities.sort();

                this._model.set('datalists', datalists);
            };

            filtered.search = function() {
                var items,

                    hasToSearch = (this._model.get('query') ||
                        this._model.get('homeCountry') ||
                        this._model.get('homeCity') ||
                        this._model.get('workCompany') ||
                        this._model.get('workCountry') ||
                        this._model.get('workCity') ||
                        this._model.get('loginFrom') ||
                        this._model.get('loginTo')
                    );

                if (hasToSearch) {
                    var criteria = this._model.attributes;

                    items = original.filter(function(model) {
                        var matches = [];

                        if (criteria.query) {
                            var qreg = new RegExp(criteria.query, 'i');
                            matches.push(qreg.test(model.get('first_name')) || qreg.test(model.get('last_name')) ||
                                qreg.test(model.get('email')));
                        }

                        var model_home = model.get('home');

                        if (criteria.homeCountry) {
                            var hreg1 = new RegExp(criteria.homeCountry, 'i');
                            matches.push(hreg1.test(model_home.country));

                            if (criteria.homeCity) {
                                var hreg2 = new RegExp(criteria.homeCity, 'i');
                                matches.push(hreg2.test(model_home.city));
                            }
                        }

                        var model_work = model.get('work');

                        if (criteria.workCompany) {
                            var wreg1 = new RegExp(criteria.workCompany, 'i');
                            matches.push(wreg1.test(model_work.company));
                        }


                        if (criteria.workCountry) {
                            var wreg2 = new RegExp(criteria.workCountry, 'i');
                            matches.push(wreg2.test(model_work.country));

                            if (criteria.workCity) {
                                var wreg3 = new RegExp(criteria.workCity, 'i');
                                matches.push(wreg3.test(model_work.city));
                            }
                        }

                        var login_date = model.get('system').last_login_date;

                        if (criteria.loginFrom) {
                            matches.push(new Date(criteria.loginFrom) <= new Date(login_date));
                        }

                        if (criteria.loginTo) {
                            matches.push(new Date(criteria.loginTo) >= new Date(login_date));
                        }

                        return (matches.length && matches.indexOf(false) === -1);
                    });
                } else {
                    items = original.models;
                }

                this.updateDatalists(items);

                this.reset(items);
            };

            original.on("reset", function() {
                filtered.search();
            });

            return filtered;
        };
    });
})(window, jQuery, Backbone);
