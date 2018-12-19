// package requirements

const express = require('express');
const bodyParser = require('body-parser');
const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

// can't forget the config file

const config = require('./config.json');

// initializations
var app = new express();
const client=  new Discord();

// initialize app
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// initialize database
var fs = require('fs');
var dbFile = './.data/eventbot.db';
var exists = fs.existsSync(dbFile);
var db = new sqlite3.Database(dbFile);

// initialize client variables
const color = 0x6ad6ff;

client.discord = Discord;
client.commands = new Discord.Collection();
client.color = color;
client.db = db;
client.prefix = config.prefix;

fs.readdir("events/", (err, files) => {
  if (err) {
    return console.error(err);
  }
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

const commandFiles = fs.readdirSync('commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
  console.log(`Loading ${cmd.name}`);
}

client.login(config.token);
