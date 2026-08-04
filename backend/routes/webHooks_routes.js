import dotenv from "dotenv";
dotenv.config();

import express from "express"
import {Webhook} from "svix"
import User from "../models/user.js"


const router = express.Router();

// IMPORTANT: This route requires express.raw() middleware configuration in server.js
router.post("/clerk-webhook", async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET in environment variables.");
    return res.status(500).json({ error: "Webhook secret configuration error" });
  }

  // Extract Svix headers for security verification
  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: "Error occurred - missing Svix headers" });
  }

  const payload = req.body;
  const body = payload.toString(); // req.body must be a raw buffer

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    // Verify payload signature to ensure it genuinely came from Clerk
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Clerk Webhook verification failed:", err.message);
    return res.status(400).json({ success: false, message: err.message });
  }

  const eventType = evt.type;

  // Handle user creation event
  if (eventType === "user.created") {
    const { id, email_addresses } = evt.data;
    const email = email_addresses?.[0]?.email_address || "";

    try {
      // Creates user document defaulting plan to 'free' via Mongoose schema defaults
      await User.create({
        clerkId: id,
        email: email,
        plan: "free", 
      });
      console.log(`New Clerk user [${id}] synced to database with 'free' plan.`);
    } catch (dbError) {
      console.error("Database error saving synchronized Clerk user:", dbError);
      return res.status(500).json({ error: "Database error during user record creation" });
    }
  }

  // Handle user deletion event (Optional cleanup)
  if (eventType === "user.deleted") {
    const { id } = evt.data;
    try {
      await User.findOneAndDelete({ clerkId: id });
      console.log(`Clerk user [${id}] deleted from database.`);
    } catch (dbError) {
      console.error("Database error deleting user:", dbError);
    }
  }

  return res.status(200).json({ success: true, message: "Webhook processed successfully" });
});

export default router;