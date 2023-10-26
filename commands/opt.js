async function func(msg, args, client, sender, commandenabledforrole) {
  const { Embed } = require("guilded.js");
  const mongo = require("../modules/mongo");
  require('dotenv').config()
  try {
    const mongoClient = await mongo.openConnection(process.env.MONGO_URI);
    if (args[0] == "in") {
      toOpt = true
    } else if (args[0] == "out") {
      toOpt = false
    } else {
      msg.reply(new Embed()
        .setTitle("We couldn't understand your input.")
        .setDescription("Try using `in` or `out` to opt in or out.")
        .setColor("YELLOW")
        .setTimestamp()
        .setFooter("Executed by: " + sender.displayName)            
      )
      return
    }
    await mongo.opt(mongoClient, msg.author.id, toOpt)
    msg.reply(
      new Embed()
        .setTitle("Successfully opted " + args[0] + " of tracking.")
        .setDescription("We successfully opted you " + args[0] + " of tracking!")
        .setColor("RED")
        .setTimestamp()
        .setFooter("Executed by: " + sender.displayName)
    )
    } catch (e) {
      msg.reply(new Embed()
        .setTitle("An error occurred.")
        .setDescription("An error occurred while trying to opt you in or out of tracking." + e)
        .setColor("YELLOW")
        .setTimestamp()
        .setFooter("Executed by: " + sender.displayName)      
      )
  }
}

module.exports = {
    aliases: ["opt"],
    execute: func,
    name: "Opt",
    description: "Opt in or out of tracking. `opt <required-in/out>`",
    shortDescription: "Opt out of tracking. `opt <required-in/out>`"
};