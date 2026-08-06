import { Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/user.js";

const router = Router();

// Helper to get Razorpay instance with active environment variables
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error("Razorpay API keys are missing in process.env");
  }

  return new Razorpay({ key_id, key_secret });
};

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount >= 100 paise (1 INR)
    if (!amount || amount < 100) {
      return res.status(400).json({ error: "Amount must be at least 100 paise." });
    }

    const razorpay = getRazorpayInstance();

    const options = {
      amount: Number(amount), // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    if (error.statusCode === 401 || error.message.includes("keys are missing")) {
      return res.status(401).json({ error: "Razorpay authentication failed. Check API keys in .env" });
    }
    return res.status(500).json({ error: "Failed to create payment order" });
  }
});

router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, clerkId, plan } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !clerkId || !plan) {
      return res.status(400).json({ error: "Missing required payment verification parameters" });
    }

    if (!["pro", "premium"].includes(plan)) {
      return res.status(400).json({ error: "Invalid subscription plan selected" });
    }

    // Generate expected HMAC-SHA256 signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    // Compare signatures
    if (expectedSignature === razorpay_signature) {
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1); // 1-month duration

      // Update user tier and subscription data
      const updatedUser = await User.findOneAndUpdate(
        { clerkId: clerkId },
        {
          plan: plan,
          subscription: {
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            planStartDate: new Date(),
            planExpiryDate: expiryDate,
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found in database" });
      }

      return res.status(200).json({ 
        success: true, 
        message: `Successfully upgraded to ${plan} plan!`,
        plan: updatedUser.plan 
      });
    } else {
      return res.status(400).json({ success: false, error: "Invalid payment signature" });
    }
  } catch (error) {
    console.error("Error verifying Razorpay signature:", error);
    return res.status(500).json({ error: "Internal server error during verification" });
  }
});

router.post("/set-free-plan", async (req, res) => {
  try {
    const { clerkId, plan } = req.body;

    if (!clerkId) {
      return res.status(400).json({ error: "Missing clerkId" });
    }

    if (plan !== "free") {
      return res.status(400).json({ error: "Invalid plan type for this endpoint" });
    }

    // Update user to free and clear their subscription data
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: clerkId },
      {
        plan: "free",
        subscription: {
          razorpayOrderId: null,
          razorpayPaymentId: null,
          planStartDate: null,
          planExpiryDate: null,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Successfully switched to free plan",
      plan: updatedUser.plan 
    });
  } catch (error) {
    console.error("Error setting free plan:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;