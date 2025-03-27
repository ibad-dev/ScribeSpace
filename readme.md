# ScribeSpace

📝 **Project Description**  
ScribeSpace is a full-stack blogging platform that enables users to create, update, and delete blog posts, explore various blog categories, and engage with content by following authors, liking, and commenting on posts. Built with a modern tech stack, ScribeSpace ensures a seamless and engaging user experience for both readers and writers.

## 🚀 Features
- **User Authentication** – Secure login/signup with JWT-based authentication
- **Blog Management** – Users can create, update, and delete their blog posts
- **Category-Based Browsing** – Explore blogs based on different categories
- **Social Features** – Follow authors, like posts, and leave comments
- **Responsive UI** – A clean and responsive interface with Tailwind CSS
- **Real-time Updates** – Stay up to date with live changes using Redux for state management

## 🏗️ Tech Stack
| Technology       | Description                          |
|------------------|--------------------------------------|
| Frontend         | React.js with Redux for state management |
| Backend          | Node.js and Express.js               |
| Database         | MongoDB (NoSQL database)             |
| Authentication   | JWT (JSON Web Token)                 |
| Styling          | Tailwind CSS                         |

## 📌 Installation
To set up ScribeSpace locally, follow these steps:

1️⃣ **Clone the Repository**
```bash
git clone https://github.com/your-username/scribespace.git
cd scribespace
```

2️⃣ **Install Dependencies**  
**Backend**
```bash
cd server
npm install
```

**Frontend**
```bash
cd client
npm install
```

3️⃣ **Set Up Environment Variables**  
Create a `.env` file in the root of the server directory and add:
```plaintext
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4️⃣ **Run the Application**  
**Start Backend**
```bash
cd server
npm start
```

**Start Frontend**
```bash
cd client
npm start
```

The app will be available at `http://localhost:3000`.

## 📖 Usage
- Sign up or log in to your account
- Create, edit, or delete your blog posts
- Browse blogs by different categories
- Follow authors, like posts, and leave comments
```

Note: Make sure to:
1. Replace `your-username` in the clone URL with your actual GitHub username
2. Add proper MongoDB connection string in the `.env` file
3. Set a secure JWT secret key
4. Update the URLs/ports if you're using different configurations
