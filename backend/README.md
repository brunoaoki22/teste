# FinanDash Backend API

This is the backend server for the FinanDash application, built with Node.js, Express, and MySQL.

## 🚀 Getting Started

Follow these instructions to get the backend server up and running on your local machine.

### 1. Prerequisites

- **Node.js**: Make sure you have Node.js installed (version 16 or newer is recommended). You can download it from [nodejs.org](https://nodejs.org/).
- **MySQL**: You need a running MySQL server. You can use tools like XAMPP, WAMP, MAMP, or install MySQL directly.

### 2. Installation

Clone the repository and install the dependencies.

```bash
# Navigate into the backend directory
cd backend

# Install NPM packages
npm install
```

### 3. Database Setup

You need to create a database and the required tables for the application to work.

**A. Create the Database**

Connect to your MySQL server and run the following command to create a new database. You can name it whatever you like, but `finandash` is the default.

```sql
CREATE DATABASE finandash;
```

**B. Create the Tables**

Select your newly created database and run the SQL script below to create all the necessary tables (`users`, `categories`, `transactions`, `goals`).

```sql
USE finandash;

-- Users Table
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profilePicture` varchar(255) DEFAULT NULL,
  `subscriptionPlan` enum('free','premium') NOT NULL DEFAULT 'free',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Categories Table
CREATE TABLE `categories` (
  `id` varchar(36) NOT NULL,
  `userId` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `icon` varchar(100) NOT NULL,
  `type` enum('income','expense') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_categories_user_idx` (`userId`),
  CONSTRAINT `fk_categories_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Transactions Table
CREATE TABLE `transactions` (
  `id` varchar(36) NOT NULL,
  `userId` varchar(36) NOT NULL,
  `type` enum('income','expense') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `categoryId` varchar(36) NOT NULL,
  `description` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `status` enum('paid','pending') NOT NULL,
  `isInstallment` tinyint(1) NOT NULL DEFAULT '0',
  `installmentParentId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_transactions_user_idx` (`userId`),
  KEY `fk_transactions_category_idx` (`categoryId`),
  CONSTRAINT `fk_transactions_category` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`),
  CONSTRAINT `fk_transactions_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Goals Table
CREATE TABLE `goals` (
  `id` varchar(36) NOT NULL,
  `userId` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `targetAmount` decimal(10,2) NOT NULL,
  `currentAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `deadline` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_goals_user_idx` (`userId`),
  CONSTRAINT `fk_goals_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

### 4. Environment Configuration

The server needs to know how to connect to your database.

1.  In the `backend/` directory, create a copy of the `.env.example` file and name it `.env`.
2.  Open the new `.env` file and replace the placeholder values with your actual database credentials.

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_secret_password
DB_NAME=finandash
PORT=3001
```

### 5. Running the Server

Once everything is configured, you can start the server.

- **For development (with auto-reload):**
  ```bash
  npm run dev
  ```
- **For production:**
  ```bash
  npm start
  ```

If everything is correct, you should see a message in your console:
`Server is running on port 3001`

Your backend is now ready! The next step is to modify the frontend to make requests to this API.
