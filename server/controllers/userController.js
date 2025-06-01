import prisma from "../lib/prisma.js";
import { getAuth } from "@clerk/express";

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete user" });
  }
};

export const syncUser = async (req, res) => {
  try {
    const { userId: clerkId } = getAuth(req);
    const { email, role } = req.body;

    if (!clerkId || !email || !role) {
      return res.status(400).json({ success: false, error: "Missing data" });
    }

    let user = await prisma.user.findUnique({ where: { clerkId } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId,
          email,
          // role: role === "INSTRUCTOR" ? "INSTRUCTOR" : "STUDENT",
          role,
        },
      });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("🔥 Error syncing user:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while syncing user.",
    });
  }
};
