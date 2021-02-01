// import Mutation from "./mutation"
import Query from "./query"
import { GraphQLDateTime } from "graphql-iso-date"
// const { PubSub } = require('apollo-server');
// const pubsub = new PubSub();
// const POST_ADDED = 'POST_ADDED'
// const POST_ADD_DataUser = 'POST_ADD_DataUser'

import bcrypt from "bcryptjs";

import User from "../models/User"
import StatusAsset from "../models/StatusAsset"
import Asset from "../models/Asset"

const jwt = require('jsonwebtoken')
const APP_SECRET = 'abcdefghijklmnopqrst'

const DataLoader = require("dataloader")

const genPromise = (value, text) =>
  new Promise(resolve => {
    setTimeout(() => {
      console.log(text)
      return resolve(value)
    }, 100)
  })

const resolvers = {
  // Subscription: {
  //   newProductUser: { 
  //       subscribe: (parent, args, context, info) => pubsub.asyncIterator([POST_ADDED]),
  //   },
  //   // updateDataUser: {
  //   //     subscribe: (parent, args, context, info) => pubsub.asyncIterator([POST_ADD_DataUser]),
  //   // },
  // },
  Query,
  User:{
    assets: async (user, args, { dataloaders }) => await dataloaders.assets.load(user.id),
    // assets: (user) => new DataLoader((keys) => 
    //   genPromise(
    //     keys.map((user) => user),
    //     `getAssetById: ${user.id}`)
    //   ).loadMany(user.assets),
    // search: async ( _, {input: { assetCode }, limit, page, }, {assetModel} ) => 
    //   await assetModel
    //     .find({ assetCode: { $regex: assetCode, $options: 'i' }})
    //     .limit(limit)
    //     .skip((page - 1) * limit)
    //     .populate({path: "createdBy updateBy",}),

    // assets: (user) => {
		// 	const authorLoader = new DataLoader((keys) => {
		// 		const result = keys.map((user) => {
		// 			return user
		// 		})
		// 		return genPromise(result,`getAssetById: ${user.id}`)
    //   })
		// 	return authorLoader.loadMany(user.assets)
		// },
  },
  Asset:{
    updateBy: async (asset, args, { dataloaders }) => await dataloaders.users.load(asset.updateBy),
    createdBy: async (asset, args, { dataloaders }) => await dataloaders.users.load(asset.createdBy),
  },
  Mutation:{
    // ------------------------------------------------------------------------- Login
      login: async (parent, args, { userModel }, info) => {
          const { Username, Password } = args;

          if (Username == '') {
              throw new Error("กรุณากรอก Username")
          }
          if (Password == '') {
              throw new Error("กรุณากรอก รหัสผ่าน")
          }

          const currentUsers = await userModel.user.findOne({userUsername:Username});
          if (!currentUsers) {
              throw new Error("ไม่พบ Username ในระบบ")
          }
          const checkPassword = await bcrypt.compare(Password, currentUsers.userPwd)
          if (!checkPassword) {
              throw new Error('รหัสผ่าน ไม่ถูกต้อง')
          }

          const token = jwt.sign({ userId: currentUsers.id },APP_SECRET,{ expiresIn: '3d' },);
          return {
              token
          }
      },
    // ------------------------------------------------------------------------- สมัครสมาชิก
      signup: async (parent, args, { userId, userModel }, info) => {

        const { userUsername, userPwd } = args;
        const username = userUsername.trim().toLowerCase();
        const currentUsers = await userModel.user.find({});
        const isUsernameExist = currentUsers.findIndex(user => user.userUsername === username) > -1;
        if (isUsernameExist) {
          throw new Error("Username already exist.");
        }
        if (userPwd.trim().length < 6) {
          throw new Error("Password must be at least 6 characters.");
        }
        const password = await bcrypt.hash(userPwd, 10);
        return userModel.user.create({...args,userPwd: password})
      },
      // ------------------------------------------------------------------------- 
      // createStatusAsset: async (parent, args, { userId }, info) => {
      //   const { statusAssetName } = args;
      //   if (statusAssetName == '') {
      //     throw new Error("กรุณากรอก Status name!")
      //   }
      //   const statusasset = await StatusAsset.create({ ...args, updateBy: userId, createdBy: userId })
      //   const user = await userModel.users.findById(userId)
      //   if (!user.statusassets) {
      //     user.statusassets = [statusasset]
      //   } else {
      //     user.statusassets.push(statusasset)
      //   }
      //   await user.save()
      //   return StatusAsset.findById(statusasset.id).populate({
      //       path: "user",
      //       populate: { path: "statusassets" }
      //     })
      // },
      // ------------------------------------------------------------------------- 
      createAsset: async (parent, args, { userId, assetModel, userModel }, info) => {
        if(!userId)
          throw new Error("กรุณา เข้าสู่ระบบ")
        const assets = await assetModel.asset.create({ ...args, updateBy: userId, createdBy: userId })
        const user = await userModel.user.findById(userId)
        if (!user.assets) {
          user.assets = [assets]
        } else {
          user.assets.push(assets)
        }
        await user.save()
        return assetModel.asset.findById(assets.id).populate({
            path: "createdBy updateBy",
            // populate: { path: "assets" }
          })
      },
    // ------------------------------------------------------------------------- เพิ่มสินค้าให้สมาชิก
      // createProduct: async (parent, args, context, info) => {
      //   const userId = "5ea71f8b796e2560d80facf6"
      //   if (!args.name || !args.description || !args.price) {
      //     throw new Error("Please provide all required fields.")
      //   }
      //   const product = await Product.create({ ...args, user: userId })
      //   const user = await User.findById(userId)

      //   pubsub.publish(POST_ADDED, {
      //     newProductUser: product
      //   });

      //   if (!user.products) {
      //     user.products = [product]
      //   } else {
      //     user.products.push(product)
      //   }
      //   await user.save()
      //   return Product.findById(product.id).populate({
      //     path: "user",
      //     populate: { path: "products" }
      //   })
      // },
    // ------------------------------------------------------------------------- Updateสินค้าให้สมาชิก
      // updateProduct: async (parent, args, context, info) => {
      //   const { id, name, description, price } = args
      //   // TODO: Check if user logged in
      //   // หา product ใน database
      //   const product = await Product.findById(id)
      //   // TODO: Check if user is the owner of the product
      //   const userId = "5ea71f8b796e2560d80facf6"
      //   if (userId !== product.user.toString()) {
      //     throw new Error("You are not authorized.")
      //   }
      //   // Form ที่ใช้ในการ updated
      //   const updateInfo = {
      //     name: !!name ? name : product.name,
      //     description: !!description ? description : product.description,
      //     price: !!price ? price : product.price
      //   }
      //   // Update product ใน database
      //   await Product.findByIdAndUpdate(id, updateInfo)
      //   // หา Product ที่ update มาแสดง
      //   const updatedProduct = await Product.findById(id).populate({ path: "user" })
      //   return updatedProduct
      // },
      // ------------------------------------------------------------------------- ลบสินค้าให้สมาชิก
      // deleteProduct: async (parent, args, context, info) => {
      //   const { id } = args;
      //   // Find product from given id
      //   const product = await Product.findById(id);
      //   // TODO: Check if user logged in
      //   // TODO: user id from request --> Find user
      //   const userId = "5ea71f8b796e2560d80facf6";
      //   // Check if user logged in
      //   if (!userId) throw new Error("Please log in.");
      //   const user = await User.findById(userId)
      //   // Check ownership of the product
      //   if (product.user.toString() !== userId) {
      //     throw new Error("Not authorized.")
      //   }
      //   // Delete product
      //   const deletedProduct = await Product.findOneAndRemove(id);
      //   // Update user's products
      //   const updatedUserProducts = user.products.filter(
      //     productId => productId.toString() !== deletedProduct.id.toString()
      //   );
      //   await User.findByIdAndUpdate(userId, { products: updatedUserProducts });
      //   return deletedProduct;
      // }
    },
  Date: GraphQLDateTime
};

export default resolvers;
