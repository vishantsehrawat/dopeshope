const adminRoleCheck = async (req, res, next) => {
  const userId = req.body.userId; // Assuming "userId" is added to the request body after auth middleware

  try {
    const user = await UserModel.findById(userId);

    if (user && user.role === "admin") {
      // User has an "admin" role, allow access
      next();
    } else {
      // User doesn't have an "admin" role, deny access
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });
    }
  } catch (error) {
    // Handle any errors that may occur during the database query
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  adminRoleCheck,
}; // named export 
