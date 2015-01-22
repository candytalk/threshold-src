var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var _ = require('lodash');

var Moment = require('moment');

var ChartTpl = require('../../templates/chart.hbs');

var thresholdsList = require('../collections/thresholdCollectionSingleton');
var globalEvent = require('../utils/globalEvent');

var ChartView = Backbone.View.extend({
  initialize: function () {
    var self = this;
    this.render();
    this.listenTo(globalEvent, 'timeBarShouldChange', function () {
      var thresholdsTimeBarData = _.map(thresholdsList.models, function (model) {
        return {
          startTimeStr: model.get('timeArray')[0],
          endTimeStr: model.get('timeArray')[1],
          colorClass: model.get('colorClass')
        };
      });
      self.renderAllDayBar(thresholdsTimeBarData);
      self.renderFifteenMinsBar(thresholdsTimeBarData);
    });
  },

  el: $('.chart'),
  template: ChartTpl,

  renderAllDayBar: function (thresholdsTimeBarData) {
    var allDayThreshold = _.find(thresholdsTimeBarData, function (thresholdsTimeBar) {
      return thresholdsTimeBar.startTimeStr === 'Anytime';
    });
    if (allDayThreshold) {
      return this.$el.find('.all-day-bar').attr('class', allDayThreshold.colorClass).addClass('all-day-bar');
    } else {
      return this.$el.find('.all-day-bar').attr('class', 'grey').addClass('all-day-bar');
    }
  },

  renderFifteenMinsBar: function (thresholdsTimeBarData) {
    var self = this;

    function _getFifteenMinsIndex(timeString) {
      var timeMoment = Moment('2000-01-01 ' + timeString);
      return (timeMoment.hours() * 60 + timeMoment.minutes()) / 15;
    }

    var thresholds = _.filter(thresholdsTimeBarData, function (thresholdsTimeBar) {
      return thresholdsTimeBar.startTimeStr !== 'Anytime';
    });

    var fifteenMinsBars = self.$el.find('.fifteen-mins').attr('class', 'fifteen-mins');

    _.each(thresholds.reverse(), function (threshold) {
      var startIndex = _getFifteenMinsIndex(threshold.startTimeStr);
      var endIndex = _getFifteenMinsIndex(threshold.endTimeStr);
      if (startIndex < endIndex) {
        for (var i = startIndex; i < endIndex; i++) {
          $(fifteenMinsBars[i]).attr('class', threshold.colorClass).addClass('fifteen-mins');
        }
      } else if (startIndex > endIndex) {
        var lastIndex = 24 * 60 / 15;
        for (var i = startIndex; i < lastIndex; i++) {
          $(fifteenMinsBars[i]).attr('class', threshold.colorClass).addClass('fifteen-mins');
        }
        for (var i = 0; i < endIndex; i++) {
          $(fifteenMinsBars[i]).attr('class', threshold.colorClass).addClass('fifteen-mins');
        }
      }
    });


  },

  render: function () {
    this.$el.html(this.template());
    return this;
  }

});

module.exports = ChartView;
