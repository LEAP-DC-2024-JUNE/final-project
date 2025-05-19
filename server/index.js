import express from "express";
import dotenv from "dotenv";
import { Clerk } from "@clerk/clerk-sdk-node";

// Load environment variables
dotenv.config();

// Initialize Express app and Clerk
const app = express();
const clerk = new Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

// Middleware to parse JSON bodies
app.use(express.json());

// Route to set user role
app.post("/api/set-role", async (req, res) => {
  const { userId, role } = req.body;

  if (!userId || !role) {
    return res.status(400).json({ error: "Missing userId or role" });
  }

  try {
    await clerk.users.updateUserMetadata(userId, {
      unsafeMetadata: { role },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Error updating role:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
