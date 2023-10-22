const brain = require('brain.js');
const network = new brain.NeuralNetwork();
var strManipulation = require('./modules/stringManipulation');
const fs = require('fs');
const data = []

try {
  if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
  } else {
    let dataFolder = fs.readdirSync('./data');
    for (i = 0; i < dataFolder.length; i++) {
        let data2 = require('./data/' + dataFolder[i]);
        for (i2 = 0; i2 < data2.length; i2++) {
            data.push({input:data2[i2]["word"], output:data2[i2]["var"]})
        }
        console.log(data);
    }
  }
} catch (err) {
  console.error(err);
}

network.train(data, {log: detail => console.log(detail)});
/*

network.train([
  {input:strManipulation.translate("Hi Jack"), output:{greeting:1, happy:1}},
  {input:strManipulation.translate("Hi Bob"), output:{greeting:1, happy:1}},
  {input:strManipulation.translate("Hi Jill"), output:{greeting:1, happy:1}},
  {input:strManipulation.translate("Hi Jenny"), output:{greeting:1, happy:1}},
  {input:strManipulation.translate("Hi Alfred"), output:{greeting:1, happy:1}},
  {input:strManipulation.translate("bob"), output:{greeting:0}},
  {input:strManipulation.translate("alfred"), output:{greeting:0}},
  {input:strManipulation.translate("john"), output:{greeting:0}},
  {input:strManipulation.translate("jill"), output:{greeting:0}},
  {input:strManipulation.translate("hi"), output:{greeting:1, happy:1}},
  {input:strManipulation.translate("Hi"), output:{greeting:1, happy:1}},
  {input:strManipulation.translate("Hello"), output:{greeting:1, happy:1}},
  {input:strManipulation.translate("Egg"), output:{greeting:0}},
  {input:strManipulation.translate("waffles"), output:{greeting:0}},
  {input:strManipulation.translate("Good day"), output:{greeting:1, happy:1}},

], {log: detail => console.log(detail)});
*/
let result = network.run(strManipulation.translate("hi"))
console.log(result)