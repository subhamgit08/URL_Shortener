// import dotenv from "dotenv";
// dotenv.config();

// import { Worker } from "bullmq";
// import Mailjet from "node-mailjet";
// import redisClient from "../config/redis.js"; // Your existing redis client
// import { backgroundQueue } from "./queue.js";

// // 1. Initialize Mailjet (from your environment variables)
// const mailjet = Mailjet.apiConnect(
//   process.env.MAILJET_API_KEY,
//   process.env.MAILJET_SECRET_KEY
// );

// // 3. Define the Worker (The '1' means process exactly one job at a time)
// backgroundQueue.process(1, async (job) => {
//   const { taskType, payload } = job.data;

//   // --- HANDLE FEEDBACK EMAILS ---
//   if (taskType === "SEND_FEEDBACK_EMAIL") {
//     const { name, email, message } = payload;
//     const verifiedSenderEmail = "subhamdasexampurpose@gmail.com"; 
//     const yourPersonalEmail = "2024csb023.subham@students.iiests.ac.in"; 

//     console.log(`[Queue] Sending feedback emails for: ${email}`);

//     await mailjet.post("send", { version: "v3.1" }).request({
//       Messages: [
//         {
//           From: { Email: verifiedSenderEmail, Name: "Snap-Shortener" },
//           To: [{ Email: yourPersonalEmail, Name: "Subham" }],
//           Subject: `New Message from ${name}`,
//           TextPart: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
//           HTMLPart: `<h3>New message from ${name} (${email})</h3><p>${message}</p>`,
//         },
//         {
//           From: { Email: verifiedSenderEmail, Name: "Subham Das" },
//           To: [{ Email: email, Name: name }],
//           Subject: "Thanks for reaching out!",
//           HTMLPart: `<h3>Hi ${name},</h3><p>Thank you for getting in touch! I've received your message and will get back to you as soon as possible.</p><br/><p>Best,<br/>Subham</p>`,
//         },
//       ],
//     });
//   }

//   // --- HANDLE ADMIN NOTIFICATIONS ---
//   if (taskType === "PUBLISH_ADMIN_NOTIFICATION") {
//     const { message } = payload;

//     console.log(`[Queue] Publishing notification: ${message}`);
//     await redisClient.publish("admin_notifications", message);
//   }
// });

import dotenv from "dotenv";
dotenv.config();

import Mailjet from "node-mailjet";
import redisClient from "../config/redis.js";
import { Worker } from "bullmq";
import { connection } from "./queue.js";

// Initialize Mailjet
const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

// Create BullMQ Worker
const worker = new Worker(
  "background-tasks",

  async (job) => {
    const { taskType, payload } = job.data;

    console.log(
      `[Worker] Processing job ${job.id}: ${taskType}`
    );

    // --------------------------------
    // SEND FEEDBACK EMAIL
    // --------------------------------

    if (taskType === "SEND_FEEDBACK_EMAIL") {
      const { name, email, message } = payload;

      const verifiedSenderEmail =
        "subhamdasexampurpose@gmail.com";

      const yourPersonalEmail =
        "2024csb023.subham@students.iiests.ac.in";

      console.log(
        `[Queue] Sending feedback emails for: ${email}`
      );

      await mailjet
        .post("send", { version: "v3.1" })
        .request({
          Messages: [
            {
              From: {
                Email: verifiedSenderEmail,
                Name: "Snap-Shortener",
              },

              To: [
                {
                  Email: yourPersonalEmail,
                  Name: "Subham",
                },
              ],

              Subject: `New Message from ${name}`,

              TextPart:
                `Name: ${name}\n` +
                `Email: ${email}\n` +
                `Message: ${message}`,

              HTMLPart:
                `<h3>New message from ${name} (${email})</h3>` +
                `<p>${message}</p>`,
            },

            {
              From: {
                Email: verifiedSenderEmail,
                Name: "Subham Das",
              },

              To: [
                {
                  Email: email,
                  Name: name,
                },
              ],

              Subject: "Thanks for reaching out!",

              HTMLPart:
                `<h3>Hi ${name},</h3>` +
                `<p>` +
                `Thank you for getting in touch! ` +
                `I've received your message and will get back to you as soon as possible.` +
                `</p>` +
                `<br/>` +
                `<p>Best,<br/>Subham</p>`,
            },
          ],
        });

      console.log(
        `[Queue] Feedback email sent successfully`
      );

      return;
    }

    // --------------------------------
    // ADMIN NOTIFICATION
    // --------------------------------

    if (taskType === "PUBLISH_ADMIN_NOTIFICATION") {
      const { message } = payload;

      console.log(
        `[Queue] Publishing notification: ${message}`
      );

      await redisClient.publish(
        "admin_notifications",
        message
      );

      console.log(
        `[Queue] Admin notification published`
      );

      return;
    }

    console.warn(
      `[Worker] Unknown task type: ${taskType}`
    );
  },

  {
    connection,
    concurrency: 1,
  }
);

// --------------------------------
// WORKER EVENTS
// --------------------------------

worker.on("ready", () => {
  console.log(
    "✅ Background worker connected to Redis"
  );
});

worker.on("completed", (job) => {
  console.log(
    `✅ Job ${job.id} completed successfully`
  );
});

worker.on("failed", (job, err) => {
  console.error(
    `❌ Job ${job?.id} failed:`,
    err
  );
});

worker.on("error", (err) => {
  console.error(
    "❌ BullMQ Worker error:",
    err
  );
});

console.log(
  "🚀 Background worker started..."
);