/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
// Require dependencies
const nconf = require('nconf');
const fs = require('fs');


const TelegramBot = require('node-telegram-bot-api');

const ipModule = require('ip');
const defaults = require('./default-config.json');

(function loadConfigs() {
  const confPath = './config.json';

  // Create configs from defaults if not exists
  if (!fs.existsSync(confPath)) {
    fs.writeFileSync(confPath, JSON.stringify(defaults, null, 2));
  }

  nconf.file({
    file: confPath,
  });
}());

// Read configs
if (nconf.get('ip') === '') nconf.set('ip', ipModule.address());

// const pool = nconf.get('pool');
const telegram = nconf.get('telegram');

// Storing the bot state
const bot = {
  admins64: [],
  servers: {},
};

// Create HTTP server
const { initServer } = require('./http-server');

const startHttpServer = async () => {
  const server = await initServer({ logger: false }, nconf.get('port'));
  await server.start();
};

startHttpServer();

if (telegram && telegram.token.length && telegram.groupId.length) {
  bot.telegramBot = new TelegramBot(telegram.token, {
    polling: true,
  });
}

// Add static servers
// for (const i in statics) {
//   if (statics.hasOwnProperty(i)) {
//     addServer(statics[i].host, statics[i].port, statics[i].pass);
//   }
// }

process.on('uncaughtException', (err) => {
  console.log(err);
});

console.log(`OrangeBot listening on ${nconf.get('port')}`);
console.log('Run this in CS console to connect or configure orangebot.js:');
console.log(
  `connect YOUR_SERVER;password YOUR_PASS;rcon_password YOUR_RCON;rcon sv_rcon_whitelist_address ${
    nconf.get('ip')
  };rcon logaddress_add ${
    nconf.get('ip')
  }:${
    nconf.get('port')
  };rcon log on;rcon rcon_password YOUR_RCON`,
);
