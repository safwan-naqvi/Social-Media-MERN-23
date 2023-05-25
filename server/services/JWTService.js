const jwt = require("jsonwebtoken");

class JWTService {
  //sign access token
  signAccessToken(payload, expiryTime, secret) {
    return jwt.sign(payload, secret, { expiresIn: expiryTime });
  }
  //sign refresh token
  //verify access token
  //verify refresh token
  //store refresh token
}
