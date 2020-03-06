const config = require("./local.settings.json")

const MongoClient = require('mongodb').MongoClient
const client = new MongoClient(`mongodb://${config.mongoDbUsername}:${config.mongoDbUserPassword}@127.0.0.1:27017`, { useUnifiedTopology: true });

client.connect((err, database) => {
  if(err) {console.error(`\nFAILED TO CONNECT TO DATABASE: ${err.message}`); process.exit(1)};
  
  const db = client.db(config.mongoDbName);
  console.log("Connected to db");
  client.close();
});
