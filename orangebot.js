/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
// Require dependencies
const nconf = require('nconf');
const fs = require('fs');
const ipModule = require('ip');

const { initServer } = require('./http-server');
const defaults = require('./default-config.json');

// Load configs
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


process.on('uncaughtException', (err) => {
  console.log(err);
});


const startHttpServer = async () => {
  const server = await initServer({ logger: false }, nconf.get('port'));
  await server.start();
};

startHttpServer();

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
