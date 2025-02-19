import Bookmark from '../models/bookmark.model.js';
import Post from '../models/posts.model.js';
import User from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const toggleBookmark = asyncHandler(async (req, res) => {
    const { postId } = req.body;
    const userid = req.user._id;
  
    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }
  
    // Check if the post is already bookmarked
    const existingBookmark = await Bookmark.findOne({ bookmarkedBy: userid, post: postId });
  
    let bookmark = null;
    let message = '';
  
    if (existingBookmark) {
      // If already bookmarked, remove it
      await Bookmark.findByIdAndDelete(existingBookmark._id);
      message = 'Bookmark removed successfully';
    } else {
      // Otherwise, create a new bookmark
      bookmark = await Bookmark.create({ bookmarkedBy: userid, post: postId });
  
      // Populate only essential post details for the response
      await bookmark.populate('post', 'title categories image author');
      message = 'Post bookmarked successfully';
    }
  
    return res.status(200).json(new ApiResponse(200, bookmark, message));
  });
  
const getBookmarks = asyncHandler(async (req, res) => {
  const userid = req.user._id;
  const user = await User.findById(userid);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  const bookmarks = await Bookmark.find({ bookmarkedBy: userid }).populate('post');
  return res
    .status(200)
    .json(new ApiResponse(200, bookmarks, 'Bookmarks fetched successfully'));
});

export { toggleBookmark, getBookmarks };
