import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import User from "../models/user";
import StatusAsset from "../models/StatusAsset"
import Asset from "../models/Asset"
// import Product from "../models/product";

const Query = {

  user: (parent, args, { userId }, info) =>
    User.findById(userId).populate({
        path: "statusassets assets",
        // populate: { path: "user"},
        options: { sort: { createdAt: -1 }},
    }),
  users: (parent, args, context, info) =>
    User.find().sort({createdAt: -1}).populate({
        path: "statusassets",
        populate: { path: "user" }
    }),
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
  search: async (_, {input: { assetNumber, assetUnitCost }}) =>{

    // const count = await Asset.countDocuments(searchQuery)

    return await Asset.find({ assetNumber: { $regex: assetNumber, $options: 'i' } })
    
    // if(assetNumber && assetUnitCost)
    //   return Asset.find({ assetNumber, assetUnitCost })
    // else if(assetNumber)
    //   return Asset.find({ assetNumber })
    // else if(assetUnitCost)
    //   return Asset.find({ assetUnitCost })
    // else
    //   return 0

      // return sql.raw('SELECT * FROM `Asset` WHERE `assetNumber` LIKE ?', assetNumber);
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