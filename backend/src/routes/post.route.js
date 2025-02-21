import { Router } from 'express';
import {
  
  updatePost,
  deletePost,
  getPublishedPostsByUser,
  createPostAndDraft,
  createPostAndPublish,
} from '../controllers/post.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.post('/create-post/save-as-draft', verifyJWT, upload.single('image'), createPostAndDraft);
router.post('/create-post/publish', verifyJWT, upload.single('image'), createPostAndPublish);
router.patch('/update-post/:id', verifyJWT, upload.single('image'), updatePost);
router.delete('/delete-post/:id', verifyJWT, deletePost);
router.get('/published-posts', verifyJWT, getPublishedPostsByUser);
export default router;
