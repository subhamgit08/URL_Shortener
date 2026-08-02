import { Router } from 'express';
import { make_urls, redirectURL } from '../controllers/urlControllers.js';
const router = Router();

// In-memory mock database for testing purposes
const mockDatabase = {
  "google": "https://google.com",
  "github": "https://github.com",
  "6aB9x": "https://example.com"
};

router.post('/make-url',make_urls);

router.get('/:shortCode', redirectURL);


router.get('/debug/all', (req, res) => {
  res.json({
    message: "Current mock mappings available for testing",
    data: mockDatabase
  });
});

export default router;
