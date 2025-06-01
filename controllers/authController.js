import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// login
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    res.status(404);
    throw new Error("Wrong Credentials!");
  }
  if (!(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Wrong Credentials!");
  }

  const accessToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  res.cookie("jwt", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
  });

  return res.status(200).json({
    id: user._id,
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber,
    isAdmin: user.isAdmin,
  });
});

// register
const register = asyncHandler(async (req, res) => {
  const { username, email, phoneNumber, password } = req.body;

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error("User Already Exists!");
  }

  const user = new User({
    username,
    email,
    phoneNumber,
    password,
  });

  await user.save();

  return res.status(201).json("User Registered Successfully!");
});

// logout
const logOut = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    maxAge: new Date(0),
  });
  return res.status(200).json("User Logged Out!");
});

// User Profile
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User Not Logged!");
  }

  return res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber,
    isAdmin: user.isAdmin,
  });
});

// Update Profile
const updateProfile = asyncHandler(async (req, res) => {
  const { username, email, phoneNumber, password } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User Not Logged");
  }
  user.username = username || user.username;
  user.email = email || user.email;
  user.phoneNumber = phoneNumber || user.phoneNumber;
  user.password = password || user.password;
  user.save();
  return res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber,
    isAdmin: user.isAdmin
  });
});

// Get All Users For Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  if (!users) {
    res.status(404);
    throw new Error("Resource Not Found!");
  }
  return res.status(200).json(
    users.map((user) => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
    }))
  );
});

// GetUserById for Admin
const getUserByIdAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("Resource Not Found!");
  }

  return res.status(200).json(user);
});

// Update User for Admin
const updateUserByIdAdmin = asyncHandler(async (req, res) => {
  const { username, email, phoneNumber, isAdmin } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("Resource Not Found!");
  }

  user.username = username || user.username;
  user.email = email || user.email;
  user.phoneNumber = phoneNumber || user.phoneNumber;
  user.isAdmin = Boolean(isAdmin);
  user.save();

  return res.status(200).json("User Updated!");
});

// Delete User By Admin
const deleteUserByIdAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("Resource Not Found!");
  }
  await user.deleteOne();
  return res.status(200).json("User Deleted!");
});

export {
  login,
  register,
  getMe,
  updateProfile,
  logOut,
  getAllUsers,
  getUserByIdAdmin,
  updateUserByIdAdmin,
  deleteUserByIdAdmin,
};
