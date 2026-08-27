"use client";

import * as React from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Navigation, Menu, Bell } from "lucide-react";
import { cn } from "../lib/utils";
import { Link } from "react-router-dom";
import { Show, SignUpButton, useAuth, UserButton, useUser } from "@clerk/react";
import axios from "axios";
import { io } from "socket.io-client";
import NotificationCenter from "./NotificationCenter";

const MotionLink = motion.create(Link);

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const EXPAND_SCROLL_THRESHOLD = 80;

const containerVariants = {
  expanded: {
    y: 0, opacity: 1, width: "auto",
    transition: { y: { type: "spring", damping: 18, stiffness: 250 }, opacity: { duration: 0.3 }, type: "spring", damping: 20, stiffness: 300, staggerChildren: 0.07, delayChildren: 0.2 },
  },
  collapsed: {
    y: 0, opacity: 1, width: "3rem",
    transition: { type: "spring", damping: 20, stiffness: 300, when: "afterChildren", staggerChildren: 0.05, staggerDirection: -1 },
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
  collapsed: { opacity: 1, scale: 1, transition: { type: "spring", damping: 15, stiffness: 300, delay: 0.15 } },
};

export function AnimatedNavFramer() {
  const [isExpanded, setExpanded] = React.useState(true);
  const [userPlan, setUserPlan] = React.useState("free");

  // Notification & Socket States
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const [socket, setSocket] = React.useState(null);

  const [notifications, setNotifications] = React.useState(() => {
    const saved = localStorage.getItem("saved_notifications");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });

  const notifRef = React.useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_ENDPOINT || "http://localhost:3000";

  const { user, isLoaded } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdmin = userEmail === "projectmail524@gmail.com";
  const { isSignedIn, getToken } = useAuth();

  React.useEffect(() => {
    const newSocket = io(backendUrl);
    setSocket(newSocket);

    newSocket.on("new_admin_message", (message) => {
      setNotifications((prev) => {
        const updatedNotifications = [message, ...prev].slice(0, 10);
        localStorage.setItem("saved_notifications", JSON.stringify(updatedNotifications));
        return updatedNotifications;
      });
    });

    return () => newSocket.disconnect();
  }, [backendUrl]);

  React.useEffect(() => {
    const savedSub = localStorage.getItem("hasSubscribed") === "true";
    setIsSubscribed(savedSub);

    if (socket && savedSub) {
      socket.emit("subscribe_to_notifications", { email: userEmail || "Anonymous" });
    }
  }, [socket, userEmail]);

  const handleSubscribe = async () => {
    try {
      const token = await getToken();

      await axios.post(
        `${backendUrl}/api/subscribe`,
        {
          email: userEmail
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Subscribe this socket to future admin notifications
      socket?.emit("subscribe_to_notifications", {
        userId: user?.id
      });

      localStorage.setItem("hasSubscribed", "true");
      setIsSubscribed(true);

      // Optional immediate UI notification
      setNotifications((prev) => {
        const updated = [
          "You have successfully subscribed to notifications!",
          ...prev
        ].slice(0, 10);

        localStorage.setItem(
          "saved_notifications",
          JSON.stringify(updated)
        );

        return updated;
      });

    } catch (error) {
      console.error("Subscription failed:", error);
    }
  };

  const handleUnsubscribe = () => {
    if (socket)
      socket?.emit("unsubscribe_from_notifications", {
        userId: user?.id
      });
    localStorage.removeItem("hasSubscribed");
    setIsSubscribed(false);
  };

  // NEW: Delete individual notification handler
  const handleDeleteNotification = (indexToDelete) => {
    setNotifications((prev) => {
      const updatedNotifications = prev.filter((_, idx) => idx !== indexToDelete);
      localStorage.setItem("saved_notifications", JSON.stringify(updatedNotifications));
      return updatedNotifications;
    });
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    async function fetchPlan() {
      if (!isSignedIn) return;
      try {
        const token = await getToken();
        const response = await axios.get(`${backendUrl}/api/user/getPlan`, { headers: { Authorization: `Bearer ${token}` } });
        if (response.data?.plan) setUserPlan(response.data.plan);
      } catch (err) {
        console.error("Failed to fetch user plan", err);
      }
    }
    fetchPlan();
  }, [isSignedIn, getToken, backendUrl]);

  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false);
      scrollPositionOnCollapse.current = latest;
    } else if (!isExpanded && latest < previous && (scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD)) {
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

  const planConfig = {
    free: { ring: "ring-2 ring-slate-300 shadow-[0_0_10px_rgba(203,213,225,0.6)]", badgeText: "f", badgeBg: "bg-slate-300 text-slate-900" },
    pro: { ring: "ring-2 ring-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.7)]", badgeText: "p", badgeBg: "bg-amber-400 text-black font-bold" },
    premium: { ring: "ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]", badgeText: "◆", badgeBg: "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold" },
  };

  const currentPlan = planConfig[userPlan] || planConfig.free;

  return (
    <div className="fixed top-4 sm:top-8 left-0 w-full px-4 sm:px-6 md:px-8 z-50 flex items-center justify-between pointer-events-none">

      <div className="hidden md:flex flex-1" />

      {/* CENTER: Navigation Pill */}
      <div className="flex-1 md:flex-none flex justify-start md:justify-center pointer-events-auto">
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={containerVariants}
          whileHover={!isExpanded ? { scale: 1.05 } : {}}
          whileTap={!isExpanded ? { scale: 0.95 } : {}}
          onClick={handleNavClick}
          className={cn("relative flex items-center overflow-hidden rounded-full border border-neutral-800/80 bg-neutral-900/60 shadow-lg shadow-black/50 backdrop-blur-xl h-12 text-white shrink-0", !isExpanded && "cursor-pointer justify-center hover:border-neutral-700 hover:bg-neutral-800/80 transition-colors")}
        >
          <motion.div variants={logoVariants} className="shrink-0 flex items-center font-semibold pl-3 sm:pl-4 pr-1 sm:pr-2 text-white">
            <div className="p-1.5 rounded-full bg-blue-500/10 text-blue-400">
              <Navigation className="h-4 w-4" />
            </div>
          </motion.div>

          <motion.div className={cn("flex items-center gap-0.5 sm:gap-1 pr-3 sm:pr-4", !isExpanded && "pointer-events-none")}>
            {navItems.map((item) => (
              <MotionLink key={item.name} to={item.href} variants={itemVariants} onClick={(e) => e.stopPropagation()} className="text-xs sm:text-sm font-medium text-neutral-400 hover:text-blue-400 hover:bg-white/5 transition-all px-2.5 sm:px-3 py-1.5 rounded-full block whitespace-nowrap">
                {item.name}
              </MotionLink>
            ))}

            {isLoaded && isAdmin && (
              <MotionLink key="admin" to="/admin-dashboard" variants={itemVariants} onClick={(e) => e.stopPropagation()} className="text-xs sm:text-sm font-medium text-neutral-400 hover:text-blue-400 hover:bg-white/5 transition-all px-2.5 sm:px-3 py-1.5 rounded-full block whitespace-nowrap">
                Admin
              </MotionLink>
            )}
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div variants={collapsedIconVariants} animate={isExpanded ? "expanded" : "collapsed"} className="text-neutral-400">
              <Menu className="h-5 w-5" />
            </motion.div>
          </div>
        </motion.nav>
      </div>

      {/* RIGHT CONTROLS: Notification + User Auth */}
      <div className="flex-1 flex justify-end items-center gap-2 sm:gap-3 pointer-events-auto" ref={notifRef}>

        {/* NOTIFICATION POPOVER TRIGGER */}
        <div className="relative">
          {isSubscribed ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative flex items-center justify-center h-12 w-12 rounded-full border border-neutral-800/80 bg-neutral-900/60 backdrop-blur-xl shadow-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute top-3.5 right-3.5 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="flex items-center gap-2 h-12 px-4 rounded-full border border-blue-500/50 bg-blue-500/10 backdrop-blur-xl shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] text-blue-400 hover:bg-blue-500/20 hover:border-blue-400 transition-all"
            >
              <Bell className="h-4 w-4" />
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap hidden sm:block">Subscribe</span>
            </motion.button>
          )}

          {/* POPOVER PANEL */}
          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-14 right-0 w-80 sm:w-96 bg-neutral-900/90 backdrop-blur-2xl border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-right"
              >
                <NotificationCenter
                  onClose={() => setIsNotifOpen(false)}
                  isSubscribed={isSubscribed}
                  onSubscribe={handleSubscribe}
                  onUnsubscribe={handleUnsubscribe}
                  notifications={notifications}
                  onDeleteNotification={handleDeleteNotification} // NEW: Passing handler down
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AUTH BLOCK */}
        <Show when="signed-in">
          <div className="relative shrink-0 flex items-center justify-center h-12 w-12 rounded-full border border-neutral-800/80 bg-neutral-900/60 backdrop-blur-xl shadow-lg">
            <div className={cn("rounded-full p-0.5 flex items-center justify-center", currentPlan.ring)}>
              <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "h-8 w-8" } }} />
            </div>
            <div className={cn("absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[10px] shadow-md border border-neutral-900 z-10", currentPlan.badgeBg)}>
              {userPlan === "premium" ? <span className="text-[9px] tracking-tighter">P♦</span> : currentPlan.badgeText}
            </div>
          </div>
        </Show>

        <Show when="signed-out">
          <div className="shrink-0 flex items-center rounded-full border border-neutral-800/80 bg-neutral-900/60 p-1 sm:p-1.5 backdrop-blur-xl shadow-lg">
            <SignUpButton mode="modal">
              <button className="px-4 py-1.5 sm:px-6 sm:py-2 rounded-full font-medium text-xs sm:text-sm bg-white text-black hover:bg-blue-500 hover:text-white transition-colors duration-300 whitespace-nowrap">
                Register
              </button>
            </SignUpButton>
          </div>
        </Show>

      </div>
    </div>
  );
}