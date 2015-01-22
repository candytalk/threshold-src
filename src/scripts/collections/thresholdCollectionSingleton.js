var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
Backbone.LocalStorage = require('backbone.localstorage');
var _ = require('lodash');
var Threshold = require('../models/thresholdModel');
var colorClassNames = require('../utils/colorClassNames');

var ThresholdsList = Backbone.Collection.extend({
  model: Threshold,
  localStorage: new Backbone.LocalStorage('thresholds'),
  initialize: function () {
  },
  getAllDayThreshold: function () {
    return _.find(this.models, function (model) {
      return 'Anytime' === model.get('timeArray')[0];
    });
  },
  exportAllModelToString: function () {
    var modelStringArray = [];
    _.each(this.models, function (model) {
      modelStringArray.push(model.getStringFromAttrs());
    });
    return modelStringArray.join(',');
  },
  importAllModelFromString: function (modelString) {
    var self = this;
    _.each(_.clone(this.models), function (model) {
      model.destroy();
      self.remove(model);
    });
    var modelStringArray = modelString.split(',');
    _.each(modelStringArray, function (modelString) {
      if (modelString) {
        self.add(new Threshold(modelString));
      }
    });
  },
  assignColors: function () {
    _.each(this.models, function (model, index) {
      var colorClassName = colorClassNames[index % colorClassNames.length];
      model.set('colorClass', colorClassName);
      console.log(model.get('colorClass'));
    });
  }
});

module.exports = new ThresholdsList();
