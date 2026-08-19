import React, { useState } from "react";
import { useUser } from "@clerk/react";
import axios from "axios";

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_ENDPOINT || "http://localhost:3000";

  if (!isLoaded) return <div>Loading...</div>;

  // Check if the current logged-in user is the Admin
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdmin = userEmail === "projectmail524@gmail.com";

  if (!isAdmin) {
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        Access Denied. You are not an admin.
      </div>
    );
  }

  const handlePublish = async () => {
    if (!message) return;
    setStatus("Publishing...");
    
    try {
      await axios.post(`${backendUrl}/api/admin/publish`, {
        message,
        email: userEmail,
      });
      setMessage("");
      setStatus("Message published to all subscribers!");
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      setStatus("Failed to publish.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 p-8 bg-neutral-900 border border-neutral-800 rounded-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Admin Broadcast System</h2>
      
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message to send to all subscribers..."
        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-4 text-white mb-4 h-32"
      />
      
      <button
        onClick={handlePublish}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition"
      >
        Publish Message
      </button>

      {status && <p className="mt-4 text-green-400 text-center">{status}</p>}
    </div>
  );
}