# Let Me Ask - AI-Powered Streaming Assistant

<div align="center">

![Let Me Ask Logo](https://img.shields.io/badge/Let%20Me%20Ask-AI%20Assistant-blue?style=for-the-badge&logo=google)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

</div>

## 📖 Overview

**Let Me Ask** is an innovative AI-powered streaming assistant designed to help content creators and streamers efficiently respond to viewer questions. The application leverages Google's Gemini AI to transcribe live audio content, create semantic embeddings, and generate intelligent responses based on the streamer's actual spoken content.

### 🎯 Key Features

- **Real-time Audio Recording**: Capture live stream audio with high-quality recording capabilities
- **AI-Powered Transcription**: Automatic speech-to-text conversion using Google Gemini AI
- **Semantic Search**: Advanced embedding-based search to find relevant content from stream recordings
- **Intelligent Q&A**: Generate contextual answers based on the streamer's actual spoken content
- **Room-based Organization**: Organize content by streaming sessions/rooms
- **Vector Database**: PostgreSQL with pgvector extension for efficient similarity search

## 🏗️ Architecture

The project follows a modern full-stack architecture with clear separation of concerns:

```
let-me-ask/
├── client/          # React frontend application
├── server/          # Fastify backend API
└── README.md        # This file
```

### Frontend (React + TypeScript)

- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router DOM
- **Build Tool**: Vite

### Backend (Fastify + TypeScript)

- **Framework**: Fastify with TypeScript
- **Database**: PostgreSQL with pgvector extension
- **ORM**: Drizzle ORM
- **AI Integration**: Google Gemini AI API
- **Validation**: Zod schema validation
- **File Upload**: Multipart file handling

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose**
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Environment Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd let-me-ask
   ```

2. **Set up environment variables**

   Create a `.env` file in the `server/` directory:

   ```env
   PORT=3333
   DATABASE_URL=postgresql://lma:lma@localhost:5432/let_me_ask_agents
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Backend Setup

1. **Navigate to the server directory**

   ```bash
   cd server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the database**

   ```bash
   docker-compose up -d
   ```

4. **Run database migrations**

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Seed the database (optional)**

   ```bash
   npm run db:seed
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

   The backend will be available at `http://localhost:3333`

### Frontend Setup

1. **Navigate to the client directory**

   ```bash
   cd client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## 🔧 Available Scripts

### Backend Scripts

```bash
npm run dev          # Start development server with hot reload
npm run start        # Start production server
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Drizzle Studio for database management
```

### Frontend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🎮 How It Works

### 1. Room Creation

- Create a new streaming room with a name and description
- Each room represents a streaming session

### 2. Audio Recording

- Use the recording interface to capture live stream audio
- Audio is automatically chunked into 5-second segments
- Each chunk is sent to the backend for processing

### 3. AI Processing Pipeline

```
Audio Recording → Transcription → Embedding Generation → Database Storage
```

- **Transcription**: Audio is converted to text using Gemini AI
- **Embedding Generation**: Text is converted to 768-dimensional vectors
- **Storage**: Transcriptions and embeddings are stored in PostgreSQL with pgvector

### 4. Question Answering

```
User Question → Embedding Search → Context Retrieval → AI Answer Generation
```

- **Semantic Search**: User questions are converted to embeddings and compared with stored content
- **Context Retrieval**: Most similar audio chunks are retrieved (similarity > 0.7)
- **Answer Generation**: Gemini AI generates answers based on the retrieved context

## 🗄️ Database Schema

### Rooms

- `id`: Unique identifier
- `name`: Room name
- `description`: Room description
- `createdAt`: Creation timestamp

### Audio Chunks

- `id`: Unique identifier
- `roomId`: Reference to room
- `transcription`: Transcribed text content
- `embeddings`: 768-dimensional vector representation
- `createdAt`: Creation timestamp

### Questions

- `id`: Unique identifier
- `roomId`: Reference to room
- `question`: User's question
- `answer`: AI-generated answer
- `createdAt`: Creation timestamp

## 🤖 AI Integration

### Google Gemini AI Features

1. **Audio Transcription**

   - Model: `gemini-2.5-flash`
   - Multi-language support with automatic translation to US English
   - High-accuracy speech-to-text conversion

2. **Embedding Generation**

   - Model: `text-embedding-004`
   - 768-dimensional vectors for semantic search
   - Optimized for retrieval tasks

3. **Answer Generation**
   - Context-aware responses based on streamer's content
   - Professional and educational tone
   - Citation of relevant content when appropriate

### Vector Similarity Search

The application uses PostgreSQL's pgvector extension to perform efficient similarity searches:

```sql
-- Find most similar audio chunks
SELECT * FROM audio_chunks
WHERE room_id = ?
  AND 1 - (embeddings <=> ?::vector) > 0.7
ORDER BY embeddings <=> ?::vector
LIMIT 3;
```

## 🔒 Security & Best Practices

- **Input Validation**: All inputs are validated using Zod schemas
- **CORS Configuration**: Proper CORS setup for frontend-backend communication
- **Environment Variables**: Sensitive data stored in environment variables
- **Type Safety**: Full TypeScript implementation for type safety
- **Error Handling**: Comprehensive error handling throughout the application

## 🛠️ Development

### Code Quality

- **Biome**: Code formatting and linting
- **TypeScript**: Static type checking
- **ESLint**: Code quality rules

### Database Management

- **Drizzle ORM**: Type-safe database operations
- **Drizzle Studio**: Visual database management interface
- **Migration System**: Version-controlled database schema changes

## 📝 API Endpoints

### Rooms

- `GET /rooms` - List all rooms
- `POST /rooms` - Create a new room

### Audio

- `POST /rooms/:roomId/audio` - Upload audio chunk

### Questions

- `GET /rooms/:roomId/questions` - Get room questions
- `POST /rooms/:roomId/questions` - Create a new question

### Health

- `GET /health` - Health check endpoint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- **Google Gemini AI** for providing powerful AI capabilities
- **Fastify** for the high-performance web framework
- **Drizzle ORM** for type-safe database operations
- **React** and **Vite** for the modern frontend development experience

---

<div align="center">

**Built with ❤️ for the streaming community**

</div>
