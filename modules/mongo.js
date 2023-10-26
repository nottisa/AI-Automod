const { MongoClient } = require("mongodb");

async function openConnection(uri) {
  mongoClient = new MongoClient(uri);
  try {
    await mongoClient.connect();
    await mongoClient.db("Ears").command({ ping: 1 });
  } catch (e) {
    mongoClient.close();
  } finally {
    return mongoClient;
  }
}

async function findServerSettings(mongoClient, server) {
  try {
    const settingsCollections = await mongoClient.db("Ears").collection("ServerSettings")
    return await settingsCollections.findOne({ serverID: server })
  } catch(e) {
    console.log(e)
  }
}

async function updateServerSettings(mongoClient, server, settings) {
  try {
    const settingsCollections = await mongoClient.db("Ears").collection("ServerSettings")
    return await settingsCollections.updateOne(server, settings);
  } catch(e) {
    console.log(e)
  }
}  

async function addServer(mongoClient, server) {
  try {
    const settingsCollections = await mongoClient.db("Ears").collection("ServerSettings")
    await settingsCollections.insertOne({ serverID: server, allowTraining: true, allowCollecting: true, allowedChannels: []})
  } catch (e) {
    console.log(e)
  }
}



async function removeData(mongoClient, server) {
  try {
    const settingsCollections = await mongoClient.db("Ears").collection("ServerSettings")
    await settingsCollections.deleteOne({ serverID: server})
  } catch (e) {
    console.log(e)
  }
}

async function addUser(mongoClient, id) {
  try {
    const userCollections = await mongoClient.db("Ears").collection("userSettings")
    await userCollections.insertOne({ userID: id, opt: true})
  } catch (e) {
    console.log(e)
  }
}

async function getUser(mongoClient, id) {
  try {
    const userCollections = await mongoClient.db("Ears").collection("userSettings")
    return await userCollections.findOne({ userID: id})
  } catch (e) {
    console.log(e)
  }
}

async function opt(mongoClient, id, opt) {
    try{
      const settingsCollections = await mongoClient.db("Ears").collection("userSettings")
      await settingsCollections.updateOne({userID: id}, {$set: {opt: opt}},);
    } catch (e) {
      console.log(e)
    }
}

module.exports = {
  openConnection: openConnection,
  findServerSettings: findServerSettings,
  addServer: addServer,
  updateServerSettings: updateServerSettings,
  removeData: removeData,
  addUser: addUser,
  getUser:getUser,
  opt: opt
}