// backend/src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET;

export const authenticateJWT = (req, res, next) => {
  const accessToken = req.cookies.token;

  // If the token does not exist
  if (!accessToken) {
    console.log("No token found in cookies");
    return res
      .status(401)
      .json({ message: "Unauthorized - No Token Provided" });
  }

  jwt.verify(accessToken, secretKey, (err, user) => {
    if (err) {
      console.log("Token verification failed: ", err.message);
      return res.status(403).json({ message: "Invalid token" });
    }

    console.log("Token decoded successfully: ", user),
    req.user = user;
    next();
  });
};