import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import User from "../models/user";
import Product from "../models/product";

const Query = {
  user: (parent, args,{ userId }, info) =>
    User.findById(userId).populate({
      path: "products",
      populate: { path: "user" }
    }),
  users: (parent, args, context, info) =>
    User.find({}).populate({
      path: "products",
      populate: { path: "user"}
    }),
  product: (parent, args, context, info) =>
    Product.findById(args.id).populate({
      path: "user",
      populate: { path: "products" }
    }),
  products: (parent, args, context, info) =>
    Product.find().populate({
      path: "user",
      populate: { path: "products" }
    })
};

export default Query;