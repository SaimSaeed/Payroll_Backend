import asyncHandler from "../middlewares/asyncHandler.js";
import Payroll from "../models/Payroll.js";

// User PayRolls
const getUserPayRolls = asyncHandler(async (req, res) => {
  const payRolls = await Payroll.find({ userId: req.user._id }).populate(
    "userId",
    "username"
  );
  if (!payRolls) {
    res.status(404);
    throw new Error("Resource Not Found!");
  }

  return res.status(200).json(
    payRolls.map((payRoll) => ({
      _id: payRoll._id,
      user: payRoll.userId.username,
      month: payRoll.month,
      basicSalary: payRoll.basicSalary,
      bonus: payRoll.bonus,
      deductions: payRoll.deductions,
      netSalary: payRoll.netSalary,
    }))
  );
});

// Get Single Payrolls for user
const getSinglePayroll = asyncHandler(async (req, res) => {
  const payRoll = await Payroll.findById(req.params.id).populate(
    "userId",
    "username"
  );

  if (!payRoll) {
    res.status(404);
    throw new Error("Resource Not Found!");
  }

  return res.status(200).json({
    _id: payRoll._id,
    user: payRoll.userId.username,
    month: payRoll.month,
    basicSalary: payRoll.basicSalary,
    bonus: payRoll.bonus,
    deductions: payRoll.deductions,
    netSalary: payRoll.netSalary,
  });
});

// Get All Payrolls for admin
const getAllUsersPayrolls = asyncHandler(async (req, res) => {
  const payrolls = await Payroll.find({}).populate("userId", "username email");
  if (!payrolls) {
    res.status(404);
    throw new Error("Resource Not Found!");
  }
  return res.status(200).json(
    payrolls.map((payroll) => ({
      _id: payroll._id,
      username: payroll.userId.username,
      email: payroll.userId.email,
      month: payroll.month,
      basicSalary: payroll.basicSalary,
      bonus: payroll.bonus,
      deductions: payroll.deductions,
      netSalary: payroll.netSalary,
    }))
  );
});

// Create All Payrolls For Admin
const createPayrollByAdmin = asyncHandler(async (req,res)=>{
  const {userId,month,basicSalary,bonus,deductions} = req.body
  const payRoll = new Payroll({
   userId,
   month,
   basicSalary,
   bonus,
   deductions
  })

  await payRoll.save()

   return res.status(200).json("Payroll Created!")
})


// Update Payrolls For Admin

const updatePayrollForAdmin = asyncHandler(async (req, res) => {
  const { month, basicSalary, bonus, netSalary, deductions } = req.body;
  const payroll = await Payroll.findById(req.params.id);
  if (!payroll) {
    res.status(404);
    throw new Error("Resource Not Found!");
  }

  payroll.month = month || payroll.month;
  payroll.basicSalary = basicSalary || payroll.basicSalary;
  payroll.bonus = bonus || payroll.bonus;
  payroll.deductions = deductions || payroll.deductions;
  payroll.save();
  return res.status(200).json(payroll);
});

// Delete Payroll For Admin
const deletePayrollForAdmin = asyncHandler(async (req, res) => {
  const payroll = await Payroll.findById(req.params.id);
  if (!payroll) {
    res.status(404);
    throw new Error("Resource Not Found!");
  }
  await payroll.deleteOne();
  return res.status(200).json("Payroll Deleted!");
});

export {
  getUserPayRolls,
  getSinglePayroll,
  getAllUsersPayrolls,
  updatePayrollForAdmin,
  deletePayrollForAdmin,
  createPayrollByAdmin
};
