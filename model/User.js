const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: Buffer, required: true },
  role: { type: String, required: true, default: "user" },
  addresses: { type: [Schema.Types.Mixed] },
  //TODO : we can make a seperate schema for addresses
  name: { type: String },
  salt: Buffer, //salt will be used to verify password (it was also used while encrypting)
});

const virtual = userSchema.virtual("id");
//virtual help in making a virtual datafield, here we making id datafiled cuz in database _id is present but frontend is using id not _id
//when response is sent, this virtual id is added to the response automatically.
//will stays as _id in database
virtual.get(function () {
  return this._id;
});
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.User = mongoose.model("User", userSchema);
