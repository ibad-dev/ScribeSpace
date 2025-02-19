import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Post from '../models/posts.model.js';
import User from '../models/user.model.js';
import Like from '../models/likes.model.js';

const toggleLike = asyncHandler(async (req, res) => {
  const { postId } = req.body;
  const userid = req.user._id;
  const user = await User.findById(userid);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const existingLike = await Like.findOne({ likedBy: userid, post: postId });
  let like = null;
  let message = '';

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
    message = 'Post unliked successfully';
  } else {
    like = await Like.create({ likedBy: userid, post: postId });
    await Post.findByIdAndUpdate(
      postId,
      { $inc: { likesCount: 1 } },
      { new: true }
    );
    message = 'Post liked successfully';
  }

  return res.status(200).json(new ApiResponse(200, like || null, message));
});

//method to get all likeed posts by user:
const getLikedPosts = asyncHandler(async (req, res) => {
  const userid = req.user._id;
  const user = await User.findById(userid);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  const likes = await Like.find({ likedBy: userid }).populate('post');
  const totalLikedPosts = await Like.countDocuments({ likedBy: userid });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likes, totalLikedPosts },
        'Likes fetched successfully'
      )
    );
});

export { toggleLike, getLikedPosts };
