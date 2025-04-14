// root/backend/src/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUserByMail,
  createUser,
  findUserById,
  countEventsByUserId,
} from "../model/userModel.js";
const secretKey = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    const existingUser = await findUserByMail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await createUser({
      user_firstname: firstName,
      user_lastname: lastName,
      user_email: email,
      user_password: hashedPassword,
      user_phonenumber: phoneNumber,
      user_role: "organizer",
    });
    res.status(201).json({ message: "User registered successfully", newUser });
    console.log("Controller: new user registered successfully");
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByMail(email);

    if (!user || !bcrypt.compareSync(password, user.user_password)) {
      return res
        .status(401)
        .json({ message: "Wrong email or password, invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.user_id, email: user.user_email, role: user.user_role },
      secretKey,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true,
      // sameSite: "Strict",
    });
    res.status(200).json({
      message: "Login successfully",
      token,
      role: user.user_role,
      userId: user.user_id,
    });
  } catch (error) {
    console.log("Login error: ", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const logout = async (req, res) => {
  try {
    console.log("User controler: Clearing cookies");
    res.clearCookie("token");
    res.status(200).json({ message: "You logged out successfully" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userIdFromToken = req.user.id;
    console.log(
      "Get profile Controller: fetching profile for user ID: ",
      userIdFromToken
    );
    // const token = req.cookies.token;
    // if (!token) return res.status(401).json({ message: "Unauthorized" });
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await findUserById(userIdFromToken);
    if (!user) {
      console.log("User not found with id: ", userIdFromToken);
      return res.status(404).json({ message: "User not found" });
    }

    const eventCount = await countEventsByUserId(userIdFromToken);

    res.status(200).json({
      ...user,
      eventCount: eventCount,
    });
  } catch (error) {
    console.error("getProfile Controller: Error fetching profile: ", error);
    res.status(403).json({ message: "Invalid Token" });
  }
};
