import * as fs from 'fs';
import * as XLSX from 'xlsx';
import { ParsingOptions } from 'xlsx';
import { get_orders, StateType } from './collector/orders';
import { get_schedules } from './collector/schedule';
import { counter } from './material_counter';

const config:ParsingOptions = {
  type:'buffer',
}

const schedule = fs.readFileSync('../2018年下半年排产表2.xlsx');
const order = fs.readFileSync('../2018年注塑生产通知单2.xlsx');
const swb = XLSX.read(schedule, config);
const schedules = get_schedules(swb, {
  sheet: '7.1',
});
const owb = XLSX.read(order, config);
const orders = get_orders(owb, {
  sheets: {
    '6.15WBWW黑未排': {},
    '6.20': {},
    '6.22.24': {},
  },
  state: StateType.waiting,
  // custom_states: ['6/15/18']
});

const sres = counter(schedules);
console.log('排产未生产：');
console.log(sres);

const ores = counter(orders);
console.log('未排产');
console.log(ores);



