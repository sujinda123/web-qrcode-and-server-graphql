import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// const Dataloader = require('dataloader')
// const userLoader = new Dataloader(ids => fetchUserByIds(userId))
// const loaders = { userLoader }

import User from "../models/user";
import StatusAsset from "../models/StatusAsset"
import Asset from "../models/Asset"
// import Product from "../models/product";

const genPromise = (value, text) =>
  new Promise(resolve => {
    setTimeout(() => {
      console.log(text)
      return resolve(value)
    }, 100)
  })

const Query = {

  user: (parent, args, { userId }, info) =>{
    console.log(userId)
    return User.findById(userId).populate({ 
        path: "statusassets assets",
        // populate: { path: "user"},
        options: { sort: { createdAt: -1 }},
    })},
  users: (parent, args, context, info) =>{
    return User.find().sort({createdAt: -1}).populate({
        path: "statusassets",
        populate: { path: "user" }
    })},
  allUsers (root, args, { userModel }) {
    return genPromise(User.find(), 'getAllUsers')
  },
  statusasset: (parent, args, { userId }, info) =>
    StatusAsset.findById(args.id).sort({createdAt: -1 }).populate({
        path: "statusassets",
        populate: { path: "user" }
    }),
  statusassets: (parent, args, { userId }, info) =>
    StatusAsset.find().sort({ createdAt: -1 }).populate({
        path: "createdBy updateBy",
    }),
  assets: (parent, args, { userId }, info) =>
    Asset.find().sort({ createdAt: -1 }).populate({
        path: "createdBy updateBy",
    }),
  search: async (_, {input: { assetNumber }, limit, page}) =>{
    // const count = await Asset.countDocuments(searchQuery)
    if(assetNumber)
      return await Asset.find({ assetNumber: { $regex: assetNumber, $options: 'i' }}).limit(limit).skip((page - 1) * limit).populate({
        path: "createdBy updateBy",
      })
    else
      return null
  }
 
  // user: (parent, args,{ userId }, info) =>
  //   User.findById(userId).populate({ 
  //     path: "user",  
  //     populate: { path: "user",populate: { path: "userAt",populate: { path: "user"}} }
  //   }), 
  // users: (parent, args, context, info) => 
  //   User.find({}).populate({ 
  //     path: "users",  
  //     populate: { path: "user"}    
  //   }),
  // product: (parent, args, context, info) =>
  //   Product.findById(args.id).populate({
  //     path: "user",
  //     populate: { path: "products" }
  //   }),
  // products: (parent, args, context, info) =>
  //   Product.find().populate({
  //     path: "user",
  //     populate: { path: "products" }
  //   })
};

export default Query;   