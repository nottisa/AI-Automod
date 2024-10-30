const dataSave = require('./modules/data');
const strManipulation = require('./modules/stringManipulation');
const network = dataSave.loadModel(3)

console.log(network.run(strManipulation.translate("hi")))
