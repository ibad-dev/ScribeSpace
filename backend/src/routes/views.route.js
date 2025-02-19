import { Router } from 'express';
import {
  incrementPostView,
  getPostViews,
} from '../controllers/view.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = Router();

router.use(verifyJWT);

router.post('/posts/:postId/view', incrementPostView);
router.get('/posts/:postId/views', getPostViews);

export default router;
