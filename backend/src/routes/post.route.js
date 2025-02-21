import { Router } from 'express';
import {
  updatePost,
  deletePost,
  getPublishedPostsByUser,
  createPostAndDraft,
  createPostAndPublish,
  getSavedPostsByUser,
  publishPost,
} from '../controllers/post.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.post(
  '/create-post/save-as-draft',
  verifyJWT,
  upload.single('image'),
  createPostAndDraft
);
router.post(
  '/create-post/publish',
  verifyJWT,
  upload.single('image'),
  createPostAndPublish
);
router.patch('/update-post/:id', verifyJWT, upload.single('image'), updatePost);
router.delete('/delete-post/:id', verifyJWT, deletePost);
router.get('/published-posts', verifyJWT, getPublishedPostsByUser);
router.get('/saved-posts', verifyJWT, getSavedPostsByUser);
router.post("/publish/:postId",verifyJWT,publishPost)
export default router;
