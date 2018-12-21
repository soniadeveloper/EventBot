module.exports = (client) => { // runs when the bot is logged in
  console.log(`Logged in as ${client.user.tag}! `);
  client.user.setActivity("Logging events... (+help)"); // sets the "game" activity
  // client.db.run(`DELETE FROM calendar WHERE guild = ?`, ["473881982363762688"], (err) => {
  //   if (err) {
  //     console.error(err.message);
  //   }
  //   console.log("server deleted");
  // });
}
