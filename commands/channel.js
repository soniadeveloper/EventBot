module.exports = {name: "channel", run(client, msg, args) {
  if (args.length === 0) { // if no argument was given
    var chName;
    client.db.get(`SELECT channel FROM calendar WHERE guild = ${msg.guild.id}`, (err, row) => {
      if (err) {
        console.error("Error in channel.js selection: ", err.message);
      }
      if (!row) {
        var obj = {
          list: []
        };
        var str = JSON.stringify(obj);
        client.db.run("INSERT INTO calendar (guild, events, notifs, channel) VALUES (?, ?, ?, ?)", [msg.guild.id, str, 1, "010010001110"], (err) => {
          if (err) {
            console.error("Error in channel.js insertion: ", err.message);
          }
        });
        chName = "any channel";
        msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setDescription(`Notifications are set to be sent to \`${chName}\`\nUse \`+channel [channel name]\` to set the channel notifications are sent to`));
      }
      if (row.channel === "010010001110" || row.channel === null || row.channel === undefined) {
        console.log("name is null");
        chName = "any channel";
        msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setDescription(`Notifications are set to be sent to \`${chName}\`\nUse \`+channel [channel name]\` to set the channel notifications are sent to`));
      }
      else {
        chName = msg.guild.channels.get(row.channel).name;
        msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setDescription(`Notifications are set to be sent to \`${chName}\`\nUse \`+channel [channel name]\` to set the channel notifications are sent to`));
      }
    });
  }
  else { // if an argument was given

    if (args[0].toLowerCase() === "reset") { // if the channel should reset
      client.db.get(`SELECT channel FROM calendar WHERE guild = ${msg.guild.id}`, (err, row) => {
        if (err) {
          console.error(err.message);
        }
        else if (!row) {
          client.db.run("INSERT INTO calendar (guild, events, notifs, channel) VALUES (?, ?, ?, ?)", [msg.guild.id, str, 1, "010010001110"], (err) => {
            if (err) {
              console.error("Error in channel.js insertion: ", err.message);
            }
          });
        }
        else {
          client.db.run(`UPDATE calendar SET channel = ? WHERE guild = ?`, ["010010001110", msg.guild.id], (err) => {
            if (err) {
              console.error("channel.js update error: ", err.message);
            }
          });
        }
        msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setDescription("✅ Notification channel has been reset."));
      });
    }

    else { // if the channel should be specified
      var chName = args[0];
      var channel = msg.guild.channels.find("name", args[0]);
      if (!channel || channel === undefined) { // if the channel was not found OR if channel = any
        msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setDescription("❗️ Invalid channel name!")).then(msg => {
          msg.delete(5000);
        }).catch(console.error);
      }
      else {
        var id = channel.id;
        client.db.get(`SELECT channel FROM calendar WHERE guild = ${msg.guild.id}`, (err, row) => {
          if (err) {
            command.error("channel.js selection error: ", err.message);
          }
          else if (!row) {
            client.db.run("INSERT INTO calendar (guild, events, notifs, channel) VALUES (?, ?, ?, ?)", [msg.guild.id, str, 1, id], (err) => {
              if (err) {
                console.error("Error in channel.js insertion: ", err.message);
              }
              msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setDescription(`✅ Notification channel has been set to \`${msg.guild.channels.get(id).name}\`!`));
            });
          }
          else {
            client.db.run(`UPDATE calendar SET channel = ? WHERE guild = ?`, [id, msg.guild.id], (err) => {
              if (err) {
                console.error("channel.js update error: ", err.message);
              }
              msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setDescription(`✅ Notification channel has been set to \`${msg.guild.channels.get(id).name}\`!`));
            });
          }
        });
      }
    }
  }
},}
