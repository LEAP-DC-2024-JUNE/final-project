import prisma from "../lib/prisma.js";

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
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
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

// export const syncUser = async (req, res) => {
//   const clerkId = req.clerkId; // now set by middleware
//   const { email, role } = req.body;

//   if (!clerkId || !email || !role) {
//     return res.status(400).json({ success: false, error: "Missing data" });
//   }

//   try {
//     let user = await prisma.user.findUnique({ where: { clerkId } });

//     if (!user) {
//       user = await prisma.user.create({
//         data: {
//           clerkId,
//           email,
//           role: role === "INSTRUCTOR" ? "INSTRUCTOR" : "STUDENT",
//         },
//       });
//     }

//     return res.status(200).json({ success: true, user });
//   } catch (error) {
//     return res.status(500).json({ success: false, error: error.message });
//   }
// };

export const syncUser = async (req, res) => {
  const clerkId = req.clerkId;
  const { email, role } = req.body;

  console.log("SYNC REQUEST:");
  console.log("Clerk ID:", clerkId);
  console.log("Email:", email);
  console.log("Role:", role);

  if (!clerkId || !email || !role) {
    console.log("Missing data");
    return res.status(400).json({ success: false, error: "Missing data" });
  }

  try {
    let user = await prisma.user.findUnique({ where: { clerkId } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId,
          email,
          role: role === "INSTRUCTOR" ? "INSTRUCTOR" : "STUDENT",
        },
      });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error syncing user:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
