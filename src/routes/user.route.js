import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

export const userRouter = ({ userModel }) => {
  const userRouter = Router();

  const userController = new UserController({ userModel });

  userRouter.post("/register", userController.register);
  userRouter.post("/login", userController.login);
  userRouter.post("/logout", userController.logout);

  userRouter.post("/refresh", userController.refreshToken);

  userRouter.get("/profile", verifyToken, (req, res) => {
    res.send({ message: "Access granted", user: req.user });
  });

  return userRouter;
};
