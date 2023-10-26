async function func(msg, args, client, sender, commandenabledforrole) {
  const { Embed } = require("guilded.js");
  const mongo = require("../modules/mongo");
  require('dotenv').config()
  if (!commandenabledforrole) {
    msg.reply(new Embed()
      .setTitle("You don't have permission to use this command.")
      .setDescription("You need to be the owner to use this command.")
      .setColor("YELLOW")
      .setTimestamp()
      .setFooter("Executed by: " + sender.displayName)            
    )
    return
  }
  try {
    const mongoClient = await mongo.openConnection(process.env.MONGO_URI);
    let toReturn = ""
    if (args.length == 0) {
      msg.reply(new Embed()
        .setTitle("Please supply an argument. (allowedChannels, allowTraining, allowCollection)")
        .setDescription("Allowed channels selects channels that the bot is allowed to collect data from. Allow training allows the bot to ask questions on pre-collected data. Allow collection allows the bot to collect your messages. allowedChannels accept 4 arguments (add <channelID>, remove <channelID>, list, clear). allowTraining and allowCollection accept 2 arguments (on, off).")
        .setColor("YELLOW")
        .setTimestamp()
        .setFooter("Executed by: " + sender.displayName)            
      )
      return
    } else if (args[0] == "allowTraining") {
      if (args[1] == "on") {
        await mongo.updateServerSettings(mongoClient, {serverID: msg.serverId}, {$set: {allowTraining: true}})
        toReturn = 'Allowed training for this server.'
      } else if (args[1] == "off") {
        await mongo.updateServerSettings(mongoClient, {serverID: msg.serverId}, {$set: {allowTraining: false}})
        toReturn = 'Denied training for this server.'
      } else {
        toReturn = 'Please supply an argument. (on, off)'
      }
    } else if (args[0] == "allowCollection") {
      if (args[1] == "on") {
        await mongo.updateServerSettings(mongoClient, {serverID: msg.serverId}, {$set: {allowCollecting: true}})
        toReturn = 'Allowed message collection for this server.'
      } else if (args[1] == "off") {
        await mongo.updateServerSettings(mongoClient, {serverID: msg.serverId}, {$set: {allowCollecting: false}})
        toReturn = 'Denied message collection for this server.'
      } else {
        toReturn = 'Please supply an argument. (on, off)'
      }
    } else if (args[0] == "allowedChannels") {
      if (args[1] == "add") {
        await mongo.updateServerSettings(mongoClient, {serverID: msg.serverId}, {$push: {allowedChannels: args[2]}})
        toReturn = `Added channel (${args[2]}) to allowed channels.`
      } else if (args[1] == "remove") {
        await mongo.updateServerSettings(mongoClient, {serverID: msg.serverId}, {$pull: {allowedChannels: args[2]}})
        toReturn = `Removed channel (${args[2]}) from allowed channels.`
      } else if (args[1] == "list") {
        let serverSettings = await mongo.findServerSettings(mongoClient, msg.serverId)
        toReturn = `Allowed channels: ${serverSettings.allowedChannels.join(", ")}`
      } else if (args[1] == "clear") {
        await mongo.updateServerSettings(mongoClient, {serverID: msg.serverId}, {$set: {allowedChannels: []}})
        toReturn = `Cleared allowed channels.`
      } else { 
        toReturn = 'Please supply an argument. (add, remove, list, clear)'
      }
    }
    msg.reply(
      new Embed()
        .setTitle("Update Settings.")
        .setDescription(toReturn)
        .setColor("GREEN")
        .setTimestamp()
        .setFooter("Executed by: " + sender.displayName)
    )
  } catch (e) {
    msg.reply(new Embed()
      .setTitle("An error occurred.")
      .setDescription("An error occurred while trying to change your server settings. Please try again later." + e)
      .setColor("YELLOW")
      .setTimestamp()
      .setFooter("Executed by: " + sender.displayName)      
    )
  }
}

module.exports = {
    aliases: ["settings"],
    execute: func,
    name: "Settings",
    description: "Change server settings. `settings <required-allowTraining/allowCollection/allowedChannels> <required-on/off/add/remove/list/clear>`",
    shortDescription: "Change server settings. `settings`"
};