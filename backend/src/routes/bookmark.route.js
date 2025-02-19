import { Router } from 'express';
import { toggleBookmark, getBookmarks } from '../controllers/bookmark.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/toggle', verifyJWT, toggleBookmark);
router.get('/', verifyJWT, getBookmarks);

export default router;
