import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import Post from '../models/posts.model.js';
import User from '../models/user.model.js';
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from '../utils/cloudinary.js';

const createPostAndDraft = asyncHandler(async (req, res) => {
  const { title, content, categories } = req.body;
  const userid = req.user._id;
  const user = await User.findById(userid);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const localImagePath = req.file?.path;
  let imageUrl = null;

  if (localImagePath) {
    const uploadedImage = await uploadOnCloudinary(localImagePath);
    if (!uploadedImage) {
      throw new ApiError(400, 'Failed to upload image');
    }
    imageUrl = uploadedImage.url;
  }

  try {
    const post = await Post.create({
      title,
      content,
      author: user,
      categories,
      image: imageUrl,
      published: false, // All posts start as drafts
    });

    return res
      .status(201)
      .json(new ApiResponse(201, post, 'Post saved as draft successfully'));
  } catch (error) {
    console.log(error);
    throw new ApiError(400, 'Error to create & save post as draft');
  }
});
const createPostAndPublish = asyncHandler(async (req, res) => {
  const { title, content, categories } = req.body;
  const userid = req.user._id;
  const user = await User.findById(userid);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const localImagePath = req.file?.path;
  let imageUrl = null;

  if (localImagePath) {
    const uploadedImage = await uploadOnCloudinary(localImagePath);
    if (!uploadedImage) {
      throw new ApiError(400, 'Failed to upload image');
    }
    imageUrl = uploadedImage.url;
  }

  try {
    const post = await Post.create({
      title,
      content,
      author: user,
      categories,
      image: imageUrl,
      published: true, // All posts start as drafts
    });

    return res
      .status(201)
      .json(new ApiResponse(201, post, 'Post Published successfully'));
  } catch (error) {
    console.log(error);
    throw new ApiError(400, 'Error to create & Piblish post ');
  }
});

const updatePost = asyncHandler(async (req, res) => {
  const { title, content, categories } = req.body;
  const userid = req.user._id;
  const user = await User.findById(userid);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  if (user.isAccountVerified === false) {
    throw new ApiError(400, 'Please verify your email to update a post');
  }
  const post = await Post.findById(req.params.id);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }
  if (post.author.toString() !== user._id.toString()) {
    throw new ApiError(403, 'You are not authorized to update this post');
  }

  // Only process image if a new one is uploaded
  if (req.file) {
    const localImagePath = req.file.path;
    const uploadedImage = await uploadOnCloudinary(localImagePath);
    if (!uploadedImage) {
      throw new ApiError(400, 'Failed to upload image');
    }

    // Extract public_id from old image URL and delete it
    const oldImageUrl = post.image;
    if (oldImageUrl) {
      const publicId = oldImageUrl.split('/').pop().split('.')[0];
      await deleteFromCloudinary(publicId);
    }

    // Update post with new image URL
    post.image = uploadedImage.url;
  }

  try {
    post.title = title;
    post.content = content;
    post.categories = categories;
    await post.save();
    return res
      .status(200)
      .json(new ApiResponse(200, post, 'Post updated successfully'));
  } catch (error) {
    throw new ApiError(400, 'Error updating post');
  }
});

const deletePost = asyncHandler(async (req, res) => {
  const userid = req.user._id;
  const user = await User.findById(userid);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }
  if (post.author.toString() !== user._id.toString()) {
    throw new ApiError(403, 'You are not authorized to delete this post');
  }

  // Delete image from Cloudinary if it exists
  if (post.image) {
    const publicId = post.image.split('/').pop().split('.')[0];
    await deleteFromCloudinary(publicId);
  }

  await post.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, post, 'Post deleted successfully'));
});

//method to get all published posts by a cetain user
const getPublishedPostsByUser = asyncHandler(async (req, res) => {
  const userid = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  const posts = await Post.find({
    published: true,
    author: userid,
  })
    .select('title content categories image author')
    .populate('author', 'username profileImage')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const postCount = await Post.countDocuments({
    published: true,
    author: userid,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        postCount,
        posts,
      },
      'Published posts fetched successfully'
    )
  );
});
const getSavedPostsByUser = asyncHandler(async (req, res) => {
  const userid = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  const posts = await Post.find({
    published: false,
    author: userid,
  })
    .select('title content categories image author')
    .populate('author', 'username profileImage')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const postCount = await Post.countDocuments({
    published: false,
    author: userid,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        postCount,
        posts,
      },
      'Saved posts fetched successfully'
    )
  );
});

const publishPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userid = req.user._id;

  const user = await User.findById(userid);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.isAccountVerified === false) {
    throw new ApiError(400, 'Please verify your email to publish a post');
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  if (post.author.toString() !== userid.toString()) {
    throw new ApiError(403, 'You are not authorized to publish this post');
  }

  if (!post.title || !post.content || !post.categories) {
    throw new ApiError(
      400,
      'Post must have title, content and categories to be published'
    );
  }

  post.published = true;
  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, post, 'Post published successfully'));
});
const getPostDetailById = asyncHandler(async (req,res)=>{
  const {postId} =req.params
  const details = await Post.findById(postId)
  if(!details){
    throw new ApiError(404,"post details not found")
  }
  return res.status(200).json(new ApiResponse(200,{details}, "Post details fetched successfully"))
})
export {
  getPostDetailById,
  updatePost,
  deletePost,
  createPostAndDraft,
  createPostAndPublish,
  getPublishedPostsByUser,
  publishPost,
  getSavedPostsByUser
};
