import { Router } from 'express';
import { make_urls, redirectURL } from '../controllers/urlControllers.js';
const router = Router();

router.post('/make-url',make_urls);

router.get('/:shortCode', redirectURL);

export default router;
