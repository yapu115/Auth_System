export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!userRole) {
      return res.status(403).send({ error: "Access denied. No role found." });
    }

    if (!allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .send({ error: "Access denied. Insufficient permissions." });
    }

    next();
  };
};
