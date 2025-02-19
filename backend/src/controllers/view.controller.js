import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Post from '../models/posts.model.js';
import View from '../models/view.model.js';

const incrementPostView = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  // Don't count view if user is viewing their own post
  if (post.author.toString() === userId.toString()) {
    return res.status(200).json(new ApiResponse(200, post, 'Own post view'));
  }

  // Check for existing view in last 24 hours
  const existingView = await View.findOne({
    post: postId,
    viewedBy: userId,
    createdAt: {
      $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  });

  if (!existingView) {
    // Create new view record
    await View.create({
      post: postId,
      viewedBy: userId,
    });

    // Increment post view count
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { viewsCount: 1 } },
      { new: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedPost, 'View count updated successfully')
      );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, 'Post already viewed in last 24 hours'));
});

// Get view statistics for a post
const getPostViews = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const totalViews = await View.countDocuments({ post: postId });
  const uniqueViewers = await View.distinct('viewedBy', { post: postId });

  return res.status(200).json(  
    new ApiResponse(
      200,
      {
        totalViews,
        uniqueViewers: uniqueViewers.length,
        viewsCount: post.viewsCount,
      },
      'View statistics fetched successfully'
    )
  );
});

export { incrementPostView, getPostViews };
