import * as mongoose from "mongoose";
import { StreamingOptions } from './Requests';
import { ObjectID } from 'bson';
require('dotenv').config()

const uri: string = `mongodb://${process.env.mongoUsername}:${process.env.mongoPassword}@${process.env.mongoIp}:${process.env.mongoPort}/${process.env.mongoDatabase}`;

console.log(process.env.mongoDatabase);
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log('DB Connected!'))
  .catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
    process.exit(1);
  });


interface IUser extends mongoose.Document {
  username: string;
  password: string;
  email: string;
  phone: string;
  devices: any;
}


const UserSchema = new mongoose.Schema({
  username:
  {
    type: String,
    required: true,
    unique: true
  },
  password: { type: String, required: true },
  email: { type: String, required: true },
  phone: {type: String},
  devices: [{
    deviceName: {
      type: String,
      required: true,
      //unique: true
    },
    subscription: {
      endpoint: { type: String, required: true },
      expirationTime: { type: Date },
      keys: {
        p256dh: { type: String, required: true },
        auth: { type: String, required: true }
      }
    },
    isRecording: { type: Boolean, required: true },
    isReceivingNotifications: { type: Boolean, required: true }
  }]
}, { collection: "User" });

const User = mongoose.model<IUser>("User", UserSchema);


interface IStream extends mongoose.Document {
  username: string,
  devices: any,
  peerId: string,
  title: string,
  alerts: number,
  streamingOptions: {
    sms: boolean,
    push: boolean,
    publicView: boolean
  }
}


interface IUser extends mongoose.Document {
  username: string;
  password: string;
  email: string;
}
interface IScreenshot extends mongoose.Document{
  _id: mongoose.Types.ObjectId,
  username: string,
  path: string,
  mimetype:string,
  title:string,
  date:  Date 
}

const StreamSchema = new mongoose.Schema({
  username:
  {
    type: String,
    required: true,
  },
  devices: [{ type: String, required: true }],
  peerId: { type: String, required: true },
  title: { type: String, required: true },
  alerts: {type: Number, default: 0},
  //lastRefresh: {type: Date, default: new Date()},
  streamingOptions: {
    sms: {
      type: Boolean,
      required: true
    },
    push: {
      type: Boolean,
      required: true
    },
    email: {
      type: Boolean,
      required: true
    },
  }
}, { collection: "Stream", timestamps: { createdAt: 'created_at' } });

const Stream = mongoose.model<IStream>("Stream", StreamSchema);

const ScreenshotSchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, auto: true },
  username:
  {
    type: String,
    require: true
  },
  title: {type: String, required: true},
  path: {type: String, required: true},
  mimetype: {type: String, required: true},
  date: { type: Date, default: Date.now }

}, { collection: "Screenshots", timestamps: { createdAt: 'created_at' } })

const Screenshot = mongoose.model<IScreenshot>("Screenshot", ScreenshotSchema);

export {
  User,
  UserSchema,
  IUser,
  IStream,
  StreamSchema,
  Stream,
  Screenshot
}