const http = require('http');
const url = 'http://localhost:5174/';
http.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(data.slice(0, 2000));
  });
}).on('error', err => {
  console.error('ERROR', err.message);
  process.exit(1);
});
