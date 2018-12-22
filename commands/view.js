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
        msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setTitle(`📅 Event ID ${event.id}`).addField("Event", `${get.name}`).addField("Date", `${date.toDateString()}`).addField("Time", `${time}`).addField("Description", `${get.desc}`).addField("✅ Attending", attStr).addField("❓ Might go", mayStr).addField("❌ Can't go", cantStr));
      }
    });
  }
},}
