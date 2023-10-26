async function func(msg, args, client, sender, commandenabledforrole) {
    const { Embed } = require("guilded.js");
    msg.reply(new Embed()
        .setTitle("About Ears")
        .setDescription("Ears is an open-source training bot with the purpose of training an AI to understand the difference between disrespectful and respectful messages. We are trying to keep your community unified by identifying potential slurs, bypassed swear words, or even just giving a rating of how friendly users are. Ears does not collect any personal information about your Guilded account, however as it listens to all messages, it may store personally identifiable information transmitted in messages. Neither Ears, nor its developers are responsible for any misuse of Ears, nor are they responsible for any damages that may occur from using Ears improperly.")
        .setColor("GREEN")
        .setTimestamp()
        .setFooter("Executed by: " + sender.displayName)      
    )
  }
  
module.exports = {
    aliases: ["about"],
    execute: func,
    name: "About",
    description: "About Ears. `about`",
    shortDescription: "About Ears. `about`"
};