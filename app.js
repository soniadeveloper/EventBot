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

// time constants
const WEEK = 604800000;
const DAY = 86400000;
const HOUR = 3600000;
const MIN = 60000;
const TIMEOUT = 15000;

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
client.db.run("CREATE TABLE IF NOT EXISTS calendar (guild TEXT, events TEXT, notifs INTEGER, channel TEXT)");

setInterval(function() { // goes through each server and its events to check if reminders should be sent
  client.db.all(`SELECT guild, events, notifs, channel FROM calendar`, (err, rows) => {
    if (err) {
      console.error("App.js selection error: ", err);
    }
    rows.forEach((row) => { // for each server, check if they should be notified about an event
      var events = JSON.parse(row.events);
      var channel;
      var guild = client.guilds.get(row.guild);

      if (guild.available) { // if the server is available
        if (row.channel === "010010001110" || row.channel === null || row.channel === undefined) { // if a notification channel is not set
          function isTxtChannel(ch) { // checks if a channel is a text channel
            return ch.type === "text";
          }
          var chList = guild.channels.filter(isTxtChannel).array();
          var i = 0;
          while (channel === undefined) { // if the channel variable is still undefined, meaning a channel has not been found yet
            if (chList[i].permissionsFor(guild.me).has("SEND_MESSAGES")) {
              channel = chList[i];
            }
            i++;
          }
        }
        else { // if a notification channel is set
          channel = guild.channels.get(row.channel);
        }
        events.list.forEach((event) => { // for each event in the list of events of the server
          var eventDate = Date.parse(event.fullDate); // date of event
          var curr = Date.now(); // current time
          if (row.notifs === 1) { // if notifications are on
            var diff = eventDate - curr; // difference between event date and current time
            var timeMsg; // initialize time message
            console.log(row.guild, channel.id, channel.name);
            if (diff >= WEEK && diff <= WEEK + TIMEOUT) { // week + timeout >= diff >= week
              timeMsg =  "in 1 week";
              channel.send(new Discord.RichEmbed()
              .setColor(color)
              .setTitle("🔔 Event Reminder")
              .setDescription(`Your event, \`${event.name}\`, is happening \`${timeMsg}.\``)
              .setFooter(`Event ID #${event.id} | Use +delete [ID] to cancel this event.`));
            }
            else if (diff >= (DAY * 3) && diff <= (DAY * 3) + TIMEOUT) { // happening in 3 days
              timeMsg = "in 3 days";
              channel.send(new Discord.RichEmbed()
              .setColor(color)
              .setTitle("🔔 Event Reminder")
              .setDescription(`Your event, \`${event.name}\`, is happening \`${timeMsg}.\``)
              .setFooter(`Event ID #${event.id} | Use +delete [ID] to cancel this event.`));
            }
            else if (diff >= DAY && diff <= DAY + TIMEOUT) { // happening in 1 day
              timeMsg = "in 1 day";
              channel.send(new Discord.RichEmbed()
              .setColor(color)
              .setTitle("🔔 Event Reminder")
              .setDescription(`Your event, \`${event.name}\`, is happening \`${timeMsg}.\``)
              .setFooter(`Event ID #${event.id} | Use +delete [ID] to cancel this event.`));
            }
            else if (diff >= HOUR && diff <= HOUR + TIMEOUT) { // 1 hour
              timeMsg = "in 1 hour";
              channel.send(new Discord.RichEmbed()
              .setColor(color)
              .setTitle("🔔 Event Reminder")
              .setDescription(`Your event, \`${event.name}\`, is happening \`${timeMsg}.\``)
              .setFooter(`Event ID #${event.id} | Use +delete [ID] to cancel this event.`));
            }
            else if (diff >= (MIN * 30) && diff <= (MIN * 30) + TIMEOUT) { // 30 minutes
              timeMsg = "in 30 minutes";
              channel.send(new Discord.RichEmbed()
              .setColor(color)
              .setTitle("🔔 Event Reminder")
              .setDescription(`Your event, \`${event.name}\`, is happening \`${timeMsg}.\``)
              .setFooter(`Event ID #${event.id} | Use +delete [ID] to cancel this event.`));
            }
            else if (diff >= (MIN * 5) && diff <= (MIN * 5) + TIMEOUT) { // 5 mintues
              timeMsg = "in 5 minutes";
              channel.send(new Discord.RichEmbed()
              .setColor(color)
              .setTitle("🔔 Event Reminder")
              .setDescription(`Your event, \`${event.name}\`, is happening \`${timeMsg}.\``)
              .setFooter(`Event ID #${event.id} | Use +delete [ID] to cancel this event.`));
            }
            else if (diff >= 0 && diff <= TIMEOUT) { // now
              timeMsg = "now";
              channel.send(new Discord.RichEmbed()
              .setColor(color)
              .setTitle("🔔 Event Reminder")
              .setDescription(`Your event, \`${event.name}\`, is happening \`${timeMsg}.\``)
              .setFooter(`Event ID #${event.id} | Use +delete [ID] to cancel this event.`));
            }
          }
        });
      }
    });
  });
}, TIMEOUT);

// login with token (shhh it's a secret)
client.login(config.token);
