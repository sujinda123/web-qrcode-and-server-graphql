import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema({
  assetNumber: {
    type: String,
    required: true,
    trim: true
  },
  assetName: {
    type: String,
    required: true,
    trim: true
  },
  assetUnitCost: {
    type: Number,
    required: true,
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