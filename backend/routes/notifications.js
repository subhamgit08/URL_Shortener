import { Router } from "express";
import { subscribeToNotifications } from "../controllers/notificationController.js";

const router = Router();

router.post("/subscribe",subscribeToNotifications)

export default router;