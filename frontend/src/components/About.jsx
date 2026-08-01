import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// --- Animation Variants ---
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const MotionLink = motion.create(Link);

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

// --- Placeholder Data ---
const skills = [
    "JavaScript", "React", "Node.js", "Express.js" , "Tailwind CSS",
    "Framer Motion", "Three.js", "HTML Canvas", "MongoDB"
];

const experience = [
    {
        year: "2023 - Present",
        role: "Senior Frontend Engineer",
        company: "TechNova Inc.",
        description: "Spearheaded the transition to a modern React architecture, improving load times by 40% and mentoring junior devs.",
    },
    {
        year: "2020 - 2023",
        role: "Full Stack Developer",
        company: "Creative Digital",
        description: "Built scalable web applications, developed interactive UI components, and integrated third-party APIs.",
    },
    {
        year: "2018 - 2020",
        role: "Junior Web Developer",
        company: "Startup Hub",
        description: "Designed and implemented responsive landing pages and maintained legacy codebase.",
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans selection:bg-blue-500/30">
            <div className="max-w-4xl mx-auto px-6 py-24">

                {/* --- Hero Section --- */}
                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="mb-32"
                >
                    <motion.div variants={fadeUp} className="w-24 h-24 mb-8 rounded-full overflow-hidden border-2 border-neutral-800 bg-neutral-900">
                        {/* Replace src with your actual image */}
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                    <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">
                        Hi, I'm a <span className="text-blue-500">Creative Developer</span> building digital experiences.
                    </motion.h1>
                    <motion.p variants={fadeUp} className="text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed">
                        I specialize in crafting immersive, interactive, and high-performance web applications. I love bridging the gap between design and engineering to create products that not only function flawlessly but feel magical to use.
                    </motion.p>
                </motion.section>

                {/* --- Skills Section --- */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeUp}
                    className="mb-32"
                >
                    <h2 className="text-2xl font-semibold mb-8 text-white">Technologies I use</h2>
                    <motion.div
                        variants={staggerContainer}
                        className="flex flex-wrap gap-3"
                    >
                        {skills.map((skill, index) => (
                            <motion.span
                                key={index}
                                variants={fadeUp}
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.1)", borderColor: "rgba(59, 130, 246, 0.5)" }}
                                className="px-4 py-2 border border-neutral-800 bg-neutral-900/50 rounded-full text-sm font-medium text-neutral-300 transition-colors cursor-default"
                            >
                                {skill}
                            </motion.span>
                        ))}
                    </motion.div>
                </motion.section>

                {/* --- Experience Timeline --- */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeUp}
                >
                    <h2 className="text-2xl font-semibold mb-12 text-white">My Journey</h2>
                    <div className="relative border-l border-neutral-800 pl-8 ml-4 md:ml-0 space-y-12">
                        {experience.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative"
                            >
                                {/* Timeline Dot */}
                                <div className="absolute -left-10.25 top-1.5 w-4 h-4 rounded-full bg-neutral-900 border-2 border-blue-500" />

                                <span className="text-sm text-blue-400 font-mono tracking-wide">{item.year}</span>
                                <h3 className="text-xl font-medium text-white mt-2">{item.role}</h3>
                                <h4 className="text-md text-neutral-400 mb-3">{item.company}</h4>
                                <p className="text-neutral-500 leading-relaxed max-w-2xl">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* --- Footer / CTA --- */}
                {/* <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-32 pt-16 border-t border-neutral-900 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Let's build something great.</h2>
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="mailto:hello@example.com"
            className="inline-block bg-white text-black font-medium px-8 py-3 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
          >
            Get in touch
          </motion.a>
        </motion.section> */}

                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="mt-32 pt-16 border-t border-neutral-900 text-center"
                >
                    <h2 className="text-3xl font-bold text-white mb-6">Let's build something great.</h2>

                    {/* 2. Swap motion.a for MotionLink and change href to to */}
                    <MotionLink
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        to="/contact"
                        className="inline-block bg-white text-black font-medium px-8 py-3 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
                    >
                        Get in touch
                    </MotionLink>
                </motion.section>

            </div>
        </div>
    );
}