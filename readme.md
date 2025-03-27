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
git clone https://github.com/ibad-dev/scribespace.git
cd scribespace
```

2️⃣ **Install Dependencies**  
**Backend**
```bash
cd backend
npm install
```

**Frontend**
```bash
cd frontend
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
cd backend
npm start
```

**Start Frontend**
```bash
cd frontend
npm start
```


## 📖 Usage
- Sign up or log in to your account
- Create, edit, or delete your blog posts
- Browse blogs by different categories
- Follow authors, like posts, and leave comments
```

