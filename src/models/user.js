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

// const genPromise = (value, text) =>
//   new Promise(resolve => {
//     setTimeout(() => {
//       // console.log(text)
//       return resolve(value)
//     }, 100)
//   })
  
// const userModel = (() => {
//   const User = mongoose.model("User", userSchema);
//   // const users = [
//   //   { id: 1, name: 'A', bestFriendId: 2, followingUserIds: [2, 3, 4] },
//   //   { id: 2, name: 'B', bestFriendId: 1, followingUserIds: [1, 3, 4, 5] },
//   //   { id: 3, name: 'C', bestFriendId: 4, followingUserIds: [1, 2, 5] },
//   //   { id: 4, name: 'D', bestFriendId: 5, followingUserIds: [1, 2, 5] },
//   //   { id: 5, name: 'E', bestFriendId: 4, followingUserIds: [2, 3, 4] }
//   // ]

//   return {
//     getDB:() => User,
//     getUserById: id =>
//       genPromise(
//         User.findById(id), 
//         `getUserById: ${id}`
//       ),
//     getUserByName: name =>
//       genPromise(
//         User.find(user => user.name === name),
//         `getUserByName: ${name}`
//       ),
//     getUsersByIds: ids =>
//       genPromise(
//         User.find(),
//         `getUsersByIds: ${ids}`
//       ),
//     getAllUsers: () => 
//       genPromise(
//         User, 
//         'getAllUsers'
//       )
//     // getUsersByIds : User.findById(userId).populate({ 
//     //   path: "statusassets assets",
//     //   // populate: { path: "user"},
//     //   options: { sort: { createdAt: -1 }},
//     // }
//   }
// })()
const User = mongoose.model("User", userSchema);

export default User;
