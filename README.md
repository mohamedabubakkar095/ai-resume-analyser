# AI Resume Analyzer

An AI-powered Resume Analyzer web application built with React, Django REST Framework, MySQL, and Google Gemini AI.

## Features

- User Authentication (JWT)
- Resume Upload (PDF)
- ATS Score Analysis
- AI Resume Suggestions
- Skill Extraction
- Missing Skills Detection
- Resume History
- Dashboard
- Notifications

## Tech Stack

### Frontend
- React.js
- Vite
- Material UI

### Backend
- Django
- Django REST Framework
- JWT Authentication

### Database
- MySQL

### AI
- Google Gemini API

## Installation

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file:

```
GEMINI_API_KEY=your_api_key
DB_NAME=resume_analyzer
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
```

## Author

**Mohamed Abubakkar**

GitHub: https://github.com/mohamedabubakkar095