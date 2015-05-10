(function(window, $, Backbone) {

    'use strict';

    window.DBApp = new Backbone.Marionette.Application();

    var DBAppRouter = Backbone.Marionette.AppRouter.extend({
        routes: {
            "": "showUsers"
        },
        showUsers: function() {
            // create search model
            // create search view
            // create collection
            // create collection view
            // get data (ajax)
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
