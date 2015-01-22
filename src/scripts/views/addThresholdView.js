var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var _ = require('lodash');


var timeOptions = require('../utils/timeOptions');
var NewThresholdTpl = require('../../templates/newThreshold.hbs');

var thresholdsList = require('../collections/thresholdCollectionSingleton');
var globalEvent = require('../utils/globalEvent');
var ThresholdView = require('./thresholdView');

var AddThresholdView = ThresholdView.extend({
  initialize: function () {
    var self = this;
    globalEvent.on('exitAdding', function () {
      self.exitEditing();
    });
  },
  tagName: 'tr',
  template: NewThresholdTpl,
  id: 'new-threshold',

  events: {
    'change .start-time-selection': 'expandStartTimeOptionField',
    'click': 'noop'
  },

  render: function () {
    this.$el.html(this.template(timeOptions));
    return this;
  },
  exitEditing: function () {
    if (this.mode === 'non-active') {
      return;
    }
    var parsedViewString = this.parseViewToString();
    if (parsedViewString) {
      thresholdsList.create(parsedViewString);
      console.info('create new threshold');
    }
    else {
      console.info('did not create a new one, exit editing');
    }
    this.$el.empty();
    $('#add-new-threshold').show();
    this.mode = 'non-active';
  }
});


module.exports = AddThresholdView;
