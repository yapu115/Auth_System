import bcrypt from "bcrypt";
import { User } from "../config/db.config.js";

const MAX_ATTEMPTS = 5; // Maximum login attempts
const LOCK_TIME = 15 * 60 * 1000; // Lock time in milliseconds (15 minutes)

export class UserModel {
  // Register user
  static async register({ userData }) {
    const { username, password } = userData;

    try {
      // verify existing user
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        throw new Error("Username already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await User.create({
        username,
        password: hashedPassword,
      });

      await newUser.save();
      return {
        message: "User created successfully",
        userData: {
          id: newUser._id,
          username: newUser.username,
        },
      };
    } catch (err) {
      if (err.message === "Username already exists") {
        throw new Error(err.message);
      }
      throw new Error("Error creating user");
    }
  }

  // Login user
  static async login({ userData }) {
    const { username, password } = userData;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }

      if (user.isLocked()) {
        throw new Error("Account is temporarily locked. Try again later.");
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        await user.incrementLoginAttempts();

        if (user.LoginAttempts + 1 >= MAX_ATTEMPTS) {
          user.lockUntil = Date.now() + LOCK_TIME; // Lock the account
          await user.save();
          throw new Error("Account is temporarily locked. Try again later.");
        }

        throw new Error("Invalid password");
      }

      user.loginAttempts = 0;
      user.lockUntil = undefined;
      await user.save();

      return {
        username,
        id: user._id,
      };
    } catch (err) {
      if (
        err.message === "User not found" ||
        err.message === "Invalid password"
      ) {
        throw new Error(err.message);
      }
      throw new Error("Error during login");
    }
  }
}
