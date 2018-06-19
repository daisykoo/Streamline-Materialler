import { WorkBook, CellObject } from 'xlsx';

export interface MaterialCounterConfig {
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

export function collector(wb:WorkBook) {

}