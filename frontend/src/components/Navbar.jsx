"use client";

import * as React from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Navigation, Menu } from "lucide-react";
import { cn } from "../lib/utils";
import { Link } from "react-router-dom";
import { Show, SignUpButton, UserButton } from "@clerk/react";
import { dark } from "@clerk/themes";

const MotionLink = motion.create(Link);

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const EXPAND_SCROLL_THRESHOLD = 80;

const containerVariants = {
  expanded: {
    y: 0,
    opacity: 1,
    width: "auto",
    transition: {
      y: { type: "spring", damping: 18, stiffness: 250 },
      opacity: { duration: 0.3 },
      type: "spring",
      damping: 20,
      stiffness: 300,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  collapsed: {
    y: 0,
    opacity: 1,
    width: "3rem",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const logoVariants = {
  expanded: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -25, rotate: -180, transition: { duration: 0.3 } },
};

const itemVariants = {
  expanded: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.2 } },
};

const collapsedIconVariants = {
  expanded: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  collapsed: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 300,
      delay: 0.15,
    }
  },
};

export function AnimatedNavFramer() {
  const [isExpanded, setExpanded] = React.useState(true);

  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;

    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false);
      scrollPositionOnCollapse.current = latest;
    }
    else if (!isExpanded && latest < previous && (scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD)) {
      setExpanded(true);
    }

    lastScrollY.current = latest;
  });

  const handleNavClick = (e) => {
    if (!isExpanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
      
      <Show when="signed-in">
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={containerVariants}
          whileHover={!isExpanded ? { scale: 1.05 } : {}}
          whileTap={!isExpanded ? { scale: 0.95 } : {}}
          onClick={handleNavClick}
          className={cn(
            "relative flex items-center overflow-hidden rounded-full border border-neutral-800/80 bg-neutral-900/60 shadow-lg shadow-black/50 backdrop-blur-xl h-12 text-white",
            !isExpanded && "cursor-pointer justify-center hover:border-neutral-700 hover:bg-neutral-800/80 transition-colors"
          )}
        >
          {/* Logo / Brand Icon */}
          <motion.div
            variants={logoVariants}
            className="shrink-0 flex items-center font-semibold pl-4 pr-2 text-white"
          >
            <div className="p-1.5 rounded-full bg-blue-500/10 text-blue-400">
              <Navigation className="h-4 w-4" />
            </div>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            className={cn(
              "flex items-center gap-1 sm:gap-2 pr-4",
              !isExpanded && "pointer-events-none"
            )}
          >
            {navItems.map((item) => (
              <MotionLink
                key={item.name}
                to={item.href}
                variants={itemVariants}
                onClick={(e) => e.stopPropagation()}
                className="text-sm font-medium text-neutral-400 hover:text-blue-400 hover:bg-white/5 transition-all px-3 py-1.5 rounded-full block"
              >
                {item.name}
              </MotionLink>
            ))}
          </motion.div>

          {/* Collapsed Menu Icon */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              variants={collapsedIconVariants}
              animate={isExpanded ? "expanded" : "collapsed"}
              className="text-neutral-400"
            >
              <Menu className="h-5 w-5" />
            </motion.div>
          </div>
        </motion.nav>

        {/* User Avatar - Wrapped in matching glassmorphism */}
        <div className="shrink-0 flex items-center justify-center h-12 w-12 rounded-full border border-neutral-800/80 bg-neutral-900/60 backdrop-blur-xl shadow-lg">
          <UserButton 
            afterSignOutUrl="/" 
            appearance={{ 
              elements: { userButtonAvatarBox: "h-8 w-8" },
            }} 
          />
        </div>
      </Show>

      <Show when="signed-out">
        {/* Styled Container for Register state */}
        <div className="flex items-center rounded-full border border-neutral-800/80 bg-neutral-900/60 p-1.5 backdrop-blur-xl shadow-lg">
          <SignUpButton mode="modal">
            <button className="px-6 py-2 rounded-full font-medium text-sm bg-white text-black hover:bg-blue-500 hover:text-white transition-colors duration-300">
              Register
            </button>
          </SignUpButton>
        </div>
      </Show>

    </div>
  );
}
