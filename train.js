const brain = require('brain.js');
const network = new brain.NeuralNetwork();
const strManipulation = require('./modules/stringManipulation');
const dataSave = require('./modules/data');
const fs = require('fs');
const data = []

try {
  if (!fs.existsSync('./formattedData')) {
    fs.mkdirSync('./formattedData');
  } else {
    let dataFolder = fs.readdirSync('./formattedData');
    for (let fileName of dataFolder) {
      let file = require('./formattedData/' + fileName);
      for (element of file) {
        data.push({input:element["word"], output:element["var"]})
      }
    }
  }
} catch (err) {
  console.error(err);
}

network.train(data, {log: detail => console.log(detail)});

dataSave.saveModel(network) 

let result = network.run(strManipulation.translate("hi"))
console.log(result)
