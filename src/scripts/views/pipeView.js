var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var _ = require('lodash');
var thresholdsList = require('../collections/thresholdCollectionSingleton');
var PipeTpl = require('../../templates/pipe.hbs');

Pipe = Backbone.View.extend({
  initialize: function () {
    this.render();
  },
  events: {
    'click #import-button': 'parseImportString',
    'click #export-button': 'exportToString'
  },

  template: PipeTpl,
  el: $('.pipe'),

  parseImportString: function () {
    var inputString = this.$el.find('#import-box').val() || '';
    try {
      thresholdsList.importAllModelFromString(inputString);
    } catch (err) {
      alert('import data is not validate');
    }
  },

  exportToString: function () {
    this.$el.find('#export-box').val(thresholdsList.exportAllModelToString());
  },
  render: function () {
    this.$el.html(this.template());
    return this;
  }
});

module.exports = Pipe;
