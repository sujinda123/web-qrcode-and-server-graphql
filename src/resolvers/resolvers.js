// import Mutation from "./mutation"
import Query from "./query"
import { GraphQLDateTime } from "graphql-iso-date"
const { PubSub } = require('apollo-server');
const pubsub = new PubSub();
const POST_ADDED = 'POST_ADDED'
// const POST_ADD_DataUser = 'POST_ADD_DataUser'


import bcrypt from "bcryptjs";

import User from "../models/user"
import Product from "../models/product"

import getUser from "../getUser"

const jwt = require('jsonwebtoken')
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID; 


const APP_SECRET = 'abcdefghijklmnopqrst'


const resolvers = {
  Subscription: {
    newProductUser: { 
        subscribe: (parent, args, context, info) => pubsub.asyncIterator([POST_ADDED]),
    },
    // updateDataUser: {
    //     subscribe: (parent, args, context, info) => pubsub.asyncIterator([POST_ADD_DataUser]),
    // },
  },
  Query,
  Mutation:{
    // ------------------------------------------------------------------------- Login
      login: async(parent, args, context, info) => {
          
          const { username, password } = args;
          if (username == '') {
              throw new Error("กรุณากรอก Username")
          }
          if (password == '') {
              throw new Error("กรุณากรอก รหัสผ่าน")
          }
          const currentUsers = await User.findOne({username:args.username});
          if (!currentUsers) {
              throw new Error("ไม่พบ Username ในระบบ")
          }
          const checkPassword = await bcrypt.compare(password, currentUsers.password)
          if (!checkPassword) {
              throw new Error('รหัสผ่าน ไม่ถูกต้อง')
          }
          const token = jwt.sign({ userId: currentUsers.id }, APP_SECRET)
          const userId = currentUsers.id
          return {
              token,
              userId, 
          }
      },
    // ------------------------------------------------------------------------- สมัครสมาชิก
      signup: async (parent, args, context, info) => {
        const username = args.username.trim().toLowerCase();
        const currentUsers = await User.find({});
        const isUsernameExist = currentUsers.findIndex(user => user.username === username) > -1;
        if (isUsernameExist) {
          throw new Error("Username already exist.");
        }
        if (args.password.trim().length < 6) {
          throw new Error("Password must be at least 6 characters.");
        }
        const password = await bcrypt.hash(args.password, 10);
        return User.create({...args,password})
      },
    // ------------------------------------------------------------------------- เพิ่มสินค้าให้สมาชิก
      createProduct: async (parent, args, context, info) => {
        const userId = "5ea71f8b796e2560d80facf6"
        if (!args.name || !args.description || !args.price) {
          throw new Error("Please provide all required fields.")
        }
        const product = await Product.create({ ...args, user: userId })
        const user = await User.findById(userId)

        pubsub.publish(POST_ADDED, {
          newProductUser: product
        });

        if (!user.products) {
          user.products = [product]
        } else {
          user.products.push(product)
        }
        await user.save()
        return Product.findById(product.id).populate({
          path: "user",
          populate: { path: "products" }
        })
      },
    // ------------------------------------------------------------------------- Updateสินค้าให้สมาชิก
      updateProduct: async (parent, args, context, info) => {
        const { id, name, description, price } = args
        // TODO: Check if user logged in
        // หา product ใน database
        const product = await Product.findById(id)
        // TODO: Check if user is the owner of the product
        const userId = "5ea71f8b796e2560d80facf6"
        if (userId !== product.user.toString()) {
          throw new Error("You are not authorized.")
        }
        // Form ที่ใช้ในการ updated
        const updateInfo = {
          name: !!name ? name : product.name,
          description: !!description ? description : product.description,
          price: !!price ? price : product.price
        }
        // Update product ใน database
        await Product.findByIdAndUpdate(id, updateInfo)
        // หา Product ที่ update มาแสดง
        const updatedProduct = await Product.findById(id).populate({ path: "user" })
        return updatedProduct
      },
      // ------------------------------------------------------------------------- ลบสินค้าให้สมาชิก
      deleteProduct: async (parent, args, context, info) => {
        const { id } = args;
        // Find product from given id
        const product = await Product.findById(id);
        // TODO: Check if user logged in
        // TODO: user id from request --> Find user
        const userId = "5ea71f8b796e2560d80facf6";
        // Check if user logged in
        if (!userId) throw new Error("Please log in.");
        const user = await User.findById(userId)
        // Check ownership of the product
        if (product.user.toString() !== userId) {
          throw new Error("Not authorized.")
        }
        // Delete product
        const deletedProduct = await Product.findOneAndRemove(id);
        // Update user's products
        const updatedUserProducts = user.products.filter(
          productId => productId.toString() !== deletedProduct.id.toString()
        );
        await User.findByIdAndUpdate(userId, { products: updatedUserProducts });
        return deletedProduct;
      }
    },
  Date: GraphQLDateTime
};

export default resolvers;