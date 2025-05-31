import express, { json } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.route.js";

export const createApp = async ({ userModel }) => {
  // config
  dotenv.config();
  const app = express();
  app.use(json());
  app.use(cookieParser());

  await connectDB();

  // routes
  app.use("/auth", userRouter({ userModel }));

  // error
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Server error");
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};
