var Moment = require('moment');

var moment = Moment("2000-01-01 00:00:00");

var startTimeOptions = ['Anytime'];
var endTimeOptions = [moment.format('HH:mm')];
for (var i = 0; i < 95; i++) {
  endTimeOptions.push(moment.add(15, 'minutes').format('HH:mm'));
}

startTimeOptions = startTimeOptions.concat(endTimeOptions);

module.exports = {
  startTimeOptions: startTimeOptions,
  endTimeOptions: endTimeOptions
};
