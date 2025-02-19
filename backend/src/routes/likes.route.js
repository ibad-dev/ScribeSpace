import { Router } from 'express';
import { toggleLike, getLikedPosts } from '../controllers/like.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/toggle', verifyJWT, toggleLike);
router.get('/', verifyJWT, getLikedPosts);

export default router;
