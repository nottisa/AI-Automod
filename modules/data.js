const fs = require('fs');
var strManipulation = require('./stringManipulation');

exports.saveTrainingData = function (data) {
    let toExport = []
    for (const word of data) {
        toExport.push({"word": strManipulation.translate(word.word), "var": word.var})
    }
    try {
        if (!fs.existsSync('./formattedData')) {
            fs.mkdirSync('./formattedData');
        } else {
            let dataCount = 1
            while (true) {
                if (!fs.existsSync(`./formattedData/${dataCount}.json`)) {
                    break
                } else {
                    dataCount++
                }
            }
            fs.writeFileSync("./formattedData/"+dataCount+".json", JSON.stringify(toExport))
        }
        return true
    } catch (error) {
        console.log(error)
    }    
}

exports.saveModel = function (network) {
    const brain = require('brain.js');
    try {
        if (!fs.existsSync('./network')) {
            fs.mkdirSync('./network');
        } else {
            let dataCount = 1
            while (true) {
                if (!fs.existsSync(`./network/${dataCount}.json`)) {
                    break
                } else {
                    dataCount++
                }
            }
            fs.writeFileSync("./network/"+dataCount+".json", JSON.stringify(network.toJSON()))
        }
    } catch (err) {
        console.error(err);
    }
}

exports.loadModel = function (version) {
    let brain = require('brain.js');
    brain = new brain.NeuralNetwork()
    return brain.fromJSON(require(`../network/${version}.json`))
}

exports.formatData = function () {
    if (!fs.existsSync('./rawData') || fs.readdirSync('./rawData').length == 0) {
        console.log("Please collect data before processing.")
        process.exit(1)
    }

    let dataFolder = fs.readdirSync('./rawData');
    for(fileName of dataFolder) {
        let file = require('../rawData/' + fileName);
        let saved = this.saveTrainingData(file)
        if(saved) {
            fs.rmSync('./rawData/' + fileName)
        }
    }
}