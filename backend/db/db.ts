const config = require("./local.settings.json")
var MongoClient = require('mongodb').MongoClient

MongoClient.connect(`mongodb://${config.mongoDbUsername}:${config.mongoDbUserPassword}@${config.mongoDbIp}:27017`, function (err, client) {
  if(err) {console.error(`\nFAILED TO CONNECT TO DATABASE: ${err.message}`); process.exit(1)};

  const db = client.db(config.mongoDbName)
})
