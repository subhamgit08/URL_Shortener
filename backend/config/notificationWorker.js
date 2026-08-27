import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import Mailjet from "node-mailjet";
import { connection } from "./queue.js";


const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
);


const worker = new Worker(
    "notification-queue",
    async (job) => {
        console.log("Processing job:", job.name);

        const { taskType, payload } = job.data;

        if (taskType === "SUBSCRIPTION_CONFIRMATION") {

            const { email } = payload;

            console.log(
                `[Worker] Sending subscription email to ${email}`
            );

            const verifiedSenderEmail = "subhamdasexampurpose@gmail.com";

            await mailjet
                .post("send", { version: "v3.1" })
                .request({
                    Messages: [
                        {
                            From: {
                                Email: verifiedSenderEmail,
                                Name: "Snap-Shortener"
                            },

                            To: [
                                {
                                    Email: email
                                }
                            ],

                            Subject: "Notifications Enabled 🔔",

                            TextPart:
                                "You have successfully subscribed to Snap-Shortener notifications.",

                            HTMLPart: `
                                <h2>Notifications Enabled 🔔</h2>

                                <p>
                                    You have successfully subscribed
                                    to Snap-Shortener notifications.
                                </p>

                                <p>
                                    You will now receive important
                                    announcements and updates.
                                </p>
                            `
                        }
                    ]
                });

            console.log(
                `[Worker] Email sent to ${email}`
            );
        }
    },
    {
        connection,
        concurrency: 1
    }
);

worker.on("ready", () => {
    console.log("✅ Notification worker is ready");
});

worker.on("active", (job) => {
    console.log(`🔥 Job ${job.id} is active`);
});

worker.on("completed", (job) => {
    console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
    console.error(
        `❌ Job ${job?.id} failed:`,
        err
    );
});

worker.on("error", (err) => {
    console.error(
        "❌ Worker error:",
        err
    );
});

console.log("🚀 Notification worker started...");