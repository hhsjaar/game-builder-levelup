// PM2 process config for running this app as a persistent server on a VPS
// (instead of Vercel's serverless functions, which cap request duration at
// 300s — too short for the heaviest game-generation requests). A plain Node
// process has no such cap; Nginx's proxy_read_timeout (see
// deploy/nginx.conf.example) is the only timeout that matters here.
//
// Usage on the server, after `npm ci && npm run build`:
//   pm2 start ecosystem.config.js
//   pm2 save && pm2 startup   # keep it running across reboots
module.exports = {
  apps: [
    {
      name: "game-prompt-studio",
      script: "npm",
      args: "start",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      // Generation requests are long-lived by design (up to several
      // minutes) — don't let PM2 mistake one for a hung process.
      kill_timeout: 10000,
    },
  ],
};
