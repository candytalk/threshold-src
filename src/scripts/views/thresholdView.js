var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var timeOptions = require('../utils/timeOptions');
var NewThresholdTpl = require('../../templates/newThreshold.hbs');
var ThresholdStringTpl = require('../../templates/thresholdString.hbs');

var thresholdsList = require('../collections/thresholdCollectionSingleton');
var globalEvent = require('../utils/globalEvent');


var Thresholdview = Backbone.View.extend({
  initialize: function () {
    var self = this;

    this.listenTo(globalEvent, 'allExitEdit', function () {
      self.exitEditing();
    });

    this.listenTo(globalEvent, 'switchMode', function (target) {
      if (target[0] === self.cid) {
        console.log('switchMode, me');
        globalEvent.trigger('exitAdding');
        self.intoEditing(target[1]);
      } else {
        console.log('switchMode, not me');
        self.exitEditing();
      }
    });

    this.listenTo(this.model, 'change:timeArray', function () {
      globalEvent.trigger('timeBarShouldChange');
    });

    this.listenTo(this.model, 'change:colorClass', this.updateColorClass);

    this.listenTo(this.model, 'destroy', this.removeView);
  },
  tagName: 'tr',
  template: NewThresholdTpl,
  className: 'threshold',

  events: {
    'change .start-time-selection': 'expandStartTimeOptionField',
    'click': '_switchModeEvent',
    'click .remove': 'removeThreshold'
  },

  updateColorClass: function (model, colorClass) {
    this.$el.find('.color').attr('class', colorClass).addClass('color');
  },

  removeView: function () {
    this.undelegateEvents();
    this.remove();
  },

  removeThreshold: function () {
    console.log('remove');
    this.model.destroy();
  },

  _switchModeEvent: function (event) {
    if (this.mode === 'edit') {
      event.stopPropagation();
      return;
    }
    globalEvent.trigger('switchMode', [this.cid, event]);
    event.stopPropagation();
  },
  _attachModelToView: function () {
    if (!this.model) {
      this.$el.attr('id', 'new-threshold');
      this.$el.addClass('editing');
      this.mode = 'creating';
      return this;
    }
    var modelObj = this.model.toJSON();
    if (!modelObj.timeArray[1]) {
      this.$el.find('select[name=start-time]').val('Anytime').parents('.start-time-td').attr('colspan', 2);
      this.$el.find('select[name=end-time]').parents('.end-time-td').hide();
    } else {
      this.$el.find('select[name=start-time]').val(modelObj.timeArray[0]).parents('.start-time-td').attr('colspan', 1);
      this.$el.find('select[name=end-time]').val(modelObj.timeArray[1]).parents('.end-time-td').show();
    }


    this.$el.find('select[name=operator]').val(modelObj.operator);

    this.$el.find('input.thresholdValue[name=warning]').val(modelObj.thresholdValues[0]);
    this.$el.find('input.thresholdValue[name=error]').val(modelObj.thresholdValues[1]);
    this.$el.find('input.thresholdValue[name=critical]').val(modelObj.thresholdValues[2]);
  },

  render: function () {
    this.$el.html(this.template(timeOptions));
    this._attachModelToView();
    return this;
  },

  noop: function (event) {
    event.stopPropagation();
  },
  intoEditing: function (event) {
    console.log('into edit');
    if (this.mode === 'edit') {
      return;
    }
    this.editModeRender(event);
  },
  expandStartTimeOptionField: function (event) {
    if ($(event.target).val() === 'Anytime') {
      $(event.target).parents('tr').find('.end-time-td').hide();
      $(event.target).parents('td').attr('colspan', 2);
    } else {
      $(event.target).parents('tr').find('.end-time-td').show();
      $(event.target).parents('td').attr('colspan', 1);
    }
  },
  editModeRender: function (event) {
    this.$el.hide();
    this.mode = 'edit';
    this.$el.addClass('editing');
    this.$el.find('.hide').removeClass('hide');
    var target = event.target;
    this.$el.toggle('down');
    if ($(event.target).is('select') || $(event.target).is('input')) {
      this.$el.find(target)[0].focus();
    } else {
      this.$el.find('select')[0].focus();
    }
    return this;
  },
  viewModeRender: function () {
    this.$el.hide();
    this.mode = 'view';
    this.$el.removeClass('editing');
    var thresholdValues = this.model.get('thresholdValues');
    if (typeof thresholdValues[1] === "undefined") {
      this.$el.find('.error-wrapper').addClass('hide');
    }
    if (typeof thresholdValues[2] === "undefined") {
      this.$el.find('.critical-wrapper').addClass('hide');
    }
    this.$el.toggle('down');
    return this;
  },


  parseViewToString: function () {
    var self = this;

    function _basicValidate() {
      if (startTime !== '' && endTime === undefined) {
        return false;
      }
      var allDayThreshold = thresholdsList.getAllDayThreshold();
      if (allDayThreshold && allDayThreshold != self.model && startTime === '') {
        return false;
      }

      if (startTime === endTime) {
        return false;
      }
      if (isNaN(warningValue) && isNaN(errorValue) && isNaN(criticalValue)) {
        return false;
      }

      if (!operation) {
        return false;
      }
      console.log('validate pass');
      return true;
    }

    function _strToNumber(val) {
      if (val.trim() === '') {
        return undefined;
      } else if (isNaN(Number(val))) {
        return undefined;
      } else return Number(val);
    }

    var startTime = this.$el.find('select[name=start-time]').val();
    startTime = startTime === 'Anytime' ? '' : startTime;
    var endTime = this.$el.find('select[name=end-time]').val();
    endTime = startTime === '' ? undefined : endTime;

    var operation = this.$el.find('select[name=operator]').val();

    var warningValue = this.$el.find('input[name=warning]').val();
    warningValue = _strToNumber(warningValue);

    var errorValue = this.$el.find('input[name=error]').val();
    errorValue = _strToNumber(errorValue);

    var criticalValue = this.$el.find('input[name=critical]').val();
    criticalValue = _strToNumber(criticalValue);


    if (_basicValidate()) {
      var thresholdString = ThresholdStringTpl({
        startTime: startTime,
        endTime: endTime,
        operation: operation,
        warningValue: !isNaN(warningValue) ? warningValue : 'X',
        errorValue: !isNaN(errorValue) ? errorValue : 'X',
        criticalValue: !isNaN(criticalValue) ? criticalValue : 'X'
      });
      return thresholdString;
    } else {
      return undefined;
    }
  }
  ,
  exitEditing: function () {
    if (this.mode === 'view') {
      return;
    }
    this.$el.find(':focus').blur();

    console.info(this.cid, 'exit edit');
    var parsedViewString = this.parseViewToString();
    if (parsedViewString) {
      this.model.update(parsedViewString);
      console.info(this.cid, 'update model');
    }
    else {
      console.info('did not update a new one, roll back, exit editing');
    }
    this._attachModelToView();
    this.viewModeRender();
  }
});

module.exports = Thresholdview;
