"use strict";
exports.__esModule = true;
var fs = require("fs");
var XLSX = require("xlsx");
var material_counter_1 = require("./material_counter");
var util = require('util');
var config = {
    type: 'buffer'
};
var buf = fs.readFileSync('../2018年注塑生产通知单15.xlsx');
var wb = XLSX.read(buf, config);
var res = material_counter_1.counter(wb, {
    sheets: {
        '5.24.26.29WWKW未排': {},
        '6.2 2SHM5未排': {},
        '6.6': {},
        '6.11': {},
        '6.5': {}
    },
    state: material_counter_1.StateType.waiting
});
// 6/13/18
console.log(res);
