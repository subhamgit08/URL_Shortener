import { Router } from 'express';
import { getUserPlan } from '../controllers/userControllers.js';
const router = Router();

router.get('/getPlan', getUserPlan);

export default router;
