# Employee Management System

A full-stack Employee Management System. It provides secure authentication, employee and department management, search & filtering, dashboard statistics, activity logging, and a responsive modern UI.

## 📌 Project Description

This application helps organizations manage their workforce in one place. An admin can manage employees and departments — add, view, edit, and remove records — search and filter the list, and track key statistics on a dashboard. Every create/update/delete action is recorded in an activity log for an audit trail.

## ✨ Features

- **User Registration**  
- **Login & Logout** 
- **JWT Authentication** 
- **Employee CRUD** 
- **Search** 
- **Filtering** 
- **Dashboard** 
- **Employee Statistics** 
- **Activity Logs** 
- **Validation** 
- **Responsive UI** 
## 🛠️ Technologies Used

### Frontend
| Technology | Purpose |
| ---------- | ------- |
| **React.js** | UI library |
| **React Router** | Client-side routing |
| **Axios** | HTTP client for the backend API |
| **Tailwind CSS** | Styling / responsive design |
| **Recharts** | Dashboard & department charts |
| **Lucide React** | Icons |
| **React Hot Toast** | Notifications |
| **Vite** | Build tool & dev server |

### Backend
| Technology | Purpose |
| ---------- | ------- |
| **Node.js** | JavaScript runtime |
| **Express.js** | REST API framework |
| **@supabase/supabase-js** | Supabase (PostgreSQL) client |
| **bcryptjs** | Password hashing |
| **jsonwebtoken** | JWT generation & verification |
| **dotenv** | Environment variables |
| **cors** | Cross-origin resource sharing |
| **nodemon** | Dev auto-restart |

### Database
| Technology | Purpose |
| ---------- | ------- |
| **Supabase** | **PostgreSQL** database |

### Tooling
| Technology | Purpose |
| ---------- | ------- |
| **Git** | Version control |
| **npm workspaces** | Manage frontend + backend together |
| **concurrently** | Run both servers in one command |


## 🔐 Environment Variables

Create a `.env` file in the `backend/` folder by copying the template:



```env
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
JWT_SECRET=a-long-random-secret-string
PORT=5000
```

## 🚀 Getting Started

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

## Clone & install

# Open terminal and run


# 1. git clone  https://github.com/AFNAN7788/Employee-Management-System.git
cd employee-management-system



# 2. Install all dependencies (frontend + backend via workspaces)
npm install



# 3. Database 

Configure Database Supabase




# 4. Run both servers
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000


## 📄 License

MIT — free to use for learning and internships.
