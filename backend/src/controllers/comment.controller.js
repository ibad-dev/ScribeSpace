import { asyncHandler } from '../utils/asyncHandler.js';
import Comment from '../models/comments.model.js';
import Post from '../models/posts.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const addComment = asyncHandler(async (req, res) => {
  const { postId, content } = req.body;
  const userId = req.user._id;

  const comment = await Comment.create({
    content,
    author: userId,
    post: postId,
  });

  if (!comment) {
    throw new ApiError(400, 'Failed to add comment');
  }

  await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, 'Comment added successfully'));
});

const editComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  // Check if the user is the owner of the comment
  if (comment.author.toString() !== userId.toString()) {
    throw new ApiError(403, 'Unauthorized to edit this comment');
  }

  comment.content = content;
  const updatedComment = await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, 'Comment updated successfully'));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  if (comment.author.toString() !== userId.toString()) {
    throw new ApiError(403, 'Unauthorized to delete this comment');
  }

  await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });

  await comment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, 'Comment deleted successfully'));
});

const getCommentsByPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ post: postId }).populate(
    'author',
    '-password -refreshToken '
  );

  if (!comments) {
    throw new ApiError(404, 'No comments found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comments, 'Comments fetched successfully'));
});

export { addComment, editComment, deleteComment, getCommentsByPost };
