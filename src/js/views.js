(function(window, $, Backbone) {
    'use strict';

    window.DBApp.module('Views', function(Views, App, Backbone, Marionette) {

        Views.SearchForm = Marionette.ItemView.extend({
            template: '#search-tpl',

            ui: {
                query: '#search-query',
                homeCountry: '#search-home-country',
                homeCity: '#search-home-city',
                workTitle: '#search-work-title',
                workCompany: '#search-work-company',
                workCountry: '#search-work-country',
                workCity: '#search-work-city',
                loginFrom: '#search-login-from',
                loginTo: '#search-login-to'
            },

            events: {
                'change input[type="text"]': 'search',
                'change select': 'search',
                'keyup input[type="text"]': function() {
                    var self = this;
                    clearTimeout(this.searchTimeout);
                    this.searchTimeout = setTimeout(function() {
                        self.search();
                    }, 500);
                }
            },

            modelEvents: {
                'change:datalists': function() {
                    this.render();
                }
            },

            searchTimeout: null,

            search: function(e) {
                clearTimeout(this.searchTimeout);

                this.model.set('query', this.ui.query.val());
                this.model.set('homeCountry', this.ui.homeCountry.val());
                this.model.set('homeCity', this.ui.homeCity.val());
                this.model.set('workCompany', this.ui.workCompany.val());
                this.model.set('workCountry', this.ui.workCountry.val());
                this.model.set('workCity', this.ui.workCity.val());
                this.model.set('loginFrom', this.ui.loginFrom.val());
                this.model.set('loginTo', this.ui.loginTo.val());
            }
        });

        Views.UserItem = Backbone.Marionette.ItemView.extend({
            template: '#item-tpl',
            id: function() {
                return 'user-' + this.model.id;
            },
            className: 'user row'
        });

        Views.UsersCollection = Backbone.Marionette.CompositeView.extend({
            template: '#grid-tpl',
            childView: Views.UserItem,
            childViewContainer: '#items-list',

            emptyView: Marionette.ItemView.extend({
                template: '#empty-tpl'
            }),

            current_page: 1,
            page_size: 10,
            last_page: 1,

            ui: {
                prev: '.prev-page',
                next: '.next-page',
                current: '.current-page'
            },

            events: {
                'click @ui.prev': function() {
                    this.showPreviousPage();
                },
                'click @ui.next': function() {
                    this.showNextPage();
                },
                'focus @ui.current': function(e) {
                    jQuery(e.currentTarget).select();
                },
                'keyup @ui.current': function(e) {
                    var self = this;
                    clearTimeout(this.showRequestedPageTimeout);
                    this.showPageTimeout = setTimeout(function() {
                        self.showPage(e.currentTarget);
                    }, 500);
                }
            },

            collectionEvents: {
                'reset': function() {
                    this.current_page = 1;
                    this.updatePages();
                },
                'add': 'updatePages',
                'remove': 'updatePages'
            },

            updatePages: function() {
                this.last_page = parseInt((this.collection.models.length / this.page_size), 10);
                if (this.collection.models.length % this.page_size || this.last_page === 0) {
                    this.last_page++;
                }
                if (this.current_page > this.last_page && this.current_page > 1) {
                    this.current_page = this.last_page - 1;
                }

                this.changePage();
            },

            showPreviousPage: function() {
                if (this.current_page > 1) {
                    this.current_page--;
                    this.changePage();
                }
            },

            showNextPage: function() {
                if (this.current_page < this.last_page) {
                    this.current_page++;
                    this.changePage();
                }
            },

            showPageTimeout: null,
            showPage: function(target) {
                var targetPage = parseInt(target.value, 10) || 1;
                if (targetPage < 1) {
                    targetPage = 1;
                }
                if (targetPage > this.last_page) {
                    targetPage = this.last_page;
                }
                this.current_page = targetPage;
                this.changePage();
                jQuery(target).select();
            },

            changePage: function() {
                this.render();
            },

            filter: function(child, index, collection) {
                var firstIndex = (this.current_page - 1) * this.page_size,
                    lastIndex = this.current_page * this.page_size;

                return (index >= firstIndex && index < lastIndex);
            },

            templateHelpers: function() {
                var self = this;
                return {
                    getCurrentPage: function() {
                        return self.current_page;
                    },
                    getLastPage: function() {
                        return self.last_page;
                    },
                    disablePrev: function() {
                        return self.current_page === 1;
                    },
                    disableNext: function() {
                        return self.current_page === self.last_page;
                    },
                    getItemsCount: function() {
                        return self.collection.models.length;
                    }
                };
            }
        });
    });
})(window, jQuery, Backbone);
