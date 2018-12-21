module.exports = (client, guild) => {
  if (guild.available) {
    client.db.get(`SELECT guild, events, notifs, channel FROM calendar WHERE guild = ${guild.id}`, (err, row) => {
      if (err) {
        console.error(err.message);
      }
      if (row) {
        client.db.run(`DELETE FROM calendar WHERE guild = ${guild.id}`, (err) => {
          if (err) {
            console.error(err.message);
          }
          console.log(`Event bot has been removed from ${guild.name}.`);
        });
      }
    });
  }
}
