export function delay_founder(orders, morders) {
  const res = [];
  // const done = {};
  for (let i = 0; i < orders.length; i++) {
    const data = orders[i];
    // if (done[data.id] == true) {
    //   continue;
    // }
    // done[data.id] = true;

    if (is_Aug(data.date)) {
      continue;
    }
    const mdata = morders[data.id];
    if (mdata && is_Aug(mdata.req[0].time)) {
      res.push({
        id: data.id,
        previous: data.date,
        latest: morders[data.id].req[0].time,
        // data: morders[data.id],
        total_amt: get_total_amt(mdata.req),
        type: mdata.type,
        desc: data.desc,
        mtype: data.mtype,
      });
    }
  }

  return res;
}

function is_Aug(date) {
  return /^8\//.test(date);
}

function get_total_amt(reqs) {
  let amt = 0;
  reqs.forEach(req => {
    amt += req.amt;
  });
  return amt;
}