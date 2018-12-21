module.exports = {name: "info", run(client, msg, args) {
  msg.channel.send(new client.discord.RichEmbed()
  .setColor(client.color)
  .setTitle("About Event Bot")
  .setThumbnail(msg.guild.me.user.avatarURL);
  .addField("Creator", client.users.get(client.config.owner_id), true)
  .addField("Currently in", `${client.guilds.array().length} servers`, true)
  .addField("Language", "Discord.JS (Node.JS) + SQLite", true)
  .addField("Created at", client.user.createdAt, true)
  .setFooter("Thank you for using Event Bot!"));
},}
