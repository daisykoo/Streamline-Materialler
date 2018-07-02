import { WorkBook } from "xlsx/types";
import { OrderData } from "../material_counter";

export interface ScheduleConifg {
  sheet:string;
}

const lines = [7, 13, 19, 25, 31, 37, 42, 48, 55, 65, 71, 77, 83, 89, 94, 100, 106, 112, 122, 127, 134, 139, 145, 151, 157, 163, 170, 179, 184, 189, 194, 199, 204, 209, 214, 219];
const lists = ['C', 'E', 'G', 'I', 'K', 'M', 'O', 'Q', 'S', 'U', 'W'];
export function get_schedules(wb:WorkBook, cfg:ScheduleConifg) : OrderData[] {
  debugger;
  const schedules = [];
  const data = wb.Sheets[cfg.sheet];
  if (data === undefined) {
    console.error('⚠️   This sheet not exist:', cfg.sheet);
  }
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lists.length; j++) {
      const line = lines[i];
      const list = lists[j];
      const cell = list + line;
      if (data[cell] == undefined) {
        break;
      }
      const desc = data[cell].v;
      if (desc == '暂不排' && j == 0) {
        console.log(i + 1 + '#号机无排产')
        break;
      }
      if (desc == '修机') {
        console.log(i + 1 + '#号机维修中')
        break;
      }
      const arr = desc.split(' ');
      const mtype = arr.pop();
      const amt_cell = list + (line + 2);
      const amt_data = data[amt_cell];
      const require = get_number(amt_data.v + '');
      
      if (amt_data == undefined || !require) {
        console.log('No amount at', desc, amt_data.v);
        continue;
      }
      const done = amt_data.c == undefined ? 0 : Number(amt_data.c[0].t);
      schedules.push({
        mtype,
        desc: arr.join(' '),
        amt: require - done,
      });
      
    }
  }
  return schedules;
}

function get_number(amt:string) {
  return Number(amt.replace(/[^0-9]/ig,""));
}