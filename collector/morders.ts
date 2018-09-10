import { WorkBook, CellObject } from 'xlsx';

export interface MordersConfig {
}

export interface Morders {
  [id:string]: {
    req: [{
      time:string;
      amt:number;
    }],
    desc:string;
    type:string;
  }
}

export function get_morders(wb:WorkBook, cfg:MordersConfig) : Morders {
  const res = {};
  const data = wb.Sheets['总表'];
  const lists = get_date_lists();

  let i = 2;
  while (true) {
    const id = data['A' + i];
    if (typeof id == 'undefined') {
      break;
    }
    if (id.v === '小计' || res[id.v] !== undefined) {
      i++;
      continue;
    }

    const req = [];
    for (let j = 0; j < lists.length; j++) {
      const list = lists[j];
      const maybe_amt = data[list + i];
      if (typeof maybe_amt === 'undefined') {
        continue;
      }
      req.push({
        time: get_date(j),
        amt: maybe_amt.v,
      });
    }

    res[id.v] = {
      req,
      desc: data['F' + i].v,
      type: data['H' + i].v,
    };
    i++;
  }
  return res;
}

function get_date(list_index:number) {
  if (list_index < 5) {
    return '7/' + (27 + list_index);
  }

  return '8/' + (list_index - 4);
}

function get_date_lists() {
  const res = [];
  const chars = get_characters();
  const start = chars.indexOf('K');
  const end = chars.indexOf('V');

  for (var i = start; i < chars.length; i++) {
    res.push(chars[i]);
  }

  for (var i = 0; i < end; i++) {
    res.push('A' + chars[i]);
  }
  return res;
}

function get_characters() : string[] {
  const arr = [];
  for(var i = 65; i < 91; i++){
    arr.push(String.fromCharCode(i));
  }
  return arr;
}