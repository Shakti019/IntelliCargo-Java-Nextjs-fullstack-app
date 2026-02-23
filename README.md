# IntelliCargo Forecast – Full System Plan

IntelliCargo Forecast is an AI-powered import–export logistics platform that enables users to manage trade operations, book transport slots, and optimize global supply routes using predictive analytics and reinforcement learning.

## 📌 Project Architecture

This project is structured as a Monorepo:

- **`/backend-core`**: Spring Boot (Java) - Core Business Logic, Authentication, Booking Management.
- **`/backend-ai`**: FastAPI (Python) - AI Logic, Demand Forecasting, Route Optimization via ML/RL.
- **`/frontend`**: Next.js (TypeScript) - User Interface, Dashboard, Real-time updates.
- **`/docker`**: Database configuration (PostgreSQL & MongoDB).

## 🚀 Getting Started

### Prerequisites

- Java 17+ & Maven
- Node.js 18+ & npm/yarn
- Python 3.9+
- **Database Credentials**:
  - PostgreSQL: A Supabase project URL & Password.
  - MongoDB: A MongoDB Atlas connection string.

### 1. Configure Databases
Update the configuration files with your cloud database credentials:

- **Core Backend**: Edit `backend-core/src/main/resources/application.yml`
  - Set `spring.datasource.url` to your Supabase JDBC URL.
  - Set `username` and `password`.

- **AI Backend**: Edit `backend-ai/main.py`
  - Set `MONGO_URL` to your MongoDB Atlas connection string.

### 2. Run Backend (Core)
```bash
cd backend-core
mvn spring-boot:run
```

### 3. Run AI Service
```bash
cd backend-ai
pip install -r requirements.txt
# Set MONGO_URL environment variable if preferred
# export MONGO_URL="mongodb+srv://..."
uvicorn main:app --reload
```

### 4. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

## ⚙ Tech Stack

### Frontend
- Next.js (React Framework)
- Tailwind CSS
- WebSockets (Socket.io / ws)

### Backend Logic
- **Core**: Spring Boot with Spring Security + JWT
- **AI**: FastAPI (Python) with PyTorch/TensorFlow

### Data Layer
- **PostgreSQL (Supabase)**: User accounts, Trades, Bookings (Relational Data)
- **MongoDB (Atlas Cloud)**: AI Agent State, Analytics, Forecast Results (Document Data)
