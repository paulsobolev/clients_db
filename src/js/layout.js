(function(window, $, Backbone) {
    'use strict';

    window.DBApp.module('Layout', function(Layout, App, Backbone, Marionette) {
        Layout.Root = Marionette.LayoutView.extend({
            el: '#app',
            regions: {
                header: '#header',
                content: '#content',
            }
        });
    });
})(window, jQuery, Backbone);
