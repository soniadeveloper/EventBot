module.exports = (client, msg) => {
  if (msg.author.bot) return; // the bot shouldn't respond to other bots
  const prefix = client.prefix;

  if (msg.content.startsWith(prefix)) {
    // command handler

    // splits arguments from prefix
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = client.commands.get(args.shift().toLowerCase());
    if (!cmd || cmd === null) return;
    cmd.run(client, msg, args);
  }
}
