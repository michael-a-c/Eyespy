import * as mongoose from "mongoose";
const config = require("../local.settings.json");

const uri: string = `mongodb://${config.mongoUsername}:${config.mongoPassword}@${config.mongoIp}:${config.mongoPort}/${config.mongoDb}`;

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true,  useCreateIndex: true})
.then(() => console.log('DB Connected!') )
.catch(err => {
  console.log(`DB Connection Error: ${err.message}`);
  process.exit(1);
});

interface IUser extends mongoose.Document {
  username: string;
  password: string;
  email: string;
}

const UserSchema = new mongoose.Schema({
  username: 
  { 
    type: String, 
    required: true,
    unique: true
  },
  password: { type: String, required: true },
  email: { type: String, required: true }
}, {collection: "User"});

const User = mongoose.model<IUser>("User", UserSchema);

export{
  User,
  UserSchema,
  IUser
}