"use strict";
exports.__esModule = true;
var StateType;
(function (StateType) {
    StateType[StateType["waiting"] = 0] = "waiting";
    StateType[StateType["done"] = 1] = "done";
    StateType[StateType["custom"] = 2] = "custom";
})(StateType = exports.StateType || (exports.StateType = {}));
var exprs = {
    door: /门面/,
    ctl: /薄控|电控|机控|薄膜控制面板|薄膜控盒/,
    gray: /灰色|原色/,
    black: /黑色/,
    white: /白/,
    red02: /红色02/,
    '121H_3L': /X20L G3 门面 白色/,
    'PCABS_3L': /X20L 3L 薄控 白色/,
    YK: /17L YK 门面 美的白/,
    special: /WU|C3|K20L 2SH 拨码旋钮/
};
function counter(wb, cfg) {
    var sheets = Object.keys(cfg.sheets);
    var res = {
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
        '121H_3L': 0
    };
    function update_result(type_result) {
        var types = Object.keys(type_result);
        for (var i = 0; i < types.length; i++) {
            res[types[i]] = res[types[i]] + type_result[types[i]];
        }
    }
    for (var i = 0; i < sheets.length; i++) {
        var sheet_name = sheets[i];
        var data = wb.Sheets[sheet_name];
        if (data === undefined) {
            console.error('⚠️   This sheet not exist:', sheet_name);
            continue;
        }
        var sheet_cfg = cfg.sheets[sheet_name];
        var line = sheet_cfg.start || 5;
        while (true) {
            if (sheet_cfg.end === undefined) {
                if (data['F' + line] == undefined) {
                    break;
                }
            }
            if (sheet_cfg.end !== undefined && line > sheet_cfg.end) {
                break;
            }
            var desc = data['F' + line].v;
            var required = data['I' + line].v;
            if (exprs.special.test(desc)) {
                console.warn('⚠️   May need special material：', sheet_name, line, desc);
            }
            var state = data['L' + line] ? data['L' + line].w : null;
            if (state === 0) {
                line++;
                continue;
            }
            if (cfg.state === StateType.waiting && state !== null) {
                line++;
                continue;
            }
            else if (cfg.state === StateType.custom && cfg.custom_states.indexOf(state) < 0) {
                line++;
                continue;
            }
            var mtype = data['N' + line].v;
            switch (mtype) {
                case 'ABS+PC':
                    var PCABS = count_ABSPC(desc, required);
                    update_result(PCABS);
                    break;
                case 'AF365F':
                    var AF365F = count_AF365F(desc, required);
                    update_result(AF365F);
                    break;
                case '121H':
                    var H121 = count_121H(desc, required);
                    update_result(H121);
                    break;
                case '558A':
                    var A558 = count_558A(required);
                    update_result(A558);
                    break;
                case 'GP22':
                    var GP22 = count_GP22(desc, required);
                    update_result(GP22);
                    break;
                default:
                    console.warn('⚠️   Special:', mtype);
            }
            line++;
        }
    }
    return res;
}
exports.counter = counter;
function count_ABSPC(desc, amt) {
    var res = {
        PCABS_white: 0,
        PCABS_gray: 0,
        PCABS_black: 0,
        'PCABS_3L': 0
    };
    var ratio = 0;
    if (exprs.door.test(desc)) {
        ratio = 3000;
    }
    else if (exprs.ctl.test(desc)) {
        ratio = 5000;
    }
    else {
        console.log('⚠️   PC/ABS Not facade or control panel：', desc);
        return res;
    }
    var material_amt = amt / ratio;
    //客版白
    if (exprs.PCABS_3L.test(desc)) {
        res['PCABS_3L'] = material_amt;
    }
    else if (exprs.gray.test(desc)) {
        res.PCABS_gray = material_amt;
    }
    else if (exprs.black.test(desc)) {
        res.PCABS_black = material_amt;
    }
    else if (exprs.white.test(desc)) {
        res.PCABS_white = material_amt;
    }
    else {
        console.warn('⚠️   PC/ABS Unknown color:', desc);
    }
    if (/WB/.test(desc)) {
        res.PCABS_gray = res.PCABS_gray / 2;
    }
    return res;
}
function count_AF365F(desc, amt) {
    var res = {
        AF365F_white: 0,
        AF365F_gray: 0,
        AF365F_black: 0,
        AF365F_red02: 0
    };
    var material_amt = amt / 6000;
    if (!exprs.ctl.test(desc)) {
        console.log('⚠️   AF365F Not a control panel：', desc);
        return res;
    }
    if (exprs.gray.test(desc)) {
        res.AF365F_gray = material_amt;
    }
    else if (exprs.black.test(desc)) {
        res.AF365F_black = material_amt;
    }
    else if (exprs.white.test(desc)) {
        res.AF365F_white = material_amt;
    }
    else if (exprs.red02.test(desc)) {
        res.AF365F_red02 = material_amt;
    }
    else {
        console.warn('⚠️   AF365F Unknown color：', desc);
    }
    return res;
}
function count_121H(desc, amt) {
    if (exprs["121H_3L"].test(desc)) {
        return {
            '121H_3L': amt * 300 / 1000000
        };
    }
    else {
        return {
            '121H_3L': 0
        };
    }
}
function count_558A(amt) {
    return {
        '558A': amt / 5000 * 100
    };
}
function count_GP22(desc, amt) {
    if (exprs.YK.test(desc)) {
        return {
            YK_white: amt * 0.02644628
        };
    }
    return {
        YK_white: 0
    };
}
function product_type(desc) {
}
