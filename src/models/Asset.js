import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema({

  assetCode: {
    type: String,
    required: true,
    trim: true
  },
  assetName: {
    type: String,
    required: true,
    trim: true
  },
  assetNumber: {
    type: Number,
    required: true,
  },
  assetUnitCost: {
    type: String,
    required: true,
    trim: true
  },
  assetBrand: {
    type: String,
    required: true,
    trim: true
  },
  assetModel: {
    type: String,
    required: true,
    trim: true
  },
  assetSerialNumber: {
    type: String,
    required: true,
    trim: true
  },
  assetImages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Asset_Images",
    required: true
  }],
  updateBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
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

const Asset = mongoose.model("Asset", AssetSchema);

export default Asset;
