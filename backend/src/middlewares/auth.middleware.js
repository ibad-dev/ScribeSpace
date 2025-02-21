import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const verifyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');
  // console.log('TOKEN: ', token);
  if (!token || token === '' || token === null) {
    throw new ApiError(401, 'Token not found');
  }

  // Method 2: Manual cookie parsing from header
  // const cookieHeader = req.headers.cookie;
  // if (cookieHeader) {
  //   const tokenCookie = cookieHeader
  //     .split(';')
  //     .find((cookie) => cookie.trim().startsWith('accessToken='));
  //   if (tokenCookie) {
  //     const tokenValue = tokenCookie.split('=')[1];
  //     // Use this token if Method 1 didn't work
  //     if (!token) token = tokenValue;
  //   }
  // }

  try {
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodeToken?._id).select(
      '-password -refreshToken'
    );
    if (!user) {
      throw new ApiError(401, 'Unauthorized');
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid Access Token');
  }
});
