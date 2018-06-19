import * as fs from 'fs';
import * as XLSX from 'xlsx';
import { ParsingOptions } from 'xlsx';
import { counter, StateType } from './material_counter';
const util = require('util')

const config:ParsingOptions = {
  type:'buffer',
}
const buf = fs.readFileSync('../2018年注塑生产通知单15.xlsx');
const wb = XLSX.read(buf, config);
const res = counter(wb, {
  sheets: {
    '5.24.26.29WWKW未排': {},
    '6.2 2SHM5未排': {},
    '6.6':{},
    '6.11': {},
    '6.5': {},
  },
  state: StateType.waiting,
  // custom_states: ['6/15/18']
});
// 6/13/18
console.log(res);

