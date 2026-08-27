import { clerkClient, getAuth } from "@clerk/express";
import { notificationQueue } from "../config/queue.js";
import { getIO } from "../config/socket.js";

export const subscribeToNotifications = async (req, res) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const user = await clerkClient.users.getUser(userId);

        const email = user.primaryEmailAddress?.emailAddress;

        if (!email) {
            return res.status(400).json({
                message: "No email address found"
            });
        }

        // Add email job to BullMQ
        await notificationQueue.add("subscription-confirmation", {
            taskType: "SUBSCRIPTION_CONFIRMATION",
            payload: {
                userId,
                email
            }
        });

        const io = getIO();
        // Send an immediate in-app notification
        io.to(`user:${userId}`).emit(
            "new_admin_message",
            "You have successfully subscribed to notifications!"
        );

        res.json({
            success: true,
            message: "Subscription successful"
        });

    } catch (error) {
        console.error("Subscription error:", error);

        res.status(500).json({
            message: "Failed to subscribe"
        });
    }
};