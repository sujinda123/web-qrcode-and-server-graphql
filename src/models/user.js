import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userUsername: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  userFirstname: {
    type: String,
    required: true
  },
  userLastname: {
    type: String,
    required: true
  },
  userPwd: {
    type: String,
    required: true,
    trim: true
  },
  assets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Asset",
  }],
  statusassets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "StatusAsset",
  }],
  updateAt: {
    type: Date,
    required: true,
    default: () => Date.now()
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => Date.now()
  }
});

const User = mongoose.model("User", userSchema);

export default User;
