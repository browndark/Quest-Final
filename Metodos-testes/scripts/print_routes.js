const r = require('../cinema-challenge-back/src/routes');
const s = r.stack || [];
console.log('Router stack length:', s.length);
s.forEach((l, i) => {
  console.log(i, 'name=', l.name, 'route=', l.route ? JSON.stringify(l.route.path) : '', 'regexp=', l.regexp ? l.regexp.source : '', 'handleName=', l.handle && l.handle.name ? l.handle.name : '');
});
