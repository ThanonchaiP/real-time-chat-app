# 🚀 Real-time Chat Application

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/NestJS-11.0.1-e0234e?style=for-the-badge&logo=nestjs" alt="NestJS" />
  <img src="https://img.shields.io/badge/Socket.io-4.8.1-010101?style=for-the-badge&logo=socket.io" alt="Socket.io" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</div>

<div align="center">
  <h3>🌟 A modern, real-time chat application built with cutting-edge technologies</h3>
  <p>Experience seamless communication with beautiful UI, real-time messaging, and responsive design</p>
</div>

## ✨ Features

### 💬 **Real-time Communication**

- **Instant Messaging** - Send and receive messages in real-time
- **Typing Indicators** - See when others are typing
- **Online Status** - View who's currently online
- **Read Receipts** - Know when your messages have been read

<!-- ### 🎨 **Beautiful UI/UX**

- **Responsive Design** - Works seamlessly on mobile and desktop
- **Dark/Light Theme** - Toggle between themes
- **Smooth Animations** - Beautiful transitions and micro-interactions
- **Modern Interface** - Clean, intuitive design

### 🔧 **Advanced Features**

- **User Authentication** - Secure login and registration
- **File Attachments** - Share images and files
- **Message History** - Infinite scroll with message pagination
- **Room Management** - Create and manage chat rooms
- **User Profiles** - Customizable avatars and profiles -->

## 🛠️ Tech Stack

### **Frontend**

```typescript
// Modern React with Next.js
Next.js 15.3.3 + React 19 + TypeScript
TailwindCSS 4 + Radix UI Components
React Query + Zustand State Management
Socket.io Client + Day.js
```

### **Backend**

```typescript
// Scalable NestJS API
NestJS 11 + TypeScript
MongoDB + Mongoose ODM
Socket.io + JWT Authentication
AWS S3 + File Upload
```

## 🚀 Quick Start

### Prerequisites

```bash
# Required versions
Node.js >= 18.0.0
npm >= 8.0.0
MongoDB >= 5.0.0
```

### 🔧 Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/real-time-chat-app.git
cd real-time-chat-app
```

2. **Install dependencies**

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. **Environment Setup**

```bash
# Client (.env.local)
cp client/.env.example client/.env.local

# Server (.env)
cp server/.env.example server/.env
```

4. **Configure Environment Variables**

**Client Environment:**

```bash
# client/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

**Server Environment:**

```bash
# server/.env
# Database
MONGODB_URI=mongodb://localhost:27017/chatapp

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=your-bucket-name
AWS_REGION=your-region

# App Config
PORT=3001
NODE_ENV=development
```

### 🏃‍♂️ Running the Application

**Development Mode:**

```bash
# Terminal 1 - Start the server
cd server
npm run start:dev

# Terminal 2 - Start the client
cd client
npm run dev
```

**Production Mode:**

```bash
# Build and start server
cd server
npm run build
npm run start:prod

# Build and start client
cd client
npm run build
npm start
```

### 🌐 Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **API Documentation:** http://localhost:3001/api

## 📱 Screenshots

<div align="center">
  <img src="./docs/screenshots/desktop-chat.png" alt="Desktop Chat View" width="45%" />
  <img src="./docs/screenshots/mobile-chat.png" alt="Mobile Chat View" width="25%" />
</div>

<div align="center">
  <img src="./docs/screenshots/user-list.png" alt="User List" width="30%" />
  <img src="./docs/screenshots/dark-theme.png" alt="Dark Theme" width="30%" />
  <img src="./docs/screenshots/typing-indicator.png" alt="Typing Indicator" width="30%" />
</div>

## 🏗️ Project Structure

```
real-time-chat-app/
├── 📁 client/                 # Next.js Frontend
│   ├── 📁 src/
│   │   ├── 📁 app/           # App Router Pages
│   │   ├── 📁 components/    # Reusable Components
│   │   ├── 📁 features/      # Feature-based Modules
│   │   ├── 📁 hooks/         # Custom React Hooks
│   │   ├── 📁 stores/        # Zustand Stores
│   │   └── 📁 types/         # TypeScript Types
│   ├── 📄 package.json
│   └── 📄 tailwind.config.js
├── 📁 server/                # NestJS Backend
│   ├── 📁 src/
│   │   ├── 📁 auth/          # Authentication Module
│   │   ├── 📁 chat/          # Chat Module
│   │   ├── 📁 users/         # Users Module
│   │   ├── 📁 upload/        # File Upload Module
│   │   └── 📁 common/        # Shared Utilities
│   └── 📄 package.json
└── 📄 README.md
```

## 🔗 API Endpoints

### Authentication

```http
POST /auth/register    # User Registration
POST /auth/login       # User Login
POST /auth/logout      # User Logout
GET  /auth/me          # Get Current User
```

### Chat

```http
GET    /chat/rooms         # Get User's Chat Rooms
POST   /chat/rooms         # Create New Room
GET    /chat/rooms/:id     # Get Room Details
GET    /chat/messages/:roomId  # Get Room Messages
POST   /chat/messages      # Send Message
```

### Users

```http
GET    /users              # Get All Users
GET    /users/online       # Get Online Users
PUT    /users/profile      # Update Profile
```

## 🎯 Key Features Implementation

### Real-time Communication

```typescript
// Socket.io integration with type safety
interface ServerToClientEvents {
  message: (data: MessageDto) => void;
  user_status_change: (data: UserStatusDto) => void;
  typing: (data: TypingDto) => void;
}

interface ClientToServerEvents {
  join_room: (roomId: string) => void;
  send_message: (data: SendMessageDto) => void;
  typing_start: (roomId: string) => void;
  typing_stop: (roomId: string) => void;
}
```

### State Management

```typescript
// Zustand store for chat state
interface ChatStore {
  socket: Socket | null;
  onlineUsers: User[];
  currentRoom: string | null;
  messages: Message[];
  setSocket: (socket: Socket) => void;
  addMessage: (message: Message) => void;
}
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Argon2 password encryption
- **CORS Protection** - Configured for secure cross-origin requests
- **Helmet.js** - Security headers and protection
- **Input Validation** - Class-validator for request validation
- **Rate Limiting** - Protection against spam and abuse

## 🎨 Design System

### Colors

```css
/* Primary Palette */
--primary-50: #eff6ff;
--primary-500: #3b82f6;
--primary-600: #2563eb;

/* Semantic Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #06b6d4;
```

### Typography

```css
/* Font Families */
--font-sans: "Inter", system-ui, sans-serif;
--font-mono: "JetBrains Mono", monospace;

/* Font Sizes */
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
```

## 🚀 Deployment

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Deployment

```bash
# Build applications
npm run build

# Deploy to your hosting platform
# Vercel (Frontend) + Railway/Heroku (Backend)
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Use conventional commit messages
- Update documentation when needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

<div align="center">
  <a href
