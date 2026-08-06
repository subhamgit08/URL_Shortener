import { getAuth } from "@clerk/express";
import User from "../models/user.js";

export const getUserPlan = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ success:false , error: "Unauthorized" });
    }

    // Find user in your database by Clerk ID
    const user = await User.findOne({ clerkId: userId, });

    if (!user) {
      // Default to 'free' plan if user record doesn't exist yet
      return res.status(200).json({ plan: "free" });
    }

    // Returns: { plan: "free" | "pro" | "premium" }
    return res.status(200).json({ plan: user.plan });
  } catch (error) {
    console.error("Error fetching user plan:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};