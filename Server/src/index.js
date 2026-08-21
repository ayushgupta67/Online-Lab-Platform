import express from "express";
import cookieParser from 'cookie-parser';
import {connectDB} from "./lib/db.js";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
const PORT = process.env.PORT
const __dirname = path.resolve();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))

app.use(express.json())
app.use(cookieParser());
// Import Routes

import compilerRoutes from "./routes/compile.route.js"; // ES6
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import classroomRoutes from  "./routes/classroom.routes.js"

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/compile", compilerRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/classroom",classroomRoutes);

// set instruction for production
console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../Client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Client/dist/index.html"));
  });
}
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  connectDB();
});
