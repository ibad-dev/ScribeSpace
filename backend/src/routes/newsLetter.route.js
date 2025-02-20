import { Router } from 'express';

import { newsLetterSub } from '../controllers/newsLetter.controller.js';

const router = Router();

router.post('/', newsLetterSub);

export default router;
