const localtunnel = require('localtunnel');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const tunnel = await localtunnel({ port: 3000 });
    const liveUrl = tunnel.url;
    console.log('\n========================================');
    console.log('🚀 LIVE DEPLOYED PUBLIC URL:');
    console.log(liveUrl);
    console.log('========================================\n');

    fs.writeFileSync(path.join(__dirname, '../public-live-url.txt'), liveUrl);

    tunnel.on('close', () => {
      console.log('Tunnel closed');
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err);
    });
  } catch (err) {
    console.error('Failed to create tunnel:', err);
  }
})();
