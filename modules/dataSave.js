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