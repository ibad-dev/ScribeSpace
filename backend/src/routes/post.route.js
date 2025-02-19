import { Router } from 'express';
import {
  createPost,
  updatePost,
  deletePost,
  getPublishedPostsByUser,
} from '../controllers/post.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.post('/create-post', verifyJWT, upload.single('image'), createPost);
router.patch('/update-post/:id', verifyJWT, upload.single('image'), updatePost);
router.delete('/delete-post/:id', verifyJWT, deletePost);
router.get('/published-posts', verifyJWT, getPublishedPostsByUser);
export default router;
