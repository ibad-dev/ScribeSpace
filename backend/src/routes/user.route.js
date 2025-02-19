import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
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
  deleteProfilePicture,
  updateAccountDetails,
  updateProfilePicture,
  addBio,
  toggleFollow,
  getFollowers,
  getFollowing,
  isAuthenticated,
} from '../controllers/user.controller.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', verifyJWT, logoutUser);
router.post('/refresh-token', refreshAccessToken);
router.post('/change-password', verifyJWT, changeCurrentPassword);
router.patch('/update-account-details', verifyJWT, updateAccountDetails);
router.post(
  '/set-profile-pic',
  verifyJWT,
  upload.single('profileImage'),
  setProfilePicture
);
router.post('/verify-otp', verifyJWT, verifyOtp);
router.post('/verify-email', verifyJWT, verifyEmail);
router.post('/send-reset-otp', sendResetOtp);
router.post('/reset-password', resetPassword);
router.delete('/delete-profile-pic', verifyJWT, deleteProfilePicture);
router.post(
  '/update-profile-pic',
  verifyJWT,
  upload.single('profileImage'),
  updateProfilePicture
);
router.post('/add-bio', verifyJWT, addBio);
router.post('/toggle-follow/:userId', verifyJWT, toggleFollow);
router.get('/followers/:userId',  getFollowers);
router.get('/following/:userId', getFollowing);
router.get('/isAuthenticated', verifyJWT, isAuthenticated);
export default router;
