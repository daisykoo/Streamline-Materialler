import { WorkBook, CellObject } from 'xlsx';
import { OrderData } from '../material_counter';

export interface OrdersConfig {
  sheets:TargetData;
  state:StateType;
  custom_states?:string[];
}

export enum StateType {
  waiting,
  done,
  custom,
}

export interface TargetData {
  [sheet:string]:{
    start?:number;
    end?:number;
  };
}

export function get_orders(wb:WorkBook, cfg:OrdersConfig) : OrderData[] {
  const sheets = Object.keys(cfg.sheets);
  const res = [];

  for (let i = 0; i < sheets.length; i++) {
    const sheet_name = sheets[i];
    const data = wb.Sheets[sheet_name];
    if (data === undefined) {
      console.error('⚠️   This sheet not exist:', sheet_name);
      continue;
    }

    const sheet_cfg = cfg.sheets[sheet_name];
    let line = sheet_cfg.start || 5;
    while(true) {
      if (sheet_cfg.end === undefined) {
        if (data['F' + line] == undefined) {
          break;
        }
      }

      if (sheet_cfg.end !== undefined && line > sheet_cfg.end) {
        break;
      }
      const desc = data['F' + line].v;
      const required = data['I'+ line].v;
      const state = data['L' + line] ? data['L' + line].w : null;
      if (state === 0) {
        line++;
        continue;
      }
      if (cfg.state === StateType.waiting && state !== null) {
        line++;
        continue;
      } else if (cfg.state === StateType.custom && cfg.custom_states.indexOf(state) < 0) {
        line++;
        continue;
      }
      const mtype = data['N' + line].v;
      res.push({
        desc,
        mtype,
        amt: required,
        sheet: sheet_name,
        line,
      });
      line++;
    }
  }
  return res;
}