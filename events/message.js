module.exports = (client, msg) => {
  if (msg.author.bot) return; // the bot shouldn't respond to other bots
  let prefix;

  if (msg.guild !== null && client.prefixes.get(msg.guild.id) === null || client.prefixes.get(msg.guild.id) === undefined) {
    client.prefixes.set(msg.guild.id, client.prefix);
  }

  else if (msg.guild === null) {
    prefix = client.prefix;
  }

  prefix = (client.prefixes.get(msg.guild.id) !== null) ? client.prefixes.get(msg.guild.id) : client.prefix;

  if (msg.content.startsWith(prefix)) {
    // command handler

    // splits arguments from prefix
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = client.commands.get(args.shift().toLowerCase());
    if (!cmd || cmd === null) return;
    cmd.run(client, msg, args);
  }
}
