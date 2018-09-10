import * as fs from 'fs';
import * as XLSX from 'xlsx';
import { ParsingOptions } from 'xlsx';
import { get_orders, StateType } from './collector/orders';
import { get_schedules } from './collector/schedule';
import { get_morders } from './collector/morders';

import { counter } from './material_counter';
import { delay_founder } from './delay_founder';

const config:ParsingOptions = {
  type:'buffer',
}

// const morder = fs.readFileSync('../宏远月度生产计划 7-27.xlsx');
// const mwb = XLSX.read(morder, config);
// const morders = get_morders(mwb, {});

const schedule = fs.readFileSync('../2018年下半年排产表1.xlsx');
const swb = XLSX.read(schedule, config);
const schedules = get_schedules(swb, {
  sheet: '9.1',
});

const order = fs.readFileSync('../2018年注塑生产通知单1.xlsx');
const owb = XLSX.read(order, config);
const orders = get_orders(owb, {
  sheets: {
    '8.3WWMI': {},
    '8.8 ': {},
    '8.15': {},
    '8.21': {},
    '8.25': {},
  },
  state: StateType.waiting,
});

// const delays = delay_founder(orders, morders);
// debugger;
// const blank = fs.readFileSync('../test.xlsx');
// const bwb = XLSX.read(blank, config);
// var ws = XLSX.utils.json_to_sheet(delays);
// bwb.Sheets['工作表1'] = ws;
// XLSX.writeFile(bwb, 'out.xlsx');

const sres = counter(schedules);
console.log('排产未生产：');
console.log(sres);

const ores = counter(orders);
console.log('未排产');
console.log(ores);



