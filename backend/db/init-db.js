const config = require("../local.settings.json");
const { spawn, exec } = require("child_process");
const mongo = spawn("docker-compose", ["up", "--build"], {
  env: {
    PROJ_MONGO_INITDB_DATABASE: config.mongoDb,
    PROJ_MONGO_INITDB_ROOT_USERNAME: config.mongoUsername,
    PROJ_MONGO_INITDB_ROOT_PASSWORD: config.mongoPassword
  }
});

mongo.stdout.on("data", data => {
  console.log(`stdout: ${data}`);
});

mongo.stderr.on("data", data => {
  console.log(`stderr: ${data}`);
});

mongo.on("error", error => {
  console.log(`error: ${error.message}`);
});

mongo.on("close", code => {
  console.log(`process exited with code ${code}`);
});

process.on("SIGINT", function() {
  console.log("Shutting down db");
  exec("sudo docker-compose down -v", (err, stdout, stderr) => {
    if (err) {
      console.error(err);
    }
    console.log(stdout);
    process.exit();
  });
});
