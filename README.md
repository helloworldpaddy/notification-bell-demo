# Notification Bell Demo with Spring Boot + React + Postgres + Docker

A full-stack real-time notification system demonstrating WebSocket communication with STOMP protocol, REST APIs, and modern web technologies.

## 📝 Original Requirements

This project was built based on the following specifications:

### Build a Notification Bell Demo with Spring Boot + React + Postgres + Docker

I want you to generate a **full-stack demo** app with:

#### Backend (Spring Boot)
- Spring Boot app (Java 21, Maven).
- WebSocket with **STOMP** configured at `/ws`.
- Topic: `/topic/notifications/{userId}`.
- REST API:
  - `GET /api/notifications/{userId}` → fetch historical notifications from DB.
  - `POST /api/notifications/{userId}` with a request body containing message → create notification, store in Postgres, and push real-time via WebSocket.
- Entity: `Notification(id, userId, message, read, createdAt)`.
- Repository: JPA with Postgres.
- Service: Save + publish notification via `SimpMessagingTemplate`.

#### Frontend (React)
- React app with:
  - A simple top navigation bar containing a **notification bell**.
  - When bell is clicked, it shows **real-time + historical notifications** in a dropdown.
  - A simple DataTable below with sample dummy rows (e.g., Task ID, Title, Status).
- Use `@stomp/stompjs`, `sockjs-client`, and `axios`.
- Custom hook `useNotifications(userId)` to handle WebSocket + REST fetch.

#### Database
- Postgres with a `notifications` table.
- Application should connect via environment variables.

#### Docker Compose
- Define services:
  - `backend` (Spring Boot, port 8080).
  - `frontend` (React, port 3000).
  - `db` (Postgres).
- Make sure backend connects to Postgres service `db`.
- Use Docker volumes for Postgres persistence.

#### Curl Command for Testing
Provide a `curl` command to simulate task assignment and trigger notification:
```bash
curl -X POST "http://localhost:8080/api/notifications/1" \
  -H "Content-Type: text/plain" \
  -d "New task assigned to you!"
```

**✅ All requirements above have been successfully implemented and delivered.**

## 🚀 Features

- **Real-time Notifications**: WebSocket with STOMP for instant notification delivery
- **Notification Bell UI**: Interactive bell icon with dropdown showing unread count
- **Historical Data**: Fetch and display past notifications from Postgres database
- **Task Management**: Sample data table with task information
- **Modern UI**: Responsive design with hover effects and status indicators
- **Docker Support**: Complete containerization with Docker Compose

## 🏗️ Architecture & System Design

### 📐 **Overall Architecture**

This application follows a **3-tier microservices architecture** with **event-driven real-time communication**:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React SPA)   │    │ (Spring Boot)   │    │ (PostgreSQL)    │
│                 │    │                 │    │                 │
│ • UI Components │◄──►│ • REST APIs     │◄──►│ • Notifications │
│ • WebSocket     │    │ • WebSocket     │    │ • Indexes       │
│ • State Mgmt    │    │ • STOMP Broker  │    │ • Constraints   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │
        └───── WebSocket ───────┘
          (Real-time Events)
```

### 🎯 **Design Patterns Used**

1. **MVC (Model-View-Controller)**
   - **Model**: JPA Entities (`Notification`)
   - **View**: React Components (`NotificationBell`, `DataTable`)
   - **Controller**: REST Controllers (`NotificationController`)

2. **Repository Pattern**
   - Data access abstraction via `NotificationRepository`
   - Separation of business logic from data persistence

3. **Observer Pattern**
   - WebSocket STOMP for real-time event broadcasting
   - Frontend subscribes to notification topics

4. **Custom Hook Pattern (React)**
   - `useNotifications` hook encapsulates WebSocket logic
   - Reusable state management across components

5. **Dependency Injection**
   - Spring's IoC container manages bean lifecycle
   - Loose coupling between components

### 🔄 **Data Flow Architecture**

#### **Notification Creation Flow:**
```
1. User Action/System Event
         ↓
2. REST API Call (POST /api/notifications/{userId})
         ↓
3. NotificationController receives request
         ↓
4. NotificationService processes business logic
         ↓
5. Repository saves to PostgreSQL
         ↓
6. SimpMessagingTemplate broadcasts via WebSocket
         ↓
7. Frontend receives real-time update
         ↓
8. UI updates notification bell and count
```

#### **Notification Retrieval Flow:**
```
1. Frontend Component Mount/User Action
         ↓
2. REST API Call (GET /api/notifications/{userId})
         ↓
3. Repository queries PostgreSQL with ordering
         ↓
4. Service returns paginated results
         ↓
5. Frontend updates state and renders UI
```

### 🏛️ **Backend Architecture (Spring Boot)**

#### **Layered Architecture:**
```
┌─────────────────────────────────────────┐
│             Controller Layer            │
│  • NotificationController               │
│  • Exception Handling                   │
│  • Request/Response Mapping             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│             Service Layer               │
│  • NotificationService                  │
│  • Business Logic                       │
│  • WebSocket Broadcasting               │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           Repository Layer              │
│  • NotificationRepository               │
│  • Data Access Operations               │
│  • Query Methods                        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│             Database Layer              │
│  • PostgreSQL                           │
│  • JPA/Hibernate ORM                    │
│  • Connection Pooling                   │
└─────────────────────────────────────────┘
```

#### **Key Components:**
- **WebSocket Configuration**: STOMP protocol setup with SockJS fallback
- **CORS Configuration**: Cross-origin resource sharing for frontend
- **JPA Configuration**: Database connection and entity management
- **Message Broker**: In-memory simple broker for real-time messaging

### 🎨 **Frontend Architecture (React)**

#### **Component Hierarchy:**
```
App.js
├── Navbar.js
│   ├── NotificationBell.js
│   │   └── NotificationDropdown
│   └── UserInfo
└── DataTable.js
    └── TaskRows
```

#### **State Management:**
- **Local State**: Component-specific UI state
- **Custom Hooks**: `useNotifications` for WebSocket and API integration
- **Real-time Updates**: WebSocket subscriptions with automatic reconnection

#### **Key Features:**
- **Responsive Design**: Mobile-first CSS with flexbox/grid
- **Real-time UI**: Instant notification updates without page refresh
- **Error Handling**: Connection status indicators and retry logic
- **Performance**: Memoization and efficient re-renders

### 🗄️ **Database Design**

#### **Schema:**
```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    message VARCHAR(1000) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

#### **Data Model:**
- **Primary Key**: Auto-incrementing ID
- **Foreign Key**: user_id for user association
- **Soft Deletes**: No deletion, only read status updates
- **Ordering**: Created timestamp for chronological display

### 🌐 **Communication Protocols**

#### **HTTP REST API:**
- **GET** `/api/notifications/{userId}` - Fetch historical data
- **POST** `/api/notifications/{userId}` - Create new notification
- **PUT** `/api/notifications/{id}/read` - Mark as read
- **GET** `/api/notifications/{userId}/count` - Unread count

#### **WebSocket STOMP:**
- **Endpoint**: `/ws` with SockJS fallback
- **Topic**: `/topic/notifications/{userId}` for user-specific broadcasts
- **Protocol**: STOMP over WebSocket for message framing
- **Fallback**: HTTP polling for older browsers

### 🔒 **Security Considerations**

- **CORS**: Configured for local development (production requires specific origins)
- **Input Validation**: Request body validation and sanitization
- **SQL Injection**: JPA parameterized queries
- **XSS Protection**: React's built-in XSS prevention
- **Future**: Authentication and authorization layers needed

### 📊 **Performance Optimizations**

#### **Backend:**
- **Connection Pooling**: HikariCP for database connections
- **Indexing**: Strategic database indexes on frequently queried columns
- **Caching**: Hibernate second-level cache (configurable)
- **Async Processing**: WebSocket broadcasting doesn't block REST requests

#### **Frontend:**
- **Code Splitting**: Lazy loading components (future enhancement)
- **Memoization**: React.memo and useMemo for expensive operations
- **Debouncing**: API calls optimization
- **WebSocket Reconnection**: Automatic reconnection with exponential backoff

### 🐳 **Deployment Architecture**

#### **Containerization:**
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Frontend      │  │   Backend       │  │   Database      │
│   Container     │  │   Container     │  │   Container     │
│                 │  │                 │  │                 │
│ • Node.js 18    │  │ • Java 21       │  │ • PostgreSQL 15 │
│ • React Build   │  │ • Spring Boot   │  │ • Persistent    │
│ • Nginx Serve   │  │ • Maven Build   │  │   Volume        │
└─────────────────┘  └─────────────────┘  └─────────────────┘
        │                       │                       │
        └───────── Docker Network ──────────────────────┘
```

#### **Environment Configuration:**
- **Development**: Local with hot-reload
- **Production**: Docker Compose with environment variables
- **Scaling**: Ready for Kubernetes deployment

### 🔄 **Event-Driven Architecture**

#### **Real-time Event Flow:**
1. **Event Trigger**: User action or system event
2. **Business Logic**: Service layer processes the event
3. **Persistence**: Data saved to PostgreSQL
4. **Event Broadcasting**: WebSocket message sent to subscribers
5. **UI Update**: Frontend receives and renders real-time update

This architecture ensures **scalability**, **maintainability**, and **real-time responsiveness** while following industry best practices for full-stack application development.

## 🛠️ Setup & Installation

### Prerequisites
- Docker and Docker Compose
- Java 21 (for local development)
- Node.js 18+ (for local development)

### Quick Start with Docker

1. **Clone and navigate to the project:**
   ```bash
   cd /Users/manumn/Documents/cursor-apps/React-SpringSTOM-bell
   ```

2. **Start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: localhost:5432

### Local Development

#### Backend
```bash
cd backend
./mvnw spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

#### Database (using Docker)
```bash
docker run -d \
  --name postgres-notifications \
  -e POSTGRES_DB=notifications_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15
```

## 🧪 Testing the Application

### Send a notification via curl:
```bash
curl -X POST "http://localhost:8080/api/notifications/1" \
  -H "Content-Type: text/plain" \
  -d "New task assigned to you!"
```

### API Endpoints:

- **GET** `/api/notifications/{userId}` - Fetch user notifications
- **POST** `/api/notifications/{userId}` - Create new notification
- **GET** `/api/notifications/{userId}/count` - Get unread count
- **PUT** `/api/notifications/{notificationId}/read` - Mark as read

### WebSocket Testing:
- Connect to: `ws://localhost:8080/ws`
- Subscribe to: `/topic/notifications/1`
- Send notifications via REST API to see real-time updates

## 📂 Project Structure

```
React-SpringSTOM-bell/
├── backend/                     # Spring Boot application
│   ├── src/main/java/com/example/notification/
│   │   ├── NotificationDemoApplication.java
│   │   ├── entity/Notification.java
│   │   ├── repository/NotificationRepository.java
│   │   ├── service/NotificationService.java
│   │   ├── controller/NotificationController.java
│   │   └── config/
│   │       ├── WebSocketConfig.java
│   │       └── CorsConfig.java
│   ├── src/main/resources/application.yml
│   ├── pom.xml
│   └── Dockerfile
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── NotificationBell.js
│   │   │   ├── Navbar.js
│   │   │   └── DataTable.js
│   │   ├── hooks/useNotifications.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── init.sql                     # Database initialization
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Backend
- `DB_HOST`: Database host (default: localhost)
- `DB_PORT`: Database port (default: 5432)
- `DB_NAME`: Database name (default: notifications_db)
- `DB_USER`: Database user (default: postgres)
- `DB_PASSWORD`: Database password (default: password)

#### Frontend
- Configured to proxy API requests to backend at port 8080

## 🎯 Key Features Explained

### Real-time Notifications
- Uses WebSocket with STOMP protocol for bi-directional communication
- Automatic reconnection on connection loss
- Topic-based subscription per user

### Notification Bell Component
- Shows unread count badge
- Dropdown with notification history
- Click to mark notifications as read
- Connection status indicator

### Database Integration
- PostgreSQL with JPA/Hibernate
- Proper indexing for performance
- Sample data for testing

## 🚀 Next Steps

- Add user authentication
- Implement notification categories
- Add push notifications for mobile
- Implement notification preferences
- Add real-time user presence




<h2> 
prompt used
</h2>
# Build a Notification Bell Demo with Spring Boot + React + Postgres + Docker

I want you to generate a **full-stack demo** app with:

## Backend (Spring Boot)
- Spring Boot app (Java 21, Maven).
- WebSocket with **STOMP** configured at `/ws`.
- Topic: `/topic/notifications/{userId}`.
- REST API:
  - `GET /api/notifications/{userId}` → fetch historical notifications from DB.
  - `POST /api/notifications/{userId}` with a request body containing message → create notification, store in Postgres, and push real-time via WebSocket.
- Entity: `Notification(id, userId, message, read, createdAt)`.
- Repository: JPA with Postgres.
- Service: Save + publish notification via `SimpMessagingTemplate`.

## Frontend (React)
- React app with:
  - A simple top navigation bar containing a **notification bell**.
  - When bell is clicked, it shows **real-time + historical notifications** in a dropdown.
  - A simple DataTable below with sample dummy rows (e.g., Task ID, Title, Status).
- Use `@stomp/stompjs`, `sockjs-client`, and `axios`.
- Custom hook `useNotifications(userId)` to handle WebSocket + REST fetch.

## Database
- Postgres with a `notifications` table.
- Application should connect via environment variables.

## Docker Compose
- Define services:
  - `backend` (Spring Boot, port 8080).
  - `frontend` (React, port 3000).
  - `db` (Postgres).
- Make sure backend connects to Postgres service `db`.
- Use Docker volumes for Postgres persistence.

## Curl Command for Testing
Provide a `curl` command to simulate task assignment and trigger notification:
```bash
curl -X POST "http://localhost:8080/api/notifications/1" \
  -H "Content-Type: text/plain" \
  -d "New task assigned to you!"


## 📝 License

This project is for demonstration purposes.
