import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
// connect database
connectDB();
// parse json
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "https://payroll-frontend-self.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};
app.get("/",(req,res)=>{
res.send("The API is Running!")
})

app.use(cors(corsOptions));
app.use("/auth", authRoutes);
app.use("/payrolls", payrollRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("Server is Running", PORT);
});

