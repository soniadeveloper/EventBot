module.exports = {name: "notifs", run(client, msg, args){
  var status = args[0];
  var num;
  if (args.length === 0) {
    client.db.get(`SELECT * FROM calendar WHERE guild = ${msg.guild.id}`, (err, row) => {
      if (err) {
        console.error("Notifs.js selection error: ", err);
      }
      if (!row) {
        var obj = {
          list: []
        };
        var string = JSON.stringify(obj);
        client.db.run(`INSERT INTO calendar (guild, events, notifs) VALUES (?, ?, ?)`, [msg.guild.id, string, 1], (err) => {
          if (err) {
            console.error("Notifs.js insertion error: ", err);
          }
          msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setDescription(`🔔 Notifications are currently **ON**`));
        });
      }
      else {
        var currStatus;
        if (row.notifs === 1) {
          currStatus = "ON";
          msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setDescription(`🔔 Notifications are currently **ON**`));
        }
        else {
          currStatus = "OFF";
          msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setDescription(`🔕 Notifications are currently **OFF**`));
        }
      }
    });
  }
  if (status.toLowerCase() === "on") {
    client.db.run("UPDATE calendar SET notifs = ? WHERE guild = ?", [num, msg.guild.id], (err) => {
      if (err) {
        console.error("Notifs.js update error: ", err);
      }
      msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setDescription(`🔔 Notifications have been turned **ON**`));
    });
  }
  else if (status.toLowerCase() === "off"){
    num = 0;
    client.db.run("UPDATE calendar SET notifs = ? WHERE guild = ?", [num, msg.guild.id], (err) => {
      if (err) {
        console.error(err);
      }
      msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setDescription(`🔕 Notifications have been turned **OFF**`));
    });
  }
  else {
    msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setDescription("❗️ That is not a valid response!"));
  }
},}
