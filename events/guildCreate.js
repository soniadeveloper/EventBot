module.exports = (client, guild) => {
  if (guild.available) { // if the guild is available
    function isTxtChannel(channel) { // function that searches for text channels
      return channel.type === "text";
    }
    // filters out channel list to include only text channels
    let chnList = guild.channels.filter(isTxtChannel).array();
    var defaultChn;
    var i = 0;
    while (defaultChn === undefined) { // while the default channel isn't set
      if (chnList[i].permissionsFor(guild.me).has("SEND_MESSAGES")) {
        // if the bot has permission to speak in a channel set it equal
        // the default channel should be the first channel where the bot has speaking permissions
        defaultChn = chnList[i];
      }
      i++;
    }

    console.log(`**New guild joined:** ${guild.name}`);
  }
}
