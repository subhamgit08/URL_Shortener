import React, { useState } from "react";
import { motion } from "framer-motion";
import { Show, SignUpButton } from "@clerk/react";
import { Link } from "react-router-dom";

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

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

// --- Mock Data ---
const features = [
    {
        title: "Lightning Fast",
        description: "Our global edge network ensures your links redirect instantly, anywhere in the world.",
        icon: (
            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
    {
        title: "High-Performance with Caching",
        description: "Engineered with zero-lag memory caching to guarantee your shortened links load at maximum speed.",
        icon: (
            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
    },
    {
        title: "Custom Aliases",
        description: "Ditch the random strings. Create memorable, branded links that users actually want to click.",
        icon: (
            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
        ),
    },
];

const testimonials = [
    {
        name: "Sarah Jenkins",
        role: "Marketing Director at TechFlow",
        comment: "This is hands down the best URL shortener we've used. The interface is just gorgeous.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4",
    },
    {
        name: "David Chen",
        role: "Freelance Content Creator",
        comment: "I love how fast it is to generate links. The custom aliases have seriously improved my click-through rates on Twitter and YouTube.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=c0aede",
    },
    {
        name: "Elena Rodriguez",
        role: "E-commerce Founder",
        comment: "Integrating this into our SMS campaigns was a breeze. It's reliable, doesn't break, and the dark mode is a huge plus for my late-night work sessions.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=ffdfbf",
    },
];

export default function HomePage() {
    const [url, setUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleShorten = (e) => {
        e.preventDefault();
        if (!url) return;
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setUrl("");
            alert("Link successfully shortened! (Demo)");
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans selection:bg-blue-500/30 overflow-hidden relative pb-24">

            {/* Background Glow Effect */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 pt-32 md:pt-48 relative z-10">

                {/* --- Hero Section --- */}
                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="text-center max-w-4xl mx-auto mb-32"
                >
                    <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        v2.0 is now live
                    </motion.div>

                    <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
                        Shorten your links. <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                            Expand your reach.
                        </span>
                    </motion.h1>

                    <motion.p variants={fadeUp} className="text-lg md:text-xl text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        The minimal, lightning-fast URL shortener designed for modern teams. Create custom links, track performance, and scale your brand.
                    </motion.p>

                    <motion.div variants={fadeUp} className="flex justify-center">
                        <Show when={"signed-out"}>
                            <SignUpButton mode="modal">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white text-black hover:bg-blue-500 hover:text-white font-medium text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_0px_rgba(59,130,246,0.6)]"
                                >
                                    Get Started for Free
                                </motion.button>
                            </SignUpButton>
                        </Show>
                        <Show when={"signed-in"}>
                            <Link to={"/url-shortener"}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-blue-600 text-white hover:bg-blue-500 font-medium text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_0px_rgba(59,130,246,0.7)] flex items-center justify-center gap-2"
                                >
                                    Let's Shorten your links
                                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </motion.button>
                            </Link>
                        </Show>
                    </motion.div>
                </motion.section>

                {/* --- Features Section --- */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="py-24 border-t border-neutral-800/50"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeUp}
                                whileHover={{ y: -5 }}
                                className="p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-sm hover:border-blue-500/30 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                <p className="text-neutral-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* --- Testimonials Section --- */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="py-24 border-t border-neutral-800/50"
                >
                    <motion.div variants={fadeUp} className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Loved by creators and teams.</h2>
                        <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                            Don't just take our word for it. Here's what our community is saying about our link management platform.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeUp}
                                className="p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 flex flex-col justify-between relative overflow-hidden group"
                            >
                                {/* Subtle hover gradient inside card */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10">
                                    <div className="flex gap-1 mb-6">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg key={star} className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-neutral-300 text-lg leading-relaxed mb-8">
                                        "{testimonial.comment}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 relative z-10">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full border border-neutral-700 bg-neutral-800"
                                    />
                                    <div>
                                        <h4 className="text-white font-medium">{testimonial.name}</h4>
                                        <p className="text-sm text-neutral-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

            </div>
        </div>
    );
}