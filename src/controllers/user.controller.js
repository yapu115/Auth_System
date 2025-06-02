import jwt from "jsonwebtoken";

const generateToken = ({ user }) => {
  const secretKey = process.env.JWT_SECRET;
  const expiresIn = "1h";

  const id = user.id;
  const username = user.username;

  return jwt.sign({ id, username }, secretKey, {
    expiresIn,
  });
};

const generateRefreshToken = ({ user }) => {
  const secretKey = process.env.JWT_REFRESH_SECRET;
  const expiresIn = "7d";

  return jwt.sign({ id: user.id, username: user.username }, secretKey, {
    expiresIn,
  });
};

export class UserController {
  constructor({ userModel }) {
    this.userModel = userModel;
  }

  register = async (req, res) => {
    const userData = req.body;
    try {
      const user = await this.userModel.register({ userData });
      res.status(201).send(user);
    } catch (error) {
      if (error.message === "Username already exists") {
        // 409 Conflict
        return res.status(409).send({ error: error.message });
      }
      return res.status(400).send({ error: error.message });
    }
  };

  login = async (req, res) => {
    const userData = req.body;
    try {
      const user = await this.userModel.login({ userData });
      const token = generateToken({ user });
      const refreshToken = generateRefreshToken({ user });
      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          nameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .send({ user, token });
    } catch (error) {
      if (error.message === "Account is temporarily locked. Try again later.") {
        // 423 Locked
        res.status(423).send({ error: error.message });
      }

      if (
        error.message === "User not found" ||
        error.message === "Invalid password"
      ) {
        // 401 Unauthorized
        return res.status(401).send({ error: error.message });
      }
      return res.status(400).send(error.message);
    }
  };

  changePassword = async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .send({ error: "Current and new passwords are required" });
    }

    const passwordData = {
      userId,
      currentPassword,
      newPassword,
    };

    try {
      const updatedUser = await this.userModel.changePassword({
        passwordData,
      });

      res.send({ user: updatedUser });
    } catch (error) {
      if (error.message === "User not found") {
        // 404 Not Found
        return res.status(404).send({ error: error.message });
      }
      if (error.message === "Current password is incorrect") {
        // 401 Unauthorized
        return res.status(401).send({ error: error.message });
      }
      return res.status(400).send({ error: error.message });
    }
  };

  refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).send({ error: "No token provided" });
    }

    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      const newAccessToken = jwt.sign(
        { id: payload.id, username: payload.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.send({ accessToken: newAccessToken });
    } catch (error) {
      return res.status(403).send({ error: "Invalid refresh token" });
    }
  };

  logout = (req, res) => {
    res.clearCookie("refreshToken");
    res.send({ message: "Logged out successfully" });
  };
}
