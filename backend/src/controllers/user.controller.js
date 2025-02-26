import User from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from '../config/emailTemplate.js';
import { transporter } from '../config/nodemailer.js';
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from '../utils/cloudinary.js';

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError('404', 'User Not Found ');
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log('ERROR WHILE GENERATING ACCESS TOKEN', error);
    throw new ApiError(
      500,
      'Something went wrong while generating access and refresh tokens'
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, username, fullName } = req.body;

  if (
    [email, password, username, fullName].some((field) => field?.trim() === '')
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, 'User with username and email already exists');
  }

  try {
    const user = await User.create({
      email,
      password,
      fullName,
      username,
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const createdUser = await User.findById(user._id).select(
      '-password -refreshToken'
    );
    if (!createdUser) {
      throw new ApiError(500, 'Something went wrong while registering a user');
    }

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    };

    return res
      .status(201)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json(new ApiResponse(200, createdUser, 'User registered Successfully'));
  } catch (error) {
    console.log('User Creation Failed', error);

    throw new ApiError(500, 'Something went wrong while registering a user');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  //  get data from body
  const { email, password } = req.body;
  // console.log(req.body);

  // validation
  if (!email && !password) {
    throw new ApiError(409, 'Email and Password is required');
  }
  const user = await User.findOne({ email });
  console.log(user.email);
  if (!user) {
    throw new ApiError(404, "'User not found !!");
  }
  //vaildate password:
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(402, 'Invalid Password');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );
  if (!loggedInUser) {
    throw new ApiError(401, 'No logggedin user found');
  }
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { loggedInUser, accessToken },
        'User loggedin successfully'
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'User LoggedOut Successfully '));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(402, 'Refresh token is required');
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, 'Invalid refresh token');
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(402, 'Invalid refresh token');
    }
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          'Access token refreshed  successfully'
        )
      );
  } catch (error) {
    console.log('Error while refreshing access token', error);
    throw new ApiError(500, 'Error to refresh access token');
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) {
    throw new ApiError(401, 'old password is incorrect');
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, 'Password changed succeessfully'));
});

const setProfilePicture = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const localImagePath = req.file?.path;
  const uploadedImage = await uploadOnCloudinary(localImagePath);
  if (!uploadedImage) {
    throw new ApiError(400, 'Failed to upload image');
  }
  user.profileImage = uploadedImage.url;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Profile picture set successfully'));
});

const verifyOtp = asyncHandler(async (req, res) => {
  const userid = req.user._id;
  if (!userid) {
    throw new ApiError(400, 'User ID is required');
  }

  const user = await User.findById(userid).select(
    '-password -refreshToken -resetOtp -resetOtpExpiredAt -createdAt -updatedAt -__v'
  );
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  if (user.isAccountVerified) {
    return res
      .status(200)
      .json(new ApiResponse(200, user, 'User already verified'));
  }
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.verifyOtp = otp;
  user.verifyOtpExpiredAt = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const mailOptions = {
    from: `"ScribeSpace <${process.env.SENDER_EMAIL}>`,
    to: user.email,
    subject: 'Verify your email',
    html: EMAIL_VERIFY_TEMPLATE.replace('{{otp}}', otp).replace(
      '{{email}}',
      user.email
    ),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('Detailed email error:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      stack: error.stack,
    });
    throw new ApiError(400, `Error sending email: ${error.message}`);
  }
  return res
    .status(200)

    .json(new ApiResponse(200, user, 'OTP sent to email'));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const userid = req.user?._id;
  console.log('USERID:=======>>>>>>>>', userid);
  const { otp } = req.body;
  console.log('OTP:=======>>>>>>>>', otp);
  if (otp === '') {
    throw new ApiError(400, 'OTP is required');
  }
  const user = await User.findById(userid).select(
    '-password -refreshToken -resetOtp -resetOtpExpiredAt -createdAt -updatedAt -__v'
  );
  console.log('USER:=======>>>>>>>>', user);
  if (user === null) {
    throw new ApiError(404, 'User not found');
  }
  if (user.isAccountVerified) {
    return res
      .status(200)
      .json(new ApiResponse(200, user, 'User already verified'));
  } else {
    if (user.verifyOtp !== otp) {
      throw new ApiError(400, 'Invalid OTP');
    }
    if (user.verifyOtpExpiredAt < Date.now()) {
      throw new ApiError(400, 'OTP expired');
    }
    user.isAccountVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpiredAt = undefined;
    try {
      await user.save({ validateBeforeSave: false });
      return res
        .status(200)
        .json(new ApiResponse(200, user, 'Email verified successfully'));
    } catch (error) {
      throw new ApiError(400, 'Error verifying email');
    }
  }
});

const sendResetOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  // console.log(email);
  if (!email) {
    throw new ApiError(400, 'email is required');
  }
  const user = await User.findOne({ email }).select(
    '-password -refreshToken -verifyOtp -verifyOtpExpiredAt -createdAt -updatedAt -__v'
  );
  // console.log(user);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.resetOtp = otp;
  user.resetOtpExpiredAt = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });
  const mailOptions = {
    from: `ScribeSpace <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: 'Reset your password',
    html: PASSWORD_RESET_TEMPLATE.replace('{{otp}}', otp).replace(
      '{{email}}',
      user.email
    ),
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    console.log('Message ID:', info.messageId);
    return res
      .status(200)
      .json(new ApiResponse(200, user, 'OTP sent to email'));
  } catch (error) {
    console.error('Detailed email error:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      stack: error.stack,
    });
    throw new ApiError(400, `Error sending email: ${error.message}`);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { otp, newPassword, email } = req.body;
  if (!email || !otp || !newPassword) {
    throw new ApiError(400, 'All fields are required');
  }
  const user = await User.findOne({ email }).select(
    '-password -refreshToken -verifyOtp -verifyOtpExpiredAt -createdAt -updatedAt -__v'
  );
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.resetOtp !== otp) {
    throw new ApiError(400, 'Invalid OTP');
  }
  if (user.resetOtpExpiredAt < Date.now()) {
    throw new ApiError(400, 'OTP expired');
  }
  try {
    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiredAt = undefined;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, user, 'Password reset successfully'));
  } catch (error) {
    throw new ApiError(400, 'Error resetting password');
  }
});

const isAuthenticated = asyncHandler(async (req, res) => {
  //function to check is user authenticated:

  const user = await User.findById(req.user._id).select(
    '-password -refreshToken -verifyOtp -verifyOtpExpiredAt -createdAt -updatedAt -__v'
  );

  //get cookie
  const token = req.cookies?.accessToken;

  // If no user is found, throw an error
  if (!user) {
    return res.status(401).json({
      authenticated: false, // Not authenticated
      message: 'User not found',
    });
  }

  // If the user is found, return authenticated = true
  return res.status(200).json({
    authenticated: true, // User is authenticated
    user: user,
    token: token,
  });
});
const updateProfilePicture = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (req.file) {
    const localImagePath = req.file?.path;
    const uploadedImage = await uploadOnCloudinary(localImagePath);
    if (!uploadedImage) {
      throw new ApiError(400, 'Failed to upload image');
    }
    const oldImage = user.profileImage;
    if (oldImage) {
      const publicId = oldImage.split('/').pop().split('.')[0];
      await deleteFromCloudinary(publicId);
    }
    user.profileImage = uploadedImage.url;
  }

  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Profile picture updated successfully'));
});

const deleteProfilePicture = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.profileImage) {
    // Extract public ID from Cloudinary URL
    // URL format: https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/public-id.jpg
    const urlParts = user.profileImage.split('/');
    const publicId = urlParts[urlParts.length - 1].split('.')[0];

    try {
      await deleteFromCloudinary(publicId);
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw new ApiError(500, 'Failed to delete image from cloud storage');
    }
  }

  user.profileImage = undefined;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Profile picture deleted successfully'));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { username, fullName, bio } = req.body;
  const userid = req.user._id;
  const user = await User.findById(userid);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userid,
      {
        $set: {
          username: username || user.username,
          fullName: fullName || user.fullName,
          bio: bio || user.bio,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedUser,
          'Account details updated successfully'
        )
      );
  } catch (error) {
    throw new ApiError(400, 'Error updating account details');
  }
});

const addBio = asyncHandler(async (req, res) => {
  const { bio } = req.body;
  if (bio === '' || !bio) {
    throw new ApiError(400, 'Bio is Required');
  }
  const userid = req.user._id;
  const user = await User.findById(userid);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  user.bio = bio;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Bio added successfully'));
});
//method to toggle follow user:
const toggleFollow = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const currentUser = req.user;

  if (userId === currentUser._id.toString()) {
    throw new ApiError(400, "You cannot follow yourself");
  }

  const userToFollow = await User.findById(userId);
  if (!userToFollow) {
    throw new ApiError(404, "User to follow not found");
  }

  let message = "Followed successfully";

  if (userToFollow.followers.includes(currentUser._id)) {
    // Unfollow
    userToFollow.followers = userToFollow.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToFollow._id.toString()
    );
    message = "Unfollowed successfully"; // Update message
  } else {
    // Follow
    userToFollow.followers.push(currentUser._id);
    currentUser.following.push(userToFollow._id);
  }

  await userToFollow.save({ validateBeforeSave: false });
  await currentUser.save({ validateBeforeSave: false });

  const followersCount = userToFollow.followers.length;
  const followingCount = currentUser.following.length;

  return res.status(200).json(
    new ApiResponse(
      200,
      { followersCount, followingCount },
      message // Dynamically return Follow/Unfollow message
    )
  );
});

//method to get followers of a user :
const getFollowers = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).select(
    'followers profileImage username'
  );
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  const followersCount = user.followers.length;
  const followers = await User.find({ _id: { $in: user.followers } }).select(
    '-password -refreshToken -verifyOtp -verifyOtpExpiredAt -createdAt -updatedAt -__v'
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { followersCount, followers },
        'Followers fetched successfully'
      )
    );
});

//method to get following of a user :
const getFollowing = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).select(
    'following profileImage username'
  );
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  const followingCount = user.following.length;
  const following = await User.find({ _id: { $in: user.following } }).select(
    '-password -refreshToken -verifyOtp -verifyOtpExpiredAt -createdAt -updatedAt -__v'
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { followingCount, following },
        'Following fetched successfully'
      )
    );
});
const checkFollow = asyncHandler(async (req, res) => {});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  setProfilePicture,
  verifyOtp,
  verifyEmail,
  sendResetOtp,
  resetPassword,
  isAuthenticated,
  updateAccountDetails,
  updateProfilePicture,
  deleteProfilePicture,
  addBio,
  toggleFollow,
  getFollowers,
  getFollowing,
};
