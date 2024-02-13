const passport = require("passport");

exports.isAuth = (req, res, done) => {
  return passport.authenticate("jwt");
};

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  console.log("cookie extractor ", token);
  //TODO : this is temporary token for testing without cookie
  // token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YzkwYjEwZWRjODI1YWU3NjdmMmQ5NyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzA3Njc0Mzg0fQ.pFkKoSho4d4Iml_PcpJ9B9WzXWOTcyu8BZkNyU6HYRQ";
  return token;
};
