# Myanmar Betting Platform

A full-stack betting platform with Laravel backend and Vue.js frontend.

## Project Structure

- `backend/` - Laravel API backend
- `frontend/` - Vue.js frontend application

## Deployment on Render

### Prerequisites

1. A GitHub account
2. A Render account linked to your GitHub
3. Your code pushed to a GitHub repository

### Deployment Steps

1. Push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. In Render Dashboard:

   - Click "New +"
   - Select "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` and create:
     - A MySQL database
     - The Laravel backend API service
     - The Vue.js frontend service

3. Environment Variables:

   - Backend environment variables will be automatically set from `render.yaml`
   - Additional variables can be set in the Render dashboard

4. Database:

   - The MySQL database will be automatically provisioned
   - Initial migrations will run during deployment

5. Domains:

   - Backend API will be available at: `https://myanmar-betting-api.onrender.com`
   - Frontend will be available at: `https://myanmar-betting.onrender.com`

## Local Development

### Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Features

- User Authentication (Login/Register)
- Admin Dashboard
- Agent Management
- Point System
- Betting System
- Transaction History

## Security

- API Authentication using Laravel Sanctum
- Role-based Access Control
- Secure Password Hashing
- CORS Protection
- Rate Limiting

## License

MIT License
