import * as mongoose from "mongoose";
require('dotenv').config()

const uri: string = `mongodb://${process.env.mongoUsername}:${process.env.mongoPassword}@${process.env.mongoIp}:${process.env.mongoPort}/${process.env.mongoDatabase}`;

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