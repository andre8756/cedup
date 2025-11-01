const http = require('http');
const url = 'http://localhost:5173/src/index.css';
http.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    console.log(data.slice(0, 4000));
  });
}).on('error', err => {
  console.error('ERROR', err.message);
  process.exit(1);
});
