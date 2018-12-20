// package requirements

const express = require('express');
const bodyParser = require('body-parser');
const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

// can't forget the config file

const config = require('./config.json');

// initializations
var app = new express();
const client =  new Discord.Client();

// initialize app
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// initialize database
var fs = require('fs');
var dbFile = './data/eventbot.db';
var exists = fs.existsSync(dbFile);
var db = new sqlite3.Database(dbFile);

// initialize client variables
const color = 0x6ad6ff;

client.color = color;
client.commands = new Discord.Collection();
client.config = config;
client.db = db;
client.discord = Discord;
client.prefix = config.prefix;

// load events

fs.readdir("events/", (err, files) => { // read the events folter
  if (err) {
    return console.error(err);
  }
  files.forEach(file => { // for each js file, require it
    if (!file.endsWith(".js")) return;
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

//load commands

const commandFiles = fs.readdirSync('commands/').filter(file => file.endsWith('.js')); // get command files

for (const file of commandFiles) { // for each command file, require it
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
  console.log(`Loading ${command.name}`);
}

// database configuration
client.db.run("CREATE TABLE IF NOT EXISTS calendar (guild TEXT, events TEXT, notifs INTEGER)");

// login with token (shhh it's a secret)
client.login(config.token);
