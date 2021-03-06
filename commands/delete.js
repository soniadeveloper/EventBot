module.exports = {name: "delete", run(client, msg, args){
  if (args.length === 0) { // if no argument is given
    msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setDescription("❗️Please give an event ID!"));
  }
  else {
    var toDel = args[0];
    var toDelFull;
    client.db.get(`SELECT events FROM calendar WHERE guild = ${msg.guild.id}`, (err, row) => {
      if (err) { // if an error occurs
        console.log("no the error is here");
        console.error("Delete.js selection error: ", err.message);
        msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setDescription("❗️This server has no events to delete!"));
      }
      if (!row) { // if the server does not have any events
        msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setDescription("❗️This server has no events to delete!"));
      }
      var json = JSON.parse(row.events);
      json.list = json.list.filter((event) => { // filter out the current array of events to exclude the array that will be deleted
        if (event.id !== toDel) {
          return event;
        }
        else {
          toDelFull = event;
        }
      });
      var insert = JSON.stringify(json); // updated array
      console.log(typeof insert);
      client.db.run(`UPDATE calendar SET events = ? WHERE guild = ?`, [insert, msg.guild.id], (err) => {
        if (err) {
          console.error("Delete.js update error: ", err.message);
        }
        else {
          msg.channel.fetchMessage(toDel).then(m => {
            m.delete();
          });
          msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setDescription(`🗑 Event \`${toDel}: ${toDelFull.name}\` has been deleted!`));
        }
      });
    });
  }
},}
