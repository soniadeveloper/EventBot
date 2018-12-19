module.exports = {name: "create", run(client, msg, args){
  var event = new Object(); // name, date, time, desc
  var forceEnd = false; // determines if the collector was forced to forceEnd
  var d = new Date();
  var time;
  var desc;

  msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle("📅 Event Creation Wizard").setDescription("Welcome to the Event Creation Wizard!\n`What would you like to name your event?`").setFooter("Type \"exit\" to leave the creation wizard at any time."));

  // start collector
  collector.on("collect", m => {
    if (m.content === "exit") {
      forceEnd = true;
      collector.stop();
    }
    else {
      if (event.name === undefined) { // if the event has not been given a name
        event.name = m.content;
        msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle("📅 Event Creation Wizard").addField("Event", `${event.name}`).setDescription(`\`What time is the event taking place?\``));
      }
      else if (event.date === undefined && event.name !== undefined) {
        //if the event has not been given a date
        var split = m.content.split('/');
        split[0] = parseInt(split[0]); //month
        split[1] = parseInt(split[1]); //day
        split[2] = parseInt(split[2]); //year
        d.setMonth(split[0] - 1, split[1]);
        d.setYear(split[2]);
        event.date = split;
        console.log("Date: ", d.getMonth(), d.getDay(), d.getFullYear());
        client.discord.RichEmbed().setColor(client.color).setTitle("📅 Event Creation Wizard").addField("Event", `${event.name}`).addField("Date", `${d.toDateString()}`).setDescription(`\`What time is the event taking place?\``));
      }
      else if (event.time === undefined && event.desc === undefined && event.date !== undefined && event.name !== undefined) { // if the time hasn't been defined yet
        time = m.content;
        var split = m.content.split(':');
        split[0] = parseInt(split[0]);
        var moreSplit = split[1].split(' ');
        moreSplit[0] = parseInt(moreSplit[0]);
        var tod = moreSplit[1];
        if (tod === "PM" && split[0] < 12) { // if it is night time add military time
          split[0] += 12;
        }
        else if (tod === "AM" && split[0] > 11) { // if it is supposed to be midnight change the time to 0
          split[0] = 0;
        }
        split[1] = moreSplit[0];
        d.setHours(split[0], split[1], 0);
        event.time = split;
        console.log("Time: ", event.time);
        msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle("📅 Event Creation Wizard").addField("Event", `${event.name}`).addField("Date", `${d.toDateString()}`).addField("Time", `${time}`).setDescription(`\`What is the description of the event?\``).setFooter("Type \"exit\" to leave the creation wizard at any time"));
      }
      else if (event.desc === undefined && event.time !== undefined && event.date !== undefined && event.name !== undefined) { // if the description hasn't been defined yet
        console.log(m.content);
        var desc = m.content;
        event.desc = desc;
        console.log("event description: ", event.desc);
        msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle("📅 Event Creation Wizard").addField("Event", `${event.name}`).addField("Date", `${d.toDateString()}`).addField("Time", `${time}`).addField("Description", `${desc}`).setDescription(`\`Is this correct? Type YES to confirm.\``).setFooter("Type \"exit\" to leave the creation wizard at any time"));
      }
      else if (event.desc !== undefined && m.content.toLowerCase() === "yes") {
        collector.stop();
      }
    }
  });
  collector.on("end", c => { // when the collection has stopped
    console.log(forceEnd);
    if (forceEnd == true) { // if the collector has been forced to end
      msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle("📅 Event Creation Wizard").setDescription("Event creation has been cancelled"));
    }
    else { // if all the parameters have been given
      msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle("📅 Event Creation Wizard").addField("ID", `${event.id}`).addField("Event", `${event.name}`).addField("Date", `${d.toDateString()}`).addField("Time", `${time}`).addField("Description", `${event.desc}`).setDescription(`✅ \`Event has been created!\``)).then(m => {
        event.id = m.id;
        event.fullDate = d; // the full date object
        event.attending = [];
        event.cantGo = [];
        event.maybe = [];
        console.log(event);
        m.react("✅").then(console.log("check")).catch(console.error);
        m.react("❓").then(console.log("question")).catch(console.error);
        m.react("❌").then(console.log("x")).catch(console.error);
        client.db.get(`SELECT events FROM calendar WHERE guild = ${msg.guild.id}`, (err, row) => {
        if (!row) {
          var obj = {
            list: [event]
          };
          var newEvents = JSON.stringify(obj);
          client.db.run("INSERT INTO calendar (guild, events, notifs) VALUES (?, ?, ?)", [msg.guild.id, newEvents, 1], (err) => {
            if (err) {
              console.error(err);
            }
            console.log("Object after insertion: ", this.event);
          });
        }
        else {
          var old = JSON.parse(row.event);
          old.list.push(event);
          var newEvent = JSON.stringify(old);
          client.db.run("UPDATE calendar SET events = ? WHERE guild = ?", [newEvent, msg.guild.id], (err) => {
            if (err) {
              console.error(err);
            }
            console.log("Updated object after insertion: ", this.event);
          });
        }
      });
    }).catch(console.error);
    }
  });
},}
