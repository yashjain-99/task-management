# Task Management App

## _Organize, Track, and Complete Your Tasks Efficiently!_

The Task Management App is a full-stack web application designed to help users manage their daily tasks. Users can log in, create, update, and delete tasks, set priorities and deadlines, and track their progress. Each user has a personalized dashboard, ensuring privacy and a tailored experience.

---

## ✨ Features

- **User Authentication**
  - Secure registration, login, and logout with JWT-based authentication.
  - Refresh tokens stored in HTTP-only cookies for enhanced security.
  - Session validation and automatic token refresh.
- **Personalized Dashboard**
  - Each user sees only their own tasks after logging in.
- **Task Management (CRUD)**
  - Create, read, update, and delete tasks.
  - Assign effort (in days), descriptions, and due dates to tasks.
- **Task Status & Deadlines**
  - Visual indicators for overdue, due soon, and upcoming tasks.
  - Days left or overdue clearly displayed.
- **Bulk Operations**
  - Export all tasks to Excel (.xlsx) with a single click.
  - Bulk upload tasks from Excel files.
- **Responsive UI**
  - Modern, mobile-friendly interface built with Tailwind CSS.
- **Progress Tracking**
  - Track effort and deadlines for each task.
- **Notifications**
  - Real-time toast notifications for actions and errors.
- **API Documentation**
  - Interactive API docs available via Swagger (drf-spectacular).
- **Dockerized Deployment**
  - Easy setup and consistent environments using Docker and Docker Compose.
- **Security**
  - CORS and CSRF protection.
  - Password validation and hashing.
- **Database**
  - PostgreSQL for reliable and scalable data storage.

---

## 🛠️ Tech Stack

**Frontend:**

- [React](https://reactjs.org/) (with Hooks)
- [Vite](https://vitejs.dev/) (for fast builds and HMR)
- [Tailwind CSS](https://tailwindcss.com/) (utility-first styling)
- [React Router](https://reactrouter.com/) (routing)
- [React Hot Toast](https://react-hot-toast.com/) (notifications)
- [React Modal](https://reactcommunity.org/react-modal/) (modals)
- [Lucide React](https://lucide.dev/) (icons)
- [Axios](https://axios-http.com/) (HTTP requests)

**Backend:**

- [Django](https://www.djangoproject.com/) (web framework)
- [Django REST Framework](https://www.django-rest-framework.org/) (API)
- [drf-spectacular](https://drf-spectacular.readthedocs.io/) (OpenAPI/Swagger docs)
- [djangorestframework-simplejwt](https://django-rest-framework-simplejwt.readthedocs.io/) (JWT authentication)
- [pandas](https://pandas.pydata.org/) (Excel import/export)
- [openpyxl](https://openpyxl.readthedocs.io/) (Excel file support)
- [psycopg2](https://www.psycopg.org/) (PostgreSQL driver)

**Database:**

- [PostgreSQL](https://www.postgresql.org/)

**DevOps / Deployment:**

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Nginx](https://www.nginx.com/) (serving frontend in production)

---

## 📦 Usage

### 1. Clone the repository

```bash
git clone https://github.com/yashjain-99/task-management.git
cd task-management
```

### 2. Set up environment variables

- Copy the example env file and adjust as needed:
  ```bash
  cp .env.example .env
  ```

### 3. Build and run the project with Docker

```bash
docker-compose up --build
```

### 4. Access the web application

- Visit: [http://localhost:5173](http://localhost:5173)

### 5. Access the API docs

- Visit: [http://127.0.0.1:8000/api/docs](http://127.0.0.1:8000/api/docs)

---

## 📝 Technical Details

- **Authentication:** JWT tokens with refresh tokens in HTTP-only cookies. Secure endpoints using DRF permissions.
- **Task Model:** Each task is linked to a user, with fields for title, description, effort (days), and due date.
- **Excel Export/Import:** Uses pandas and openpyxl for seamless Excel file handling.
- **Frontend State:** Uses React Context for authentication, modal, and task state management.
- **API Docs:** Auto-generated with drf-spectacular and available at `/api/docs`.
- **Production Ready:** All services are containerized; Nginx serves the frontend, Django serves the API.

---

## 🤝 Support and Contact

If you have any questions, suggestions, or encounter any issues, feel free to reach out at [yashj133.yj@gmail.com]. Feedback is welcome!
