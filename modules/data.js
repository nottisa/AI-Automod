const fs = require('fs');
var strManipulation = require('./stringManipulation');



exports.saveTrainingData = function (data) {
    let toExport = []
    for (const word of data) {
        toExport.push({"word": strManipulation.translate(word.word), "var": word.var})
    }
    try {
        if (!fs.existsSync('./data')) {
            fs.mkdirSync('./data');
        } else {
            let dataCount = 1
            while (true) {
                if (!fs.existsSync(`./data/${dataCount}.json`)) {
                    break
                } else {
                    dataCount++
                }
            }
            fs.writeFileSync("./data/"+dataCount+".json", JSON.stringify(toExport))
        }
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