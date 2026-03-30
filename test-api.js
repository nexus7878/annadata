const https = require('https');

const url = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001fc422d1b642e49bb7ad4fbbd6a2d7dde&format=json&limit=5';

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log(JSON.parse(data)));
}).on('error', (err) => console.log('Error: ', err.message));
