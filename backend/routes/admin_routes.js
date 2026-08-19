import { Router } from "express";
import redisClient from "../config/redis.js";

const router = Router();

router.post("/publish", async (req, res) => {
  const { message, email } = req.body;

  // Security Check: Ensure only this email can publish
  if (email !== "projectmail524@gmail.com") {
    return res.status(403).json({ success: false, error: "Unauthorized access" });
  }

  try {
    // Publish the message to the Redis channel
    await redisClient.publish("admin_notifications", message);
    
    res.status(200).json({ success: true, message: "Published successfully!" });
  } catch (error) {
    console.error("Publish error:", error);
    res.status(500).json({ success: false, error: "Failed to publish message" });
  }
});

export default router;