module.exports = {name: "help", run(client, msg, args) {
  msg.channel.send(new client.discord.RichEmbed()
  .setColor(client.color)
  .setTitle("❔ Help")
  .setDescription("Here is a list of things that Event Bot can do!")
  .addField("`create`", "Walks you through the Event Creation Wizard.")
  .addField("`delete [ID]`", "Deletes an event with the given Event ID.")
  .addField("`events`", "List the events created in the server.")
  .addField("`view [ID]`", "View details of an event with a given ID")
  .addField("`notifs [ON/OFF]`", "Change the notification settings in the server.")
  .addField("`channel [name/RESET]`", "Set the channel where event notifications are sent.")
  .addField("`invite`", "Creates an invite link to add Event Bot to other servers.")
  .addField("`info`", "Sends information about Event Bot.")
  .setFooter("Event Bot"));
},}
