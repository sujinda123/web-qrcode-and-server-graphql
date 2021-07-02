// import Mutation from "./mutation"
// import Query from "./query"
import { GraphQLDateTime } from "graphql-iso-date"
import { GraphQLUpload } from "graphql-upload";
// const { PubSub } = require('apollo-server');
// const pubsub = new PubSub();
// const POST_ADDED = 'POST_ADDED'
// const POST_ADD_DataUser = 'POST_ADD_DataUser'
const path = require("path");
import bcrypt from "bcryptjs";
import console from "console";
const mysql = require('mysql');
const fs = require('fs');
const util = require('util');
// import User from "../models/User"
// import StatusAsset from "../models/StatusAsset"
// import Asset from "../models/Asset"

const jwt = require('jsonwebtoken')
const APP_SECRET = 'abcdefghijklmnopqrst'

const {v4: uuid} = require('uuid');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_myapp'
});

const query = util.promisify(connection.query).bind(connection);

let queryDB = (sql) => {
  return new Promise((resolve, reject) => {
      query(sql, (err, results) => {
          if (err) reject(err);
          resolve(results);
      });
  });
};

let getUser = (username) => {
  const sqlAll = `SELECT * FROM asset_users`;
  const sqlByID = `${sqlAll} WHERE USER_USERNAME = '${username}'`;
  let sql = username ? sqlByID : sqlAll;
  return new Promise((resolve, reject) => {
      query(sql, (err, results) => {
          if (err) reject(err);
          resolve(results[0]);
      });
  });
};

let typeCheck = async (item)=>{
  let {mimetype} = await item;
  // console.log(item)
  if(!(mimetype === "image/png" || mimetype === "image/jpeg")){
      return false;
  }else{
      return true;
  }
}

const processUpload = async (file)=>{
  const {createReadStream, mimetype, encoding, filename} = await file;
  let name = uuid() + '.jpg'
  let url = path.join(__dirname, "../../uploads", name)
  return await new Promise((resolve,reject)=>{
    createReadStream()
      .pipe(fs.createWriteStream(url))
      .on("finish", ()=>{
          resolve({
              success: true,
              message: "Successfully Uploaded",
              mimetype, filename: name, encoding, location: url
          })
      })
      .on("error", (err)=>{
          console.log("Error Event Emitted")
          reject({
              success: false,
              message: "Failed"
          })
      })
  })
}

const resolvers = {
  // Subscription: {
  //   newProductUser: { 
  //       subscribe: (parent, args, context, info) => pubsub.asyncIterator([POST_ADDED]),
  //   },
  //   // updateDataUser: {
  //   //     subscribe: (parent, args, context, info) => pubsub.asyncIterator([POST_ADD_DataUser]),
  //   // },
  // },
  Upload: GraphQLUpload,
  Query:{
    // user: async (root, { name }, { userId, userModel }) => await userModel.getUserById(userId),
    getUser: (obj, { id }, { auth_username }) => {
      // console.log(auth_username)
      if(auth_username == null){
        throw new Error("กรุณาเข้าสู่ระบบ")
      }
      const data = getUser(auth_username)
      return data.then(rows => rows);
    },
    getSearch: async ( _, args ) => {
      const {input: { ASSET_CODE }, limit, page, } = args
      let sql = `SELECT * FROM asset WHERE ASSET_CODE LIKE '%${ASSET_CODE}%'`;
      return queryDB(sql).then(rows => rows);
    },
  },

  User:{
    USER_ASSETS: (obj) => {
      // console.log(obj)
      let sql = `SELECT * FROM asset WHERE CREATED_BY = '${obj.USER_ID}'`;
      return queryDB(sql).then(rows => rows);
    },
    USER_PRIVILEGE: (obj) => {
      let sql = `SELECT * FROM asset_privilege WHERE PRIVILEGE_ID = '${obj.USER_PRIVILEGE}'`;
      return queryDB(sql).then(rows => rows);
    },
    ASSET_PRIVILEGE: (obj) => {
      let sql = `SELECT * FROM asset_status_and_privilege LEFT JOIN asset_status ON asset_status_and_privilege.STATUS_ID = asset_status.STATUS_ID WHERE PRIVILEGE_ID = '${obj.USER_PRIVILEGE}'`;
      return queryDB(sql).then(rows => rows);
    },
  //   assets: async (user, args, { dataloaders }) => await dataloaders.assets.load(user.id),
    
    // search: async  ( user, args, { dataloaders, assetModel } ) => {
    //     const {input: { assetCode }, limit, page, } = args
    //     return await assetModel.asset
    //     .find({ assetCode: { $regex: assetCode, $options: 'i' }})
    //     .limit(limit)
    //     .skip((page - 1) * limit)
    //     .populate({path: "createdBy updateBy",})},
  //   // assets: (user) => new DataLoader((keys) => 
  //   //   genPromise(
  //   //     keys.map((user) => user),
  //   //     `getAssetById: ${user.id}`)
  //   //   ).loadMany(user.assets),
  //   // search:  ( _, {input: { assetCode }, limit, page, }, {assetModel} ) => 
  //   //   await assetModel
  //   //     .find({ assetCode: { $regex: assetCode, $options: 'i' }})
  //   //     .limit(limit)
  //   //     .skip((page - 1) * limit)
  //   //     .populate({path: "createdBy updateBy",}),

  //   // assets: (user) => {
	// 	// 	const authorLoader = new DataLoader((keys) => {
	// 	// 		const result = keys.map((user) => {
	// 	// 			return user
	// 	// 		})
	// 	// 		return genPromise(result,`getAssetById: ${user.id}`)
  //   //   })
	// 	// 	return authorLoader.loadMany(user.assets)
	// 	// },
  },
  Asset:{
    ASSET_IMAGES: (obj) => {
      let sql = `SELECT * FROM asset_image WHERE ASSET_ID = '${obj.ASSET_ID}'`;
      return queryDB(sql).then(rows => rows);
    },
    ASSET_STATUS: (obj) => {
      let sql = `SELECT * FROM asset_status WHERE STATUS_ID = '${obj.ASSET_STATUS}'`;
      return queryDB(sql).then(rows => rows);
    },
    ASSET_ROOM: (obj) => {
      let sql = `SELECT * FROM asset_room WHERE ROOM_ID = '${obj.ASSET_ROOM}'`;
      return queryDB(sql).then(rows => rows);
    },
    ASSET_ORIGINAL_ROOM: (obj) => {
      let sql = `SELECT * FROM asset_room WHERE ROOM_ID = '${obj.ASSET_ORIGINAL_ROOM}'`;
      return queryDB(sql).then(rows => rows);
    },
    CREATED_BY: (obj) => {
      let sql = `SELECT * FROM asset_users WHERE USER_ID = '${obj.CREATED_BY}'`;
      return queryDB(sql).then(rows => rows);
    },
    UPDATE_BY: (obj) => {
      let sql = `SELECT * FROM asset_users WHERE USER_ID = '${obj.UPDATE_BY}'`;
      return queryDB(sql).then(rows => rows);
    },
    // updateBy: async (asset, args, { dataloaders }) => await dataloaders.users.load(asset.updateBy),
    // createdBy: async (asset, args, { dataloaders }) => await dataloaders.users.load(asset.createdBy),
    // statusassets: async (user, args, { dataloaders, assetModel } ) => await assetModel.asset.find().populate({
    //         path: "createdBy updateBy",
    //         populate: { path: "createdBy updateBy"}, 
    //     })
  },
  Status_Asset:{
    // updateBy: async (asset, args, { dataloaders }) => await dataloaders.users.load(asset.updateBy),
    // createdBy: async (asset, args, { dataloaders }) => await dataloaders.users.load(asset.createdBy),
  },
  Mutation:{
        // ------------------------------------------------------------------------- สมัครสมาชิก
        signup: async (parent, args, info) => {
          const { USER_USERNAME, USER_PASSWORD, USER_FIRSTNAME, USER_LASTNAME } = args;

          var sql = `SELECT * FROM asset_users WHERE USER_USERNAME = '${USER_USERNAME}'`;
          const password = await bcrypt.hash(USER_PASSWORD, 10);
          
          let token = (async () => {
            try {
              const rows = await query(sql);

              if(rows[0]!=null){
                throw new Error("Username มีในระบบแล้ว")
              }

              if (USER_PASSWORD.trim().length < 6) {
                throw new Error("Password must be at least 6 characters.")
              }

              sql = `INSERT INTO asset_users (USER_USERNAME, USER_FIRSTNAME, USER_LASTNAME, USER_PASSWORD) VALUES ('${USER_USERNAME}', '${USER_FIRSTNAME}', '${USER_LASTNAME}', '${password}')`;
              query(sql);

              return jwt.sign({userId: USER_USERNAME}, APP_SECRET, { expiresIn: '3d' },);
            } finally {
              // connection.end();
            }
          })()


          
          return { token }
        },
      // ------------------------------------------------------------------------- Login
      login:async(parent, args, { userModel }, info) => {
          const { Username, Password } = args;

          if (Username == '') {
              throw new Error("กรุณากรอก Username")
          }
          if (Password == '') {
              throw new Error("กรุณากรอก รหัสผ่าน")
          }

          var sql = `SELECT * FROM asset_users WHERE USER_USERNAME = '${Username}'`;

          let token = (async () => {
            try {

              const rows = await query(sql);
              if(rows[0]==null){
                throw new Error("ไม่พบ Username ในระบบ")
              }
              const checkPassword = await bcrypt.compare(Password, rows[0].USER_PASSWORD)
              if(!checkPassword){
                throw new Error('รหัสผ่าน ไม่ถูกต้อง')
              }
              return jwt.sign({userId: rows[0].USER_USERNAME}, APP_SECRET, { expiresIn: '3d' },);

            } finally {
              // connection.end();
            }
          })()

          return { token }
      },
      singleUploadLocal : async (_, { file, assetID })=>{
        let obj =  (await processUpload(file));
        query(`INSERT INTO asset_image (IMAGE_NAME, ASSET_ID) VALUES ('${obj.filename}', '${assetID}')`)
        return obj
      },
      multipleUploadLocal : async (_, { files, assetID }) =>{
        let obj =  (await Promise.all(files)).map(processUpload);
        obj.map(data => data.then(d=>{
          query(`INSERT INTO asset_image (IMAGE_NAME, ASSET_ID) VALUES ('${d.filename}', '${assetID}')`)
        }))
        return obj;
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
    },
  Date: GraphQLDateTime
};

export default resolvers;
