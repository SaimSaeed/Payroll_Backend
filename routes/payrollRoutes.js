import express from "express";
import { protect, admin } from "../middlewares/authMiddleware.js";
import {
    createPayrollByAdmin,
  deletePayrollForAdmin,
  getAllUsersPayrolls,
  getSinglePayroll,
  getUserPayRolls,
  updatePayrollForAdmin,
} from "../controllers/payrollController.js";
const router = express.Router();

router.route("/all").get(protect, admin, getAllUsersPayrolls);
router.route("/").get(protect, getUserPayRolls).post(protect,admin,createPayrollByAdmin);
router.route("/:id").get(protect, getSinglePayroll).put(protect,admin,updatePayrollForAdmin).delete(protect,admin,deletePayrollForAdmin);

export default router;
