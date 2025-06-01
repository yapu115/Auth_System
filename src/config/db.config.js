import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0,
  },
  lockUntil: {
    type: Date,
  },
});

// Verify if the user is locked out
userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Increment login attempts and set lockUntil if necessary
userSchema.methods.incrementLoginAttempts = function () {
  const updates = { $inc: { loginAttempts: 1 } };

  if (this.lockUntil && this.lockUntil < Date.now()) {
    updates.$set = { loginAttempts: 1 };
    updates.$unset = { lockUntil: 1 };
  }

  return this.updateOne(updates);
};

export const User = mongoose.model("User", userSchema);

export default connectDB;
