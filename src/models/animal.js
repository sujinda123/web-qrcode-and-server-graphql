import mongoose from "mongoose"

const animalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
})

const Animal = mongoose.model("Animal", animalSchema)

export default Animal