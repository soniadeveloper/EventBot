module.exports = {name: "view", run(client, msg, args) {
  if (args.length === 0) {
    msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setDescription("❗️Please give an event ID!"));
  }
  else {
    var toView = args[0]; // id of the event to view
    client.db.get(`SELECT events FROM calendar WHERE guild = ${msg.guild.id}`, (err, row) => {
      if (err) { // if there is an error
        console.error("View.js selection error: ", err);
      }
      if (!row) { // if the server does not exist in the database
        msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setDescription("❗️That event does not exist!"));
      }
      else {
        var json = JSON.parse(row.events);
        var get;
        for (var i = 0; i < json.list.length; i++) {
          var event = json.list[i];
          if (event.id === toView) {
            get = event;
          }
        }
        console.log(Date.parse(get.fullDate));
        var date = new Date(Date.parse(get.fullDate));

        var hour = date.getHours(); // hours
        var min = date.getMinutes(); // minutes
        var tod;

        // adjust hours
        if (hour == 0) {
          hour = 12;
          tod = "AM";
        }
        else if (hour > 12) {
          hour -= 12;
          tod = "PM";
        }
        else {
          tod = "AM";
        }

        // adjust minutes
        if (min < 10) {
          min = "0" + min;
        }
        else {
          min = "" + min;
        }

        var time = `${hour}:${min} ${tod}`; // formatted time

        // generate list of people who are going
        var attending = json.list[json.list.length - 1].attending;
        var attStr = "";
        for (var i = 0; i < attending.length; i++) {
          var usr = client.users.get(attending[i]);
          attStr += `${msg.guild.member(usr).displayName}, `;
        }
        if (attStr === "") {
          attStr = "None";
        }

        // people who might go
        var maybe = json.list[json.list.length - 1].maybe;
        var mayStr = "";
        for (var i = 0; i < maybe.length; i++) {
          var usr = client.users.get(maybe[i]);
          mayStr += `${msg.guild.member(usr).displayName}, `;
        }
        if (mayStr === "") {
          mayStr = "None";
        }
        // people who can't go
        var cant = json.list[json.list.length - 1].cantGo;
        var cantStr = "";
        for (var i = 0; i < cant.length; i++) {
          var usr = client.users.get(cant[i]);
          cantStr += `${msg.guild.member(usr).displayName}, `;
        }
        if (cantStr === "") {
          cantStr = "None";
        }

        // send message
        msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle(`📅 Event ID ${event.id}`).addField("Event", `${get.name}`).addField("Date", `${date.toDateString()}`).addField("Time", `${time}`).addField("Description", `${get.desc}`).addField("✅ Attending", attStr).addField("❓ Might go", mayStr).addField("❌ Can't go", cantStr)).then(
          // allow responses to be re-added

          // collects reactions
          const emojis = { // stores emojis
            GOING: "✅",
            MAYBE: "❓",
            NO: "❌"
          };
          const reactCollector = new client.discord.ReactionCollector(m,  (r, user) => Object.values(emojis).includes(r.emoji.name), {maxUsers: msg.guild.memberCount});
          reactCollector.on("collect", (r, coll) => {
              switch(r.emoji.name) {
                case emojis.GOING: // if the checkmark is clicked
                  client.db.get(`SELECT events FROM calendar WHERE guild = ${msg.guild.id}`, (err, row) => {
                    var events = JSON.parse(row.events);
                    var index;
                    var get = events.list.filter(e => { // get the event to update
                      if (e.id === event.id) {
                        index = events.list.indexOf(e);
                        return e;
                      }
                    });
                    var userArr = coll.users.array();
                    var user = userArr[userArr.length - 1];
                    events.list.splice(index, 1);
                    let alreadyGoing = false;
                    if (get[0].attending.includes(user.id)) {
                      alreadyGoing = true;
                      events.list.push(get[0]);
                    }
                    if (user.id !== client.config.bot_id && !alreadyGoing) {
                      get[0].attending.push(user.id);
                      events.list.push(get[0]);
                      var send = JSON.stringify(events);
                      client.db.run(`UPDATE calendar SET events = ? WHERE guild = ?`, [send, msg.guild.id], (err) => {
                        if (err) {
                          console.error("create.js update error: ", err);
                        }
                        // get name of user who clicked the reaction
                        var name;
                        msg.guild.fetchMember(user.id).then(usr => {name = usr.displayName});
                        // generate list of people who are going
                        var attending = events.list[events.list.length - 1].attending;
                        var attStr = "";
                        for (var i = 0; i < attending.length; i++) {
                          var usr = client.users.get(attending[i]);
                          attStr += `${msg.guild.member(usr).displayName}, `;
                        }

                        // people who might go
                        var maybe = events.list[events.list.length - 1].maybe;
                        var mayStr = "";
                        for (var i = 0; i < maybe.length; i++) {
                          var usr = client.users.get(maybe[i]);
                          mayStr += `${msg.guild.member(usr).displayName}, `;
                        }
                        if (mayStr === "") {
                          mayStr = "None";
                        }
                        // people who can't go
                        var cant = events.list[events.list.length - 1].cantGo;
                        var cantStr = "";
                        for (var i = 0; i < cant.length; i++) {
                          var usr = client.users.get(cant[i]);
                          cantStr += `${msg.guild.member(usr).displayName}, `;
                        }
                        if (cantStr === "") {
                          cantStr = "None";
                        }
                        m.edit(new client.discord.RichEmbed().setColor(client.color).setTitle("📅 Event Creation Wizard").addField("Event", `${event.name}`).addField("Date", `${d.toDateString()}`).addField("Time", `${time}`).addField("Description", `${event.desc}`).addField(`${emojis.GOING} Attending`, `${attStr}`).addField(`${emojis.MAYBE} Might go`, `${mayStr}`).addField(`${emojis.NO} Can't go`, `${cantStr}`).setDescription(`✅ \`Event has been created!\``)).then(msg => {
                          msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle(`📅 Event: ${event.name}`).setDescription(`${emojis.GOING} \`${name}\` is going to \`${get[0].name}\`!`));
                        }).catch(console.error);
                      });
                    }
                  });
                break;

                case emojis.MAYBE: // if the question mark is clicked
                  client.db.get(`SELECT events FROM calendar WHERE guild = ${msg.guild.id}`, (err, row) => {
                    var events = JSON.parse(row.events);
                    var index;
                    var get = events.list.filter(e => { // get the event to update
                      if (e.id === event.id) {
                        index = events.list.indexOf(e);
                        return e;
                      }
                    });
                    events.list.splice(index, 1);
                    var userArr = coll.users.array();
                    var user = userArr[userArr.length - 1];
                    let alreadyMaybe = false;
                    if (get[0].maybe.includes(user.id)) {
                      alreadyMaybe = true;
                      events.list.push(get[0]);
                    }
                    if (user.id !== client.config.bot_id && !alreadyMaybe) {
                      get[0].maybe.push(user.id);
                      events.list.push(get[0]);
                      var send = JSON.stringify(events);
                      client.db.run(`UPDATE calendar SET events = ? WHERE guild = ?`, [send, msg.guild.id], (err) => {
                        if (err) {
                          console.error("create.js update error: ", err);
                        }
                        var name;
                        msg.guild.fetchMember(user.id).then(usr => {name = usr.displayName});
                        var attending = events.list[events.list.length - 1].attending;
                        var attStr = "";
                        //attending
                        for (var i = 0; i < attending.length; i++) {
                          var usr = client.users.get(attending[i]);
                          attStr += `${msg.guild.member(usr).displayName}, `;
                        }
                        if (attStr === "") {
                          attStr = "None";
                        }
                        //maybe
                        var maybe = events.list[events.list.length - 1].maybe;
                        var mayStr = "";
                        for (var i = 0; i < maybe.length; i++) {
                          var usr = client.users.get(maybe[i]);
                          mayStr += `${msg.guild.member(usr).displayName}, `;
                        }
                        //cant
                        var cant = events.list[events.list.length - 1].cantGo;
                        var cantStr = "";
                        for (var i = 0; i < cant.length; i++) {
                          var usr = client.users.get(cant[i]);
                          cantStr += `${msg.guild.member(usr).displayName}, `;
                        }
                        if (cantStr === "") {
                          cantStr = "None";
                        }
                        m.edit(new client.discord.RichEmbed().setColor(client.color).setTitle("📅 Event Creation Wizard").addField("Event", `${event.name}`).addField("Date", `${d.toDateString()}`).addField("Time", `${time}`).addField("Description", `${event.desc}`).addField(`${emojis.GOING} Attending`, `${attStr}`).addField(`${emojis.MAYBE} Might go`, `${mayStr}`).addField(`${emojis.NO} Can't go`, `${cantStr}`).setDescription(`✅ \`Event has been created!\``)).then(m => {
                          msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle(`📅 Event: ${event.name}`).setDescription(`${emojis.MAYBE} \`${name}\` might go to \`${get[0].name}\`!`));
                        }).catch(console.error);
                      });
                    }
                  });
                break;

                case emojis.NO: // if the x is clicked
                  client.db.get(`SELECT events FROM calendar WHERE guild = ${msg.guild.id}`, (err, row) => {
                    var events = JSON.parse(row.events);
                    var index;
                    var get = events.list.filter(e => { // get the event to update
                      if (e.id === event.id) {
                        index = events.list.indexOf(e);
                        return e;
                      }
                    });
                    events.list.splice(index, 1);
                    var userArr = coll.users.array();
                    var user = userArr[userArr.length - 1];
                    let alreadyCant = false;
                    if (get[0].cantGo.includes(user.id)) {
                      alreadyCant = true;
                      events.list.push(get[0]);
                    }
                    if (user.id !== client.config.bot_id && !alreadyCant) {
                      get[0].cantGo.push(user.id);
                      events.list.push(get[0]);
                      var send = JSON.stringify(events);
                      client.db.run(`UPDATE calendar SET events = ? WHERE guild = ?`, [send, msg.guild.id], (err) => {
                        if (err) {
                          console.error("create.js update error: ", err);
                        }
                        var name;
                        // attending
                        msg.guild.fetchMember(user.id).then(usr => {name = usr.displayName});
                        var attending = events.list[events.list.length - 1].attending;
                        var attStr = "";
                        for (var i = 0; i < attending.length; i++) {
                          var usr = client.users.get(attending[i]);
                          attStr += `${msg.guild.member(usr).displayName}, `;
                        }
                        //maybe
                        var maybe = events.list[events.list.length - 1].maybe;
                        var mayStr = "";
                        for (var i = 0; i < maybe.length; i++) {
                          var usr = client.users.get(maybe[i]);
                          mayStr += `${msg.guild.member(usr).displayName}, `;
                        }
                        if (mayStr === "") {
                          mayStr = "None";
                        }
                        //cannot
                        var cant = events.list[events.list.length - 1].cantGo;
                        var cantStr = "";
                        for (var i = 0; i < cant.length; i++) {
                          var usr = client.users.get(cant[i]);
                          cantStr += `${msg.guild.member(usr).displayName}, `;
                        }
                        m.edit(new client.discord.RichEmbed().setColor(client.color).setTitle("📅 Event Creation Wizard").addField("Event", `${event.name}`).addField("Date", `${d.toDateString()}`).addField("Time", `${time}`).addField("Description", `${event.desc}`).addField(`${emojis.GOING} Attending`, `${attStr}`).addField(`${emojis.MAYBE} Might go`, `${mayStr}`).addField(`${emojis.NO} Can't go`, `${cantStr}`).setDescription(`✅ \`Event has been created!\``)).then(m => {
                          msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle(`📅 Event: ${event.name}`).setDescription(`${emojis.NO} \`${name}\` cannot go to \`${get[0].name}\`!`));
                        }).catch(console.error);
                      });
                    }
                  });
                break;
              }
        ).catch(err => {console.error("err at sending view.js message", err.message)});
      }
    });
  }
},}
