module.exports = {name: "events", run(client, msg, args) {
  client.db.get(`SELECT events FROM calendar WHERE guild = ${msg.guild.id}`, (err, row) => {
    if (err) { // if an error occured
      console.error(err);
      client.db.run("CREATE TABLE IF NOT EXISTS calendar (guild TEXT, event TEXT, notifs INTEGER)"); // create the table
      var bigObj = {
        list: []
      };
      client.db.run("INSERT INTO calendar (guild, event, notifs) VALUES (?, ?, ?)" [msg.guild.id, JSON.stringify(bigObj), 1], (err) => {
        if (err) {
          console.error("Events.js insertion error: ", err);
        }
        console.log("row created");
        msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle(`📅 ${msg.guild.name}'s Events'`).setDescription("This server has no events.")); // insert row into table since it was just created
      });
    }

    if (!row) { // if the server does not exist in the database

      var bigObj = {
        list: []
      };
      client.db.run("INSERT INTO calendar (guild, event, notifs) VALUES (?, ?, ?)" [msg.guild.id, JSON.stringify(bigObj), 1], (err) => {
        if (err) {
          console.error("Events.js insertion error: ", err);
        }
        console.log("row created");
        msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle(`📅 ${msg.guild.name}'s Events`).setDescription("This server has no events.")); // insert row into table since it was just created
      });
    }

    else { // if the server exists in the database
      console.log(events);
        var parse = "";
        for (var i = 0; i < events.list.length; i++) {
          console.log(events.list[i]);
          var event = events.list[i];
          parse += "**ID:** ";
          parse += `\`${event.id}\``;
          console.log("Event id:", event.id);
          parse += " ";
          parse += "**Name:** ";
          parse += event.name;
          console.log("Event name:", `\`event.name\``);
          parse += "\n";
        }
        msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle(`📅 ${msg.guild.name}'s Events`).setDescription(parse));
      }
  });
},}
