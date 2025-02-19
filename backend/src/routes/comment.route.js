import { Router } from 'express';
import {
  addComment,
  editComment,
  deleteComment,
  getCommentsByPost,
} from '../controllers/comment.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', verifyJWT, addComment);
router.patch('/:commentId', verifyJWT, editComment);
router.delete('/:commentId', verifyJWT, deleteComment);
router.get('/:postId', getCommentsByPost);

export default router;
