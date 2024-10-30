const { Client, Collection, Embed } = require("guilded.js");
const fs = require('fs');
const bannedUsers = require("./storage/banned.json"); //imports hard banned users
const mongoWrapper = require("./modules/mongo.js"); //imports custom mongodb wrapper
const { readdir } = require("fs/promises"); //imports reading directory
const { join } = require("path"); //imports tool to write to json
const mongo = require("./modules/mongo.js");
require('dotenv').config()
const client = new Client({ token: process.env.TOKEN });
let tempData = []
let mode = "collect" //Changes mode to collect or ask people questions on data
const commands = new Collection(); //defines command handler
let helpNames = []
let helpDescriptions = []
let helpShortDescriptions = []
let mongoClient;

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function collect(message) {
    tempData.push(message.content)
    if(tempData.length >= 1000) {
        try {
            if(!fs.existsSync("./messages")) {
                fs.mkdirSync("./messages")
            }
            fs.writeFileSync("./messages/"+Date.now()+".json", JSON.stringify(tempData))
        } catch (error) {
        console.log(error)
        }
        tempData = []
    }
}

client.on("ready", () => {console.log(`Bot is successfully logged in`); status()});

let status = async function (status) {
    if (status) {
        await client.setStatus(status)
    }else if (mode == "collect")  {
        await client.setStatus({"content":"Collecting data...", "emoteId": 90002577})
    } else if (mode == "train")  {
        await client.setStatus({"content":"Asking you questions", "emoteId": 90002541})
    }
}


client.on("messageCreated", async (msg) => {
    let sender = await client.members.fetch(msg.serverId, msg.createdById)
    if (bannedUsers[msg.authorId]) return
    let serverSettings = await mongoWrapper.findServerSettings(mongoClient, msg.serverId)
    if (!serverSettings && sender.isOwner === true) { 
        await mongoWrapper.addServer(mongoClient, msg.serverId)
        serverSettings = await mongoWrapper.findServerSettings(mongoClient, msg.serverId)
        msg.reply( {isPrivate: true, embeds: [{title: "This server has been automatically opted into data collection.", description: "This server is now contributing to the auto-mod project, please review your server settings using the command `.settings`. All data is anonymous, though personally identifiable information may be collected on accident. To learn more information please run `.about`"}]})
    }
    try {
        if((serverSettings.allowCollecting === true && mode == "collect" && !msg.content.startsWith(".") && serverSettings.allowedChannels.includes(msg.channelId)) || serverSettings.allowedChannels.length == 0) {
            if(!await mongoWrapper.getUser(mongoClient, msg.authorId)) {
                await mongoWrapper.addUser(mongoClient, msg.authorId)
                await msg.reply( {isPrivate: true, embeds: [{title: "You have been automatically opted into data collection.", description: "This server is contributing to the auto-mod project, if you do not wish to participate, please use the command `.opt out`. All data is anonymous, though personally identifiable information may be collected on accident. To learn more information please run `.about`"}]})
                collect(msg)
            } else if ((await mongoWrapper.getUser(mongoClient, msg.authorId)).opt === true) {
                console.log("collecting")
                collect(msg)
            }
        }
        if(!msg.content.startsWith(".")) return
        let [commandName, ...args] = msg.content.slice(1).trim().split(/ +/);//slices everything into commands and arguments
        commandName = commandName.toLowerCase(); //lowercases command name
        let command = commands.get(commandName) ?? commands.find((x) => x.aliases?.includes(commandName)); // tries to find command
        let commandEnabledForRole;
        if (command || commandName === "help") {
        if (sender.isOwner === true) {
            commandEnabledForRole = true
        } else {
            commandEnabledForRole = false
        }
        if (commandName === "help") {
            if (args.length === 0) {
              let message = "Here's our commands: \n"
              for (let i in helpNames) {
                message += (helpNames[i] + " - " + helpShortDescriptions[i] + "\n")
              }
              await msg.reply(
                new Embed()
                  .setTitle("Help")
                  .setDescription(message)
                  .setColor("BLUE")
                  .setTimestamp()
                  .setFooter("Executed by: " + sender.displayName)
              )
            } else if (helpNames.includes(capitalizeFirstLetter(args[0]))) {
                await msg.reply(
                  new Embed()
                    .setTitle("Help for: " + capitalizeFirstLetter(args[0]))
                    .setDescription(helpDescriptions[helpNames.indexOf(capitalizeFirstLetter(args[0]))])
                    .setColor("BLUE")
                    .setTimestamp()
                    .setFooter("Executed by: " + sender.displayName)
                )
            } else {
                await msg.reply(
                  new Embed()
                      .setTitle("Your command is not found.")
                      .setDescription("Lol, you tried a command that doesn't exist, not really sure what you where thinking...")
                      .setColor("YELLOW")
                      .setTimestamp()
                      .setFooter("Executed by: " + sender.displayName)
                )
            }
         
        } else {
          try {
            await command.execute(msg, args, client, sender, commandEnabledForRole);
          } catch (e) {
              client.messages.send(msg.channelId, "There was an error executing that command!");
              console.error('\x1b[31m\x1b[1m', e);
          }
        }
      }     
    }catch(e) {console.log('\x1b[31m\x1b[1m', e)}
  });

process.on('SIGINT', () => {
    if (!tempData.length > 0)  {process.exit(69)}
    console.log('Saving data...');
    try {
        if(!fs.existsSync("./messages")) {
            fs.mkdirSync("./messages")
        }
        fs.writeFileSync("./messages/"+Date.now()+".json", JSON.stringify(tempData))
    } catch (error) {
        console.log(error)
    }
    process.exit(69);
});

process.on('exit', (code) => {
    if (!tempData.length > 0 || code == 69)  {process.exit(69)}
    console.log('Saving data...');
    try {
        if(!fs.existsSync("./messages")) {
            fs.mkdirSync("./messages")
        }
        fs.writeFileSync("./messages/"+Date.now()+".json", JSON.stringify(tempData))
    } catch (error) {
        console.log(error)
    }
    process.exit(69);
});

void (async () => {
    // read the commands dir and have the file extensions.
    const commandDir = await readdir(join(__dirname, "commands"), { withFileTypes: true });
    mongoClient = await mongoWrapper.openConnection(process.env.MONGO_URI)
    // go through all the files/dirs scanned from the readdir, and make sure we only have js files
    console.log('\x1b[34m\x1b[1m', "Found modules: ")
    for (const file of commandDir.filter((x) => x.name.endsWith(".js"))) {
        console.log('\x1b[34m\x1b[1m', file.name);
        const command = require(join(__dirname, "commands", file.name));
        commands.set(command.name.toLowerCase(), command);
        helpNames.push(command.name)
        helpDescriptions.push(command.description)
        helpShortDescriptions.push(command.shortDescription)
    }

    client.login();
})();
