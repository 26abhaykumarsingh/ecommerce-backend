const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: {
    type: Number,
    min: [0, "wrong min price"],
    max: [10000, "wrong max price"],
  },
  description: {
    type: String,
    min: [1, "wrong min discount"],
    max: [99, "wrong max discount"],
  },
  rating: {
    type: String,
    min: [0, "wrong min rating"],
    max: [5, "wrong max rating"],
    default: 0,
  },
  stock: {
    type: String,
    min: [0, "wrong min rating"],
  },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  images: { type: [String], required: true },
  deleted: { type: Boolean, default: false },
});

const virtual = productSchema.virtual("id");
//virtual help in making a virtual datafield, here we making id datafiled cuz in database _id is present but frontend is using id not _id
//when response is sent, this virtual id is added to the response automatically.
//will stays as _id in database
virtual.get(function () {
  return this._id;
});
productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Product = mongoose.model("Product", productSchema);
