var $ = require('jquery');
require('jquery-ui');
var Backbone = require('backbone');
Backbone.$ = $;

var AppView = require("./views/appView");
var appView = new AppView();

var ChartView = require("./views/chartView");
var chartView = new ChartView();

var PipeView = require("./views/pipeView");
var pipeView = new PipeView();
