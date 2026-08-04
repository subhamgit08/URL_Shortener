import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String },
    plan: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free", // Automatically defaults to 'free' on registration
    },
    subscription: {
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
      planStartDate: { type: Date },
      planExpiryDate: { type: Date },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);