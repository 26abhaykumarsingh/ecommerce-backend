const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartSchema = new Schema({
  quantity: { type: Number, required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true }, //reference to the product, will get all product related info from here
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }, //reference to the product, will get all product related info from here
});

const virtual = cartSchema.virtual("id");
//virtual help in making a virtual datafield, here we making id datafiled cuz in database _id is present but frontend is using id not _id
//when response is sent, this virtual id is added to the response automatically.
//will stays as _id in database
virtual.get(function () {
  return this._id;
});
cartSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Cart = mongoose.model("Cart", cartSchema);
