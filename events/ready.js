module.exports = (client) => { // runs when the bot is logged in
  console.log(`Logged in as ${client.user.tag}! `);
  client.user.setActivity("Logging events... (+help)"); // sets the "game" activity
}
