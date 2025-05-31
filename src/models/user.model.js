import bcrypt from "bcrypt";
import { User } from "../config/db.config.js";

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

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }

      console.log(user._id);
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
