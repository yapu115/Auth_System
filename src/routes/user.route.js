import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} from "../validations/user.validation.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import { registerLimiter, loginLimiter } from "../middlewares/rateLimiters.js";
import { checkRole } from "../middlewares/role.middleware.js";

export const userRouter = ({ userModel }) => {
  const userRouter = Router();

  const userController = new UserController({ userModel });

  // Register
  userRouter.post(
    "/register",
    registerLimiter,
    validate(registerSchema),
    userController.register
  );
  // Login
  userRouter.post(
    "/login",
    loginLimiter,
    validate(loginSchema),
    userController.login
  );
  // Change Password
  userRouter.post(
    "/change-password",
    verifyToken,
    validate(changePasswordSchema),
    userController.changePassword
  );

  // Logout
  userRouter.post("/logout", userController.logout);
  // Refresh Token
  userRouter.post("/refresh", userController.refreshToken);

  // Get User Profile
  userRouter.get("/profile", verifyToken, (req, res) => {
    res.send({ message: "Access granted", user: req.user });
  });

  // Get All Users (Admin only)
  userRouter.get(
    "/all",
    verifyToken,
    checkRole("admin"),
    userController.getAllUsers
  );

  return userRouter;
};
