const { Client } = require("guilded.js");
const fs = require('fs');
require('dotenv').config()
// import { Client } from "guilded.js";
const client = new Client({ token: process.env.TOKEN });
let mode = "collect"
let tempData = []

client.on("ready", () => console.log(`Bot is successfully logged in`));
if (mode == "collect")  {
    client.on("messageCreated", (message) => {
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
    });
}

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
client.login();