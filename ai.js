dataSave = require('./modules/data');
let brain = require('brain.js');
const network = dataSave.loadModel(3)
console.log(network.run("hi"))