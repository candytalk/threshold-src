var _ = require("lodash");
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var globalEvent = _.extend({}, Backbone.Events);

$(window).on('click', function () {
  globalEvent.trigger('allExitEdit');
  globalEvent.trigger('exitAdding');
});

$(window).keyup(function (event) {
  if (event.keyCode == 27) {
    globalEvent.trigger('allExitEdit');
    globalEvent.trigger('exitAdding');
  }
});


module.exports = globalEvent;
