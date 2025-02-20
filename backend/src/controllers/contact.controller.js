import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Contact from '../models/contact.model.js';

const contact = asyncHandler(async (req, res) => {
  const { email, name, message } = req.body;

  if ([name, message, email].some((i) => i === '')) {
    throw new ApiError(400, 'All fields are required');
  }
  const existedEmail = await Contact.findOne({ email });
  if (existedEmail) {
    return res.status(200).json(new ApiResponse(200, 'Email already used'));
  }
  if (!existedEmail) {
    const contact = await Contact.create({
      email,
      name,
      message,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, contact, 'Successfully contacted'));
  }
});

export { contact };
