import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import Newsletter from '../models/newsletter.model.js';
import { NEWSLETTER_SUBSCRIPTION_TEMPLATE } from '../config/emailTemplate.js';
import { transporter } from '../config/nodemailer.js';
const newsLetterSub = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log('================', email);
  if (!email || email === '') {
    throw new ApiError(400, 'Email is required');
  }
  const existedUser = await Newsletter.findOne({ email });
  
  if (existedUser) {
    return res
      .status(200)
      .json(new ApiResponse(200,existedUser, 'User already Subscribed'));
  } 
  if(!existedUser || existedUser===null) {
    try {
      const newsletter = await Newsletter.create({ email });
      const mailOptions = {
        from: `"ScribeSpace" <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: 'New Letter Subscription',
        html: NEWSLETTER_SUBSCRIPTION_TEMPLATE,
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

      return res.status(200).json(new ApiResponse(200,newsletter, 'User Subscribed'));
    } catch (error) {
      console.log(error);
      throw new ApiError(404, 'Error to Subscribe');
    }
  }
});
export { newsLetterSub };
