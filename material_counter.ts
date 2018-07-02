import { WorkBook, CellObject } from 'xlsx';

export interface OrderData {
  desc:string;
  mtype:string;
  amt:number;
  sheet:string;
  line:number;
}

export interface PCABSRes {
  PCABS_white:number;
  PCABS_gray:number;
  PCABS_black:number;
  'PCABS_3L':number;
}

export interface GP22Res {
  YK_white:number;
}

export interface AF365FRes {
  AF365F_white:number;
  AF365F_gray:number;
  AF365F_black:number;
  AF365F_red02:number;
}

export interface A558Res {
  '558A':number;
}

export interface H121Res {
  '121H_3L':number;
}

export type Result = PCABSRes & AF365FRes & GP22Res & A558Res & H121Res;

const exprs = {
  door: /门面/,
  ctl: /薄控|电控|机控|薄膜控制面板|薄膜控盒|控盒/,
  gray: /灰色|原色/,
  black: /黑色/,
  white: /白/,
  red02: /红色02/,
  '121H_3L': /X20L G3 门面 白色/,
  'PCABS_3L': /X20L 3L 薄控 白色/,
  YK: /17L YK 门面 美的白/,
  special: /WU|K20L 2SH 拨码旋钮/,
};

export function counter(orders:OrderData[]) {
  const res:Result = {
    PCABS_white: 0,
    PCABS_gray: 0,
    PCABS_black: 0,
    'PCABS_3L': 0,
    AF365F_white: 0,
    AF365F_gray: 0,
    AF365F_black: 0,
    AF365F_red02: 0,
    YK_white: 0,
    '558A': 0,
    '121H_3L': 0,
  }
  function update_result(type_result:Partial<Result>) {
    const types = Object.keys(type_result);
    for (let i = 0; i < types.length; i++) {
      res[types[i]] = res[types[i]] + type_result[types[i]];
    }
  }

  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    const { mtype, desc, amt } = order;
    if (exprs.special.test(desc)) {
      console.warn('⚠️   May need special material：', desc, order.sheet, order.line);
    }
    switch(mtype) {
      case 'ABS+PC':
        const PCABS = count_ABSPC(desc, amt);
        update_result(PCABS);
        break;
      case 'AF365F':
        const AF365F = count_AF365F(desc, amt);
        update_result(AF365F);
        break;
      case '121H':
        const H121 = count_121H(desc, amt);
        update_result(H121);
        break;
      case '558A':
        const A558 = count_558A(amt);
        update_result(A558);
        break;
      case 'GP22':
        const GP22 = count_GP22(desc, amt);
        update_result(GP22);
        break;
      default:
        console.warn('⚠️   Special:', mtype);
    }
  }
  return res;
}

function count_ABSPC(desc:string, amt:number) : PCABSRes {
  const res = {
    PCABS_white: 0,
    PCABS_gray: 0,
    PCABS_black: 0,
    'PCABS_3L': 0,
  };
  let ratio = 0;
  if (exprs.door.test(desc)) {
    ratio = 3000;
  } else if(exprs.ctl.test(desc)) {
    ratio = 5000;
  } else {
    console.log('⚠️   PC/ABS Not facade or control panel：', desc);
    return res;
  }

  const material_amt = amt / ratio;
  //客版白
  if (exprs.PCABS_3L.test(desc)) {
    res['PCABS_3L'] = material_amt;
  } else if (exprs.gray.test(desc)) {
    res.PCABS_gray = material_amt;
  } else if (exprs.black.test(desc)) {
    res.PCABS_black = material_amt;
  } else if (exprs.white.test(desc)) {
    res.PCABS_white = material_amt;
  } else {
    console.warn('⚠️   PC/ABS Unknown color:', desc);
  }

  return res;
}

function count_AF365F(desc:string, amt:number) {
  const res = {
    AF365F_white: 0,
    AF365F_gray: 0,
    AF365F_black: 0,
    AF365F_red02: 0,
  };
  const material_amt = amt / 6000;
  if (!exprs.ctl.test(desc)) {
    console.log('⚠️   AF365F Not a control panel：', desc);
    return res;
  }

  if (exprs.gray.test(desc)) {
    res.AF365F_gray = material_amt;
  } else if (exprs.black.test(desc)) {
    res.AF365F_black = material_amt;
  } else if (exprs.white.test(desc)) {
    res.AF365F_white = material_amt;
  } else if (exprs.red02.test(desc)) {
    res.AF365F_red02 = material_amt;
  } else {
    console.warn('⚠️   AF365F Unknown color：', desc);
  }

  return res;
}

function count_121H(desc:string, amt:number) {
  if (exprs["121H_3L"].test(desc)) {
    return {
      '121H_3L': amt * 300 / 1000000,
    }
  } else {
    return {
      '121H_3L': 0,
    };
  }
}

function count_558A(amt:number) {
  return {
    '558A': amt / 5000 * 100,
  }
}

function count_GP22(desc:string, amt:number) {
  if (exprs.YK.test(desc)) {
    return {
      YK_white: amt * 0.02644628,
    }
  }
  return {
    YK_white: 0,
  }
}

function product_type(desc:string) {
}