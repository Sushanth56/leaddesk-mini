# 🚀 LeadDesk Mini

LeadDesk Mini is a full-stack Lead Management application built using **React**, **Node.js**, **Express**, and **MySQL**. It allows users to submit leads through a public landing page, while administrators can securely manage those leads through a protected dashboard.

---

## 📌 Features

### Public Landing Page
- Responsive UI
- Lead submission form
- Client-side validation
- Success and error messages

### Admin Dashboard
- Secure JWT-based authentication
- View all submitted leads
- Search leads by name or email
- Filter leads by status
- Update lead status
- View lead details in a modal
- Dashboard summary cards

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- React Router
- CSS
- Fetch API

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcryptjs
- MySQL2
- CORS
- dotenv

### Database
- MySQL

---

## 📂 Project Structure

```text
leaddesk-mini/
│
├── backend/
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/leaddesk-mini.git
```

```bash
cd leaddesk-mini
```

---

## Install Frontend

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

Frontend URL:

```
http://localhost:5173
```

---

## Install Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
DB_HOST=localhost
DB_USER=YOUR_DB_USER
DB_PASSWORD=YOUR_DB_PASSWORD
DB_NAME=leaddesk
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm start
```

Backend URL:

```
http://localhost:5000
```

---

## 📡 API Endpoints

### Lead APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/leads` | Submit a new lead |
| GET | `/api/leads` | Get all leads (Protected) |
| PATCH | `/api/leads/:id/status` | Update lead status |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |

---

## 🔒 Authentication

- JWT-based authentication
- Protected admin routes
- Passwords stored securely using bcrypt

---

## ✨ Future Improvements

- Edit and delete leads
- Pagination
- Dashboard charts
- Email notifications
- File uploads
- Export to Excel/PDF
- Role-based access control

---

## 👨‍💻 Author

**Sushanth Chigullapally**

- GitHub: https://github.com/Sushanth56
- LinkedIn: https://www.linkedin.com/in/sushanth81/

---

## 📄 License

This project is for learning and portfolio purposes.