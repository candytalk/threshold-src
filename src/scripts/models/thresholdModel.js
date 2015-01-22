var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var _ = require('lodash');
var ThresholdStringTpl = require('../../templates/thresholdString.hbs');
var Moment = require('moment');


var Threshold = Backbone.Model.extend({
    default: {},

    initialize: function (data) {
        if (!data) {
            return
        }
        this.setAttrsFromString(data);
    },
    update: function (data) {
        this.setAttrsFromString(data);
    },

    getStringFromAttrs: function () {
        var starTime = this.get('timeArray')[0];
        if (starTime === 'Anytime') {
            return ' ' + ThresholdStringTpl({
                    startTime: undefined,
                    endTime: undefined,
                    operation: this.get('operator'),
                    warningValue: this.get('thresholdValues')[0] == null ? 'X' : this.get('thresholdValues')[0],
                    errorValue: this.get('thresholdValues')[1] == null ? 'X' : this.get('thresholdValues')[1],
                    criticalValue: this.get('thresholdValues')[2] == null ? 'X' : this.get('thresholdValues')[2]
                });
        } else {
            return ThresholdStringTpl({
                startTime: this.get('timeArray')[0],
                endTime: this.get('timeArray')[1],
                operation: this.get('operator'),
                warningValue: this.get('thresholdValues')[0] == null ? 'X' : this.get('thresholdValues')[0],
                errorValue: this.get('thresholdValues')[1] == null ? 'X' : this.get('thresholdValues')[1],
                criticalValue: this.get('thresholdValues')[2] == null ? 'X' : this.get('thresholdValues')[2]
            });
        }
    },

    setAttrsFromString: function (data) {


        //from '(01:00 02:00) -> 6 10 12' to '['01:00','02:00']
        var timeStr = /\((.*)\)/g.exec(data);
        var timeArray;

        //from '01:11' -> '1:15'; from: '23:55' -> '0:0'
        function getRoundQuarter(timeString) {
            var hourAndMinString = timeString.split(':');
            var minutes = parseInt(hourAndMinString[1]);
            var hours = parseInt(hourAndMinString[0]);
            var m = (parseInt((minutes + 7.5) / 15) * 15) % 60;
            var h = minutes > 52 ? (hours === 23 ? 0 : ++hours) : hours;
            return h + ':' + m;
        }

        if (timeStr) {
            timeArray = timeStr[1].split(' ');
            timeArray[0] = Moment('2000-01-01 ' + getRoundQuarter(timeArray[0])).format('HH:mm');
            timeArray[1] = Moment('2000-01-01 ' + getRoundQuarter(timeArray[1])).format('HH:mm');
            if (timeArray[0] === timeArray[1]) {
                timeArray = ['Anytime', undefined];
            }
        } else {
            timeArray = ['Anytime', undefined];
        }

        //from '(01:00 02:00) > 6 10 12' to '>'
        var operator = /[<>=]/g.exec(data)[0];

        //from '(01:00 02:00) > 6 10 12' to '['6','10','12']'
        var thresholdValues = /[<>=]\s?(.*)/g.exec(data)[1].split(' ');

        //type case and filter NaN, also expand this array's length to 3;
        for (var i = 0; i < 3; i++) {
            var number = Number(thresholdValues[i]);
            if (isNaN(number)) {
                thresholdValues[i] = undefined;
            } else {
                thresholdValues[i] = number;
            }
        }

        this.set({'timeArray': timeArray});
        this.set({'operator': operator});
        this.set({'thresholdValues': thresholdValues});
    }
});

module.exports = Threshold;
