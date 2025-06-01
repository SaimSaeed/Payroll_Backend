import mongoose from "mongoose";

const PayrollSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    month: {
      type: String,
      required: true,
    },
    basicSalary: {
      type: Number,
      required: true,
    },
    bonus: {
      type: Number,
      default: 0,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    netSalary: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

//  calculating net salary
PayrollSchema.pre("save", function (next) {
  this.netSalary = this.basicSalary + this.bonus - this.deductions;
  next();
});

const Payroll = mongoose.model("Payroll", PayrollSchema);

export default Payroll;
