<div>
  <a href="https://github.com/xazepysk" target="_blank" rel="noopener noreferrer">
    <img src="https://github.com/xazepysk.png" alt="Xazepysk profile" width="120" height="120" />
  </a>
</div>

A simple Express.js authentication app built for personal use - a clean starter for login, registration, session handling, and SQLite-based user storage.

## About

This project is a lightweight app for learning and quick setup. It gives you a minimal structure for building a user authentication flow without heavy dependencies or complicated frontend code.

## Features

- User registration
- User login
- Password hashing with `scrypt`
- Session-based authentication
- SQLite database for users
- Simple Jade-based views

## Tech Stack

- Node.js
- Express.js
- SQLite
- Jade ( PUA )

## Profiles

- GitHub: [xazepysk](https://github.com/xazepysk)
- Telegram: [ZanLugner](https://t.me/ZanLugner)
- Channel: [DasyncH](https://t.me/DasyncH)

## Project Structure

- `app.js` - app setup and middleware
- `routes/` - home, login, and register pages
- `auth/` - auth logic and database access
- `views/` - Jade templates
- `data/` - SQLite database folder
- `public/` - static files

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the app:

   ```bash
   npm start
   ```

3. Open the app in your browser:

   ```text
   http://localhost:3000
   ```

## Default Routes

- `/` - home page (redirects to login if not authenticated)
- `/login` - login page
- `/register` - registration page
- `/auth/login` - login API endpoint
- `/auth/register` - registration API endpoint

## Database

The app stores users in SQLite at:

```text
data/users.sqlite
```

You can override the database path with the `dbpath` environment variable if needed.

## Notes

This project is intentionally simple and meant for demos, experiments, and learning. It does not include advanced production features such as email verification, CSRF protection, or a full frontend framework.
