import prisma from "../lib/prisma";

export const authenticateUser = async (req, res, next) => {
  const clerkUserId = req.params.userId;

  if (!clerkUserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error during authentication" });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient permissions" });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Error checking user role" });
    }
  };
};
