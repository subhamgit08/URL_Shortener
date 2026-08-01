import React from "react";
import { motion } from "framer-motion";

// --- Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

// --- Social Links Data ---
const contactLinks = [
  {
    name: "GitHub",
    url: "https://github.com/subhamgit08",
    handle: "@subhamgit08",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/insane_subh/",
    handle: "@insane_subh",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    url: "https://wa.me/9903620778",
    handle: "+91 9903620778",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.12.548 4.187 1.594 6L.045 24l6.113-1.602a11.96 11.96 0 005.873 1.536h.005c6.645 0 12.03-5.384 12.03-12.03S18.676 0 12.031 0zm0 21.921a9.923 9.923 0 01-5.06-1.385l-.362-.215-3.766.987.998-3.673-.236-.376a9.927 9.927 0 01-1.522-5.328c0-5.495 4.47-9.965 9.966-9.965 2.664 0 5.168 1.037 7.051 2.92a9.928 9.928 0 012.915 7.045c-.001 5.495-4.471 9.965-9.965 9.965zm5.474-7.48c-.3-.15-1.777-.878-2.052-.979-.276-.1-.477-.15-.678.15-.202.3-.777.979-.953 1.179-.176.2-.352.226-.653.076-1.517-.76-2.583-1.464-3.557-3.136-.2-.346.2-.326.793-1.511.076-.15.038-.276-.038-.426-.076-.15-.678-1.636-.928-2.242-.243-.591-.49-.51-.678-.52-.176-.01-.376-.01-.577-.01-.2 0-.527.076-.803.376-.276.3-1.054 1.03-1.054 2.511 0 1.48 1.079 2.91 1.23 3.111.15.2 2.122 3.238 5.14 4.542.718.31 1.277.495 1.714.633.722.23 1.38.197 1.897.12.576-.086 1.777-.727 2.028-1.43.25-.702.25-1.303.175-1.43-.075-.125-.276-.2-.576-.35z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/subhamdas-dev/",
    handle: "in/subhamdas-dev",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert("Thanks for your feedback!");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans selection:bg-blue-500/30 py-24 px-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-6xl mx-auto"
      >
        {/* --- Header --- */}
        <motion.div variants={fadeUp} className="mb-16 md:mb-24 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
            Get in touch.
          </h1>
          <p className="text-lg text-neutral-400 max-w-xl">
            Have a project in mind, want to collaborate, or just want to say hi? 
            Drop a message or reach out via socials.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          
          {/* --- Left Column: Social Links --- */}
          <motion.div variants={fadeUp} className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-6">Connect with me</h2>
            
            {contactLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-blue-500/50 hover:bg-neutral-900 transition-colors group"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-800 text-neutral-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                  {link.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{link.name}</h3>
                  <p className="text-sm text-neutral-500">{link.handle}</p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* --- Right Column: Feedback/Contact Form --- */}
          <motion.div variants={fadeUp}>
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-6">Send Feedback</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-400 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows="4"
                    className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                    placeholder="Your thoughts, project details, or feedback..."
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-white text-black font-medium py-3 px-4 rounded-xl hover:bg-blue-500 hover:text-white transition-colors"
                >
                  Send Message
                </motion.button>
              </form>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}