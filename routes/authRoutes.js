import express from "express";
import {
  deleteUserByIdAdmin,
  getAllUsers,
  getMe,
  getUserByIdAdmin,
  login,
  logOut,
  register,
  updateProfile,
  updateUserByIdAdmin,
} from "../controllers/authController.js";
import { admin, protect } from "../middlewares/authMiddleware.js";
const router = express.Router();


router.route("/").post(register);
router.route("/login").post(login);
router.route("/logout").post(logOut);
router.route("/profile").get(protect, getMe).put(protect, updateProfile);
router.route("/users").get(protect, admin, getAllUsers);
router
  .route("/:id")
  .get(protect, admin, getUserByIdAdmin)
  .put(protect, admin, updateUserByIdAdmin)
  .delete(protect, admin, deleteUserByIdAdmin);

export default router;
