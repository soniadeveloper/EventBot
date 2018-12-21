module.exports = {name: "invite", run(client, msg, args){
  msg.channel.send(new client.discord.RichEmbed().setColor(client.color).setDescription(`Invite Event Bot to your server!\n[Invite Link](https://discordapp.com/oauth2/authorize?client_id=511248330425237504&scope=bot&permissions=8)`));
},}
