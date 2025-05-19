import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const getAllUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(404).JSON(users);
  } catch (err) {
    console.log(err);
  }
};
