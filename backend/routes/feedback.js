import { Router } from "express";
import Mailjet from "node-mailjet";

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

const router = Router();

router.post("/send-feedback", async (req,res)=>{
    const { name, email, message } = req.body;

    if(!name || !email || !message){
        console.log("Some fields are empty")
        res.status(401).json({ success: false, error: "Fields are required" });
    }

  const verifiedSenderEmail = "subhamdasexampurpose@gmail.com"; 
  const yourPersonalEmail = "2024csb023.subham@students.iiests.ac.in"; 

  try {
    const request = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        // 1. Email to YOU (Notification)
        {
          From: { Email: verifiedSenderEmail, Name: "Snap-Shortener" },
          To: [{ Email: yourPersonalEmail, Name: "Subham" }],
          Subject: `New Message from ${name}`,
          TextPart: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
          HTMLPart: `<h3>New message from ${name} (${email})</h3><p>${message}</p>`,
        },
        // 2. Email to the USER (Auto-reply)
        {
          From: { Email: verifiedSenderEmail, Name: "Subham Das" },
          To: [{ Email: email, Name: name }],
          Subject: "Thanks for reaching out!",
          HTMLPart: `<h3>Hi ${name},</h3><p>Thank you for getting in touch! I've received your message and will get back to you as soon as possible.</p><br/><p>Best,<br/>Subham</p>`,
        },
      ],
    });

    res.status(200).json({ success: true, message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Mailjet Error:", error.statusCode, error.message);
    res.status(500).json({ success: false, error: "Failed to send emails." });
  }
})

export default router;