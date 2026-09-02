const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const cloudflared = spawn(path.join(__dirname, '../cloudflared.exe'), ['tunnel', '--url', 'http://localhost:3000']);

cloudflared.stderr.on('data', (data) => {
  const str = data.toString();
  process.stdout.write(str);
  const match = str.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
  if (match) {
    const url = match[0];
    console.log('\n========================================');
    console.log('🚀 LIVE DEPLOYED URL:', url);
    console.log('========================================\n');
    fs.writeFileSync(path.join(__dirname, '../public-url.txt'), url);
  }
});

cloudflared.stdout.on('data', (data) => {
  process.stdout.write(data.toString());
});

cloudflared.on('close', (code) => {
  console.log('cloudflared process closed with code', code);
});
