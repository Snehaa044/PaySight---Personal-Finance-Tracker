# Paysight - Personal Finance Tracker

Spring Boot + React full-stack app to track income and expenses.

## Tech Stack
- Backend: Java 21, Spring Boot, JWT, MySQL
- Frontend: React, Vite, Axios, Chart.js

## Quick Start

### Backend
cd paysight-backend
# Update application.properties with MySQL credentials
mvn spring-boot:run


### Frontend
cd paysight-frontend
npm install
npm run dev

### API Endpoints
POST /api/auth/register
POST /api/auth/login
GET/POST/PUT/DELETE /api/transactions
GET /api/transactions/dashboard

### Author
Sneha

### Upcoming Features
Budget limits per category

Recurring transactions

Monthly spending reports

Export to CSV/PDF

Mobile responsive design

Spending alerts and notifications

Investment tracking

Family accounts with shared access

## License

MIT License - Free for personal and commercial use.