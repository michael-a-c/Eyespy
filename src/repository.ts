import * as mongoose from "mongoose";
import { StreamingOptions } from './Requests';
require('dotenv').config()

const uri: string = `mongodb://${process.env.mongoUsername}:${process.env.mongoPassword}@${process.env.mongoIp}:${process.env.mongoPort}/${process.env.mongoDatabase}`;

console.log(process.env.mongoDatabase);
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


interface IStream extends mongoose.Document{
  username: string,
  device: string,
  peerId: string,
  title:string,
  streamingOptions: {
    sms:boolean,
    push:boolean,
    publicView:boolean
  }
}


interface IUser extends mongoose.Document {
  username: string;
  password: string;
  email: string;
}

const StreamSchema = new mongoose.Schema({
  username: 
  { 
    type: String, 
    required: true,
  },
  device: { type: String, required: true },
  peerId: {type: String, required: true},
  title: {type: String, required: true},

  streamingOptions: {
     sms:{
      type: Boolean,
      required:true
     },
     push:{
      type: Boolean,
      required:true
     },
     publicView:{
      type: Boolean,
      required:true
     },
    }
}, {collection: "Stream", timestamps: { createdAt: 'created_at' } });

const Stream = mongoose.model<IStream>("Stream", StreamSchema);

export{
  User,
  UserSchema,
  IUser,
  IStream,
  StreamSchema,
  Stream
}