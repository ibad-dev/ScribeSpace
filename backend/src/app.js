import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.CORS_ORIGIN.split(',');
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error('Not allowed by CORS')); // Block the request
      }
    },
    credentials: true,
  })
);
//common middlewares
app.use(express.json({ limit: '15kb' }));
app.use(express.urlencoded({ extended: true, limit: '15kb' }));
app.use(express.static('public'));
app.use(cookieParser());

//import routes
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';
import bookmarkRouter from './routes/bookmark.route.js';
import likeRouter from './routes/likes.route.js';
import viewRouter from './routes/views.route.js';
import NewsLetterRouter from './routes/newsLetter.route.js';
import commentRouter from './routes/comment.route.js';
import contactRoute from './routes/contact.route.js';
//api routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/bookmarks', bookmarkRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/views', viewRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/sub', NewsLetterRouter);
app.use('/api/v1/contact', contactRoute);

export { app };
