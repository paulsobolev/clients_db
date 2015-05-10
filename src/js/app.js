(function(window, $, Backbone) {

    'use strict';

    window.DBApp = new Backbone.Marionette.Application();

    var DBAppRouter = Backbone.Marionette.AppRouter.extend({
        routes: {
            "": "showUsers"
        },
        showUsers: function() {
            // create search model
            var searchModel = new DBApp.Models.SearchForm();

            // create search view
            var searchForm = new DBApp.Views.SearchForm({
                model: searchModel,
            });

            // show search view in layout
            DBApp.root.showChildView('header', searchForm);

            // create collection
            var users = new DBApp.Models.UsersCollection([]);

            // create collection view
            var usersList = new DBApp.Views.UsersCollection({
                collection: users
            });

            // show collection
            DBApp.root.showChildView('content', usersList);

            // get data (ajax)
            jQuery.ajax({
                url: './data.json',
                type: 'get',
                dataType: 'json',
                success: function(responce) {
                    // fill collection
                    users.reset(responce);
                }
            });
        }
    });

    DBApp.on('before:start', function() {
        this.root = new DBApp.Layout.Root();
    });

    DBApp.on('start', function() {
        new DBAppRouter();
        Backbone.history.start();
    });

})(window, jQuery, Backbone);
