var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var _ = require('lodash');

var Threshold = require('../models/thresholdModel');
var newThreshold = new Threshold();
var thresholdsList = require('../collections/thresholdCollectionSingleton');
var ThresholdView = require('./thresholdView');
var AddThresholdView = require('./addThresholdView');
var globalEvent = require('../utils/globalEvent');


var Appview = Backbone.View.extend({
  initialize: function () {
    this.listenTo(thresholdsList, 'add', this.addOne);
    this.listenTo(thresholdsList, 'add remove', function () {
      thresholdsList.assignColors();
      globalEvent.trigger('timeBarShouldChange');
    })
  },

  el: $('#threshold-table'),
  events: {
    'click #add-new-threshold': 'showAddNew',
    'click #threshold-table': 'noop'
  },

  noop: function (event) {
    event.stopPropagation();
  },
  showAddNew: function (event) {
    globalEvent.trigger('allExitEdit');
    console.log('showAddNew');
    event.stopPropagation();
    var view = this.addThresholdView || new AddThresholdView({model: newThreshold});
    this.addThresholdView = view;
    view.$el.addClass('editing');
    this.addThresholdView.mode = 'active';
    this.$el.find('#new-threshold').replaceWith(view.render({}).el);
    this.$el.find('#add-new-threshold').hide();
  },
  addOne: function (threshold) {
    var view = new ThresholdView({model: threshold});
    this.$el.find('tbody').append(view.render().viewModeRender().el);
  }


});

module.exports = Appview;
