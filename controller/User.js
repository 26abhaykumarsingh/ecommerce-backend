const { User } = require("../model/User");

exports.fetchUserById = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id);
    res.status(200).json({
      id: user.id,
      addresses: user.addresses,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      //no need to send entire product as body, just the data fields you wanna change.
      new: true,
    }); //findbyid finds by objectId ig, so whatever you put in there is compared with _id and not id or whatever data field you have made
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};
