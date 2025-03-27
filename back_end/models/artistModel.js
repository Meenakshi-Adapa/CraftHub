const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  artStyle: { type: String },
  experience: { type: Number },
  portfolio: { type: String },
  workshopsHosted: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Artist", artistSchema);
