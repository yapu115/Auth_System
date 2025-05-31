import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { registerSchema, loginSchema } from "../validations/user.validation.js";
import { validate } from "../middlewares/validate.js";
import { registerLimiter, loginLimiter } from "../middlewares/rateLimiters.js";

export const userRouter = ({ userModel }) => {
  const userRouter = Router();

  const userController = new UserController({ userModel });

  userRouter.post(
    "/register",
    registerLimiter,
    validate(registerSchema),
    userController.register
  );
  userRouter.post(
    "/login",
    loginLimiter,
    validate(loginSchema),
    userController.login
  );
  userRouter.post("/logout", userController.logout);

  userRouter.post("/refresh", userController.refreshToken);

  userRouter.get("/profile", verifyToken, (req, res) => {
    res.send({ message: "Access granted", user: req.user });
  });

  return userRouter;
};
