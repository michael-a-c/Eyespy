const config = require("./config.json");

db.createuser({
    user: process.env.MONGO_USERNAME,
    pwd: process.env.MONGO_PASSWORD,
    roles: [
        {
            role: "readWrite",
            db: process.env.MONGO_INITDB_DATABASE
        }
    ]

});
