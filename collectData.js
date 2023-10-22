var dataSave = require('./modules/dataSave');

//To insert data simply follow the json object bellow

let data = [
    {"word": "You are so stupid", "var": {"fword":0, "sword":0, "baword": 0, "biword":0, "nword":0, "nwordhardr":0, "butt": 0, "maleprivate": 0, "femaleprivate": 0, "sex": 0, "disrepectful": 1, "slur": 0}}
]

dataSave.save(data)
