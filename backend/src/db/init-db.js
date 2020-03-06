const config = require("../config.json");
const { spawn, exec } = require("child_process");


const mongo = spawn("docker-compose", ["up"], 
    {
        env: { 
            PROJ_MONGO_INITDB_DATABASE: config.mongoDbName,
            PROJ_MONGO_INITDB_ROOT_USERNAME: config.mongoDbUsername,
            PROJ_MONGO_INITDB_ROOT_PASSWORD: config.mongoDbUserPassword
        },
    });

mongo.stdout.on("data", data => {
    console.log(`stdout: ${data}`);
});

mongo.stderr.on("data", data => {
    console.log(`stderr: ${data}`);
});

mongo.on('error', (error) => {
    console.log(`error: ${error.message}`);
});

mongo.on("close", code => {
    console.log(`process exited with code ${code}`);
});

process.on('SIGINT', function() {
    console.log("Shutting down db");
    exec('sudo docker-compose down -v', (err, stdout, stderr) => {
        if (err) {
          console.error(err);
        }
        console.log(stdout);
        process.exit();

      });
});
