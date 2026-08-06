import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth, SignInButton } from "@clerk/react";
import axios from "axios";

// --- Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    limit: 10,
    features: ["Shorten up to 10 URLs/min", "Standard Analytics", "Community Support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 10,
    limit: 30,
    features: ["Shorten up to 30 URLs/min", "Advanced Analytics", "Custom Aliases", "Priority Support"],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 20,
    limit: 50,
    features: ["Shorten up to 50 URLs/min", "Real-time Edge Analytics", "API Access", "24/7 Dedicated Support"],
  },
];

export default function Pricing() {
  const [userPlan, setUserPlan] = useState("free");
  const [isProcessing, setIsProcessing] = useState(false);
  const { isSignedIn, getToken, isLoaded, userId } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_ENDPOINT || "http://localhost:3000";

  // Dynamically load Razorpay SDK script on mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Fetch Current Plan
  useEffect(() => {
    async function fetchPlan() {
      if (!isSignedIn) return;
      try {
        const token = await getToken();
        const response = await axios.get(`${backendUrl}/api/user/getPlan`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data?.plan) {
          setUserPlan(response.data.plan);
        }
      } catch (err) {
        console.error("Failed to fetch user plan", err);
      }
    }
    fetchPlan();
  }, [isSignedIn, getToken]);

  // Handle Razorpay Checkout
  const handlePayment = async (plan) => {
    if (plan.price === 0) {
      const token = await getToken();
      const res = await axios.post(
        `${backendUrl}/api/payment/set-free-plan`,
        { clerkId: userId, plan: plan.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setUserPlan(plan.id);
        alert("Successfully switched to the Free Plan!");
      }
      setIsProcessing(false);
      return;
    }
    setIsProcessing(true);

    try {
      if (!window.Razorpay) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        setIsProcessing(false);
        return;
      }

      const token = await getToken();

      // 1. Create order on your backend (Converting Rupees to Paise: price * 100)
      const orderResponse = await axios.post(
        `${backendUrl}/api/payment/create-order`,
        { planId: plan.id, amount: plan.price * 100 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount,
        currency: "INR",
        name: "URL Shortener App",
        description: `Upgrade to ${plan.name} Plan`,
        order_id: orderResponse.data.order_id,
        handler: async function (response) {
          try {
            // 2. Verify payment on your backend
            const verifyRes = await axios.post(
              `${backendUrl}/api/payment/verify-payment`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                plan: plan.id,
                clerkId: userId
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              setUserPlan(plan.id);
              alert(`Successfully upgraded to ${plan.name} Plan!`);
            }
          } catch (verifyErr) {
            console.error("Payment verification failed", verifyErr);
            alert("Payment signature verification failed. Contact support.");
          }
        },
        theme: {
          color: "#3b82f6" // matches your blue-500
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        alert(`Payment Failed: ${response.error.description}`);
      });

      rzp.open();

    } catch (error) {
      console.error("Payment initialization failed", error);
      alert("Something went wrong initializing the payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans selection:bg-blue-500/30 pt-32 pb-24 px-6 relative">

      {/* Background Glow */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-6xl mx-auto relative z-10"
      >
        <motion.div variants={fadeUp} className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Simple, transparent pricing.
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Scale your brand's reach with higher limits and advanced analytics. Choose the perfect plan for your needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan) => {
            const isCurrentPlan = userPlan === plan.id;

            return (
              <motion.div
                key={plan.id}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                className={`relative p-8 rounded-3xl backdrop-blur-md flex flex-col h-full ${plan.popular
                    ? "bg-blue-900/10 border-2 border-blue-500/50 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)] md:scale-105"
                    : "bg-neutral-900/40 border border-neutral-800/80"
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <h3 className="text-2xl font-semibold text-white mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">₹{plan.price}</span>
                  <span className="text-neutral-500">/month</span>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-neutral-300">
                      <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {!isLoaded ? (
                  <div className="w-full py-4 bg-neutral-800 rounded-xl animate-pulse"></div>
                ) : !isSignedIn ? (
                  <SignInButton mode="modal">
                    <button className="w-full py-4 rounded-xl font-medium transition-colors bg-white text-black hover:bg-neutral-200">
                      Sign in to Upgrade
                    </button>
                  </SignInButton>
                ) : (
                  <button
                    disabled={isCurrentPlan || isProcessing}
                    onClick={() => handlePayment(plan)}
                    className={`w-full py-4 rounded-xl font-medium transition-colors ${isCurrentPlan
                        ? "bg-neutral-800 text-neutral-400 cursor-not-allowed border border-neutral-700"
                        : plan.popular
                          ? "bg-blue-600 text-white hover:bg-blue-500"
                          : "bg-white text-black hover:bg-neutral-200"
                      }`}
                  >
                    {isCurrentPlan ? "Current Plan" : isProcessing ? "Processing..." : `Choose ${plan.name}`}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}