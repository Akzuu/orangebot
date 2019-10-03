/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
const request = require('request');
const { named } = require('named-regexp');
const nconf = require('nconf');
const fs = require('fs');
const ipModule = require('ip');
const TelegramBot = require('node-telegram-bot-api');
const defaults = require('./default-config.json');

// Require bot modules
const Server = require('./server.js');
const Rcons = require('./rcons.js');
const Utils = require('./utils.js');

const bot = {
  admins64: [],
  servers: {},
};

// Read configs
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
const admins = nconf.get('admins');
const whitelist = nconf.get('whitelist');
const telegram = nconf.get('telegram');


for (const i in admins) {
  if (admins.hasOwnProperty(i)) {
    bot.admins64.push(Utils.id64(admins[i]));
  }
}


if (telegram && telegram.token.length && telegram.groupId.length) {
  bot.telegramBot = new TelegramBot(telegram.token, {
    polling: true,
  });
}

if (bot.hasOwnProperty('telegramBot')) {
  bot.telegramBot.on('message', (msg) => {
    if (!msg.text) {
      return;
    }

    // Only listen set group chat
    if (String(msg.chat.id) !== telegram.groupId) {
      return;
    }

    // const name = msg.from.username || msg.from.first_name;
    const message = msg.text;

    // Message have to be reply
    if (msg.reply_to_message) {
      const re = named(/@(:<addr>\d+\.\d+\.\d+\.\d+:\d+)/m);
      const match = re.exec(msg.reply_to_message.text);
      if (match !== null) {
        const addr = match.capture('addr');
        if (message.match(/^!/)) {
          bot.servers[info.container].say(message);
        } else {
          bot.servers[info.container].chat(` \x06Admin: \x10${message}`);
          bot.servers[info.container].center(`Admin: ${message}`);
        }
      }
    }
  });
}


setInterval(() => {
  for (const i in bot.servers) {
    if (bot.servers.hasOwnProperty(i)) {
      const now = new Date().getTime();
      if (bot.servers[i].lastlog < now - 1000 * 60 * 10 && bot.servers[i].state.players.length < 3) {
        console.log(`Dropping idle server ${i}`);
        delete bot.servers[i];
      }

      if (!bot.servers[i].state.live && bot.servers[i].state.pool.length === 0) {
        if (bot.servers[i].state.knife) {
          // Hotfix: show correct help
          // bot.servers[i].rcon(Rcons.WARMUP_KNIFE);
          bot.servers[i].rcon(Rcons.WARMUP);
        } else {
          bot.servers[i].rcon(Rcons.WARMUP);
        }
      } else if (bot.servers[i].state.paused && bot.servers[i].state.freeze) {
        bot.servers[i].rcon(Rcons.MATCH_PAUSED);
      }
    }
  }
}, 15000);

// Show map bans to GOTV
setInterval(() => {
  for (const i in bot.servers) {
    if (bot.servers.hasOwnProperty(i) && !bot.servers[i].state.live && bot.servers[i].state.pool.length > 0) {
      bot.servers[i].rcon(
        `tv_msg Ban: ${
          bot.servers[i].state.banned.join(', ')
        } Left: ${
          bot.servers[i].state.pool.join(', ')}`,
      );
    }
  }
}, 2000);

// Execute queued RCON commands
setInterval(() => {
  for (const i in bot.servers) {
    if (bot.servers.hasOwnProperty(i) && bot.servers[i].state.queue.length > 0) {
      const cmd = bot.servers[i].state.queue.shift();
      bot.servers[i].realrcon(cmd);
    }
  }
}, 100);

const msgHandler = (msg, info) => {
  const addr = `${info.address}:${info.port}`;
  const text = msg.toString();

  // console.log(`<${addr}> ${Utils.clean(text).substring(3)}`);

  let param; let cmd; let re; let
    match;

  if (bot.servers[info.container] === undefined) {
    bot.servers[info.container] = new Server({
      address: addr,
      pass: info.rconPass,
      nconf,
      bot,
      container: info.container,
    });
  }

  // Connected
  re = named(/"(:<user_name>.+)[<](:<user_id>\d+)[>][<](:<steam_id>.*)[>]<>" connected/);
  match = re.exec(text);
  if (match !== null) {
    if (match.capture('steam_id') !== 'BOT') {
      // Get player Steam ID
      const conName = match.capture('user_name');
      const conId = match.capture('steam_id');
      const conId64 = Utils.id64(conId);

      // Check if connecting user is a player
      request(`https://akl.gg/akl-service/api/users/communityid/${conId64}`, (error, response, body) => {
        if (error) {
          bot.servers[info.container].chat(` \x10Letting ${conName} connect because AKL API is not responding.`);
          return;
        }

        if (response.statusCode === 200) {
          bot.servers[info.container].chat(` \x10${conName} (connecting) is a registered user.`);
        } else if (Utils.whitelisted(conId, whitelist)) {
          bot.servers[info.container].chat(` \x10${conName} (connecting) is whitelisted.`);
        } else if (response.statusCode === 504) {
          bot.servers[info.container].chat(` \x10Letting ${conName} connect because AKL API is not responding.`);
          return;
        } else {
          bot.servers[info.container].chat(` \x10${conName} tried to connect, but is not registered.`);
          bot.servers[info.container].rcon(`kickid ${conId} This account is not registered on akl.gg`);
        }

        if (body.match(/(ROLE_ADMIN|ROLE_REFEREE)/gm) && bot.admins64.indexOf(conId64) < 0) {
          bot.admins64.push(conId64);
        }
      });
    }
  }

  // Halftime
  // re = named(/World triggered "Announce_Phase_End"/);
  // match = re.exec(text);
  // if (match !== null) {
  //   console.log('phase_end')
  //   // bot.servers[info.container].halftime();
  // }


  // re = named(/World triggered "Start_Halftime"/);
  // match = re.exec(text);
  // if (match !== null) {
  //   console.log('start_halftime');
  //   bot.servers[info.container].halftime();
  // }

  // Join to a team
  re = named(
    /"(:<user_name>.+)[<](:<user_id>\d+)[>][<](:<steam_id>.*)[>]" switched from team [<](:<user_team>CT|TERRORIST|Unassigned|Spectator)[>] to [<](:<new_team>CT|TERRORIST|Unassigned|Spectator)[>]/,
  );
  match = re.exec(text);
  if (match !== null) {
    if (bot.servers[info.container].state.players[match.capture('steam_id')] === undefined) {
      if (match.capture('steam_id') !== 'BOT') {
        const player = {};
        player.steamid = match.capture('steam_id');
        player.name = match.capture('user_name');
        player.team = match.capture('new_team');
        bot.servers[info.container].state.players[match.capture('steam_id')] = player;
      }
    } else {
      bot.servers[info.container].state.players[match.capture('steam_id')].steamid = match.capture('steam_id');
      bot.servers[info.container].state.players[match.capture('steam_id')].team = match.capture('new_team');
      bot.servers[info.container].state.players[match.capture('steam_id')].name = match.capture('user_name');
    }
    bot.servers[info.container].lastlog = new Date().getTime();
  }

  // Clantag
  // re = named(/Team playing "(:<team>CT|TERRORIST)": (:<clan_tag>.+)/)
  // match = re.exec(text);
  // if (match !== null) {
  //   if (match.capture("team") === 'TERRORIST') {
  //     bot.servers[info.container].state.setClan.TERRORIST = match.capture("clan_tag");
  //   } else if (match.capture("team") === 'CT') {
  //     bot.servers[info.container].state.setClan.CT = match.capture("clan_tag");
  //   }
  //   bot.servers[info.container].lastlog = new Date().getTime();
  // }


  // Disconnect
  re = named(
    /"(:<user_name>.+)[<](:<user_id>\d+)[>][<](:<steam_id>.*)[>][<](:<user_team>CT|TERRORIST|Unassigned|Spectator)[>]" disconnected/,
  );
  match = re.exec(text);
  if (match !== null) {
    if (bot.servers[info.container].state.players[match.capture('steam_id')] !== undefined) {
      delete bot.servers[info.container].state.players[match.capture('steam_id')];
    }
    bot.servers[info.container].lastlog = new Date().getTime();
  }

  // Map loading
  re = named(/Loading map "(:<map>.*?)"/);
  match = re.exec(text);
  if (match !== null) {
    for (const prop in bot.servers[info.container].state.players) {
      if (bot.servers[info.container].state.players.hasOwnProperty(prop)) {
        delete bot.servers[info.container].state.players[prop];
      }
    }
    bot.servers[info.container].lastlog = new Date().getTime();
  }

  // Map started
  re = named(/Started map "(:<map>.*?)"/);
  match = re.exec(text);
  if (match !== null) {
    bot.servers[info.container].newmap(match.capture('map'));
    bot.servers[info.container].lastlog = new Date().getTime();
  }

  // Round start
  re = named(/World triggered "Round_Start"/);
  match = re.exec(text);
  if (match !== null) {
    bot.servers[info.container].round();
    bot.servers[info.container].lastlog = new Date().getTime();
  }

  // Round end
  re = named(
    /Team "(:<team>.*)" triggered "SFUI_Notice_(:<team_win>Terrorists_Win|CTs_Win|Target_Bombed|Target_Saved|Bomb_Defused)" \(CT "(:<ct_score>\d+)"\) \(T "(:<t_score>\d+)"\)/,
  );
  match = re.exec(text);
  if (match !== null) {
    const tScore = parseInt(match.capture('t_score'), 10);
    const ctScore = parseInt(match.capture('ct_score'), 10);
    if (ctScore + tScore === 15) {
      bot.servers[info.container].halftime();
    } else if ((ctScore + tScore + 3) % 6 === 0) {
      bot.servers[info.container].halftime();
    }


    const score = {
      TERRORIST: tScore,
      CT: ctScore,
    };
    bot.servers[info.container].score(score);
    bot.servers[info.container].lastlog = new Date().getTime();
  }

  // Map end xd
  re = named(/Game Over:.*score (:<ct_score>\d+):(:<t_score>\d+).*/);
  match = re.exec(text);
  if (match !== null) {
    const tScore = parseInt(match.capture('t_score'), 10);
    const ctScore = parseInt(match.capture('ct_score'), 10);
    bot.servers[info.container].mapEnd(tScore, ctScore);
    console.log(tScore);
    console.log(ctScore);
    bot.servers[info.container].lastlog = new Date().getTime();
  }

  // !command
  re = named(
    /"(:<user_name>.+)[<](:<user_id>\d+)[>][<](:<steam_id>.*)[>][<](:<user_team>CT|TERRORIST|Unassigned|Spectator|Console)[>]" say(:<say_team>_team)? "[!.](:<text>.*)"/,
  );
  match = re.exec(text);
  if (match !== null) {
    const isAdmin = match.capture('user_id') === '0' || bot.servers[info.container].admin(match.capture('steam_id'));
    param = match.capture('text').split(' ');
    // eslint-disable-next-line prefer-destructuring
    cmd = param[0];
    param.shift();
    switch (String(cmd)) {
      case 'admin':
        // eslint-disable-next-line no-case-declarations
        const message = param.join(' ').replace('!admin ', '');
        if (bot.hasOwnProperty('telegramBot')) {
          bot.telegramBot.sendMessage(
            telegram.groupId,
            `*${match.capture('user_name')}@${addr}*\n${message}\n*Admin called*`,
            {
              parse_mode: 'Markdown',
            },
          );
        } else {
          bot.servers[info.container].chat(' \x05Telegram bot is not set.');
        }
        break;
      case 'restore':
      case 'replay':
        if (isAdmin) bot.servers[info.container].restore(param);
        break;
      case 'status':
      case 'stats':
      case 'score':
      case 'scores':
        bot.servers[info.container].stats(true);
        break;
      case 'restart':
      case 'reset':
      case 'warmup':
        if (isAdmin) bot.servers[info.container].warmup();
        break;
      case 'maps':
      case 'map':
      case 'start':
      case 'match':
      case 'startmatch':
        if (isAdmin || !bot.servers[info.container].get().live) {
          bot.servers[info.container].start(param);
        }
        break;
      case 'force':
        if (isAdmin) bot.servers[info.container].ready(true);
        break;
      case 'resume':
      case 'ready':
      case 'rdy':
      case 'unpause':
        bot.servers[info.container].ready(match.capture('user_team'));
        break;
      case 'pause':
        bot.servers[info.container].pause();
        break;
      case 'stay':
        bot.servers[info.container].stay(match.capture('user_team'));
        break;
      case 'swap':
      case 'switch':
        bot.servers[info.container].swap(match.capture('user_team'));
        break;
      case 'knife':
        bot.servers[info.container].knife();
        break;
      case 'disconnect':
      case 'quit':
      case 'leave':
        if (isAdmin) {
          bot.servers[info.container].quit();
          delete bot.servers[info.container];
          console.log(`Disconnected from ${addr}`);
        }
        break;
      case 'say':
        if (isAdmin) {
          bot.servers[info.container].chat(` \x06Admin: \x10${param.join(' ')}`);
          bot.servers[info.container].center(`Admin: ${param.join(' ')}`);
        }
        break;
      case 'whitelist':
        if (isAdmin) whitelist.push(param.join(' '));
        break;
      case 'debug':
        bot.servers[info.container].debug();
        break;
      case 'ban':
        bot.servers[info.container].ban(param, match.capture('user_team'));
        break;
      case 'pick':
        bot.servers[info.container].pick(param, match.capture('user_team'));
        break;
      case 'bo1':
        bot.servers[info.container].matchformat('bo1');
        break;
      case 'bo3':
        bot.servers[info.container].matchformat('bo3');
        break;
      case 'matchformat':
        if (isAdmin) bot.servers[info.container].matchformat(param[0]);
        break;
      case 'team':
        bot.servers[info.container].setClanName(param, match.capture('user_team'));
        break;
      default:
        break;
    }

    bot.servers[info.container].lastlog = new Date().getTime();
  }
};

module.exports = {
  msgHandler,
};
