# PrepWise - AI-Powered Mock Interview Platform

PrepWise helps users practice job interviews, receive instant AI feedback, and track their progress. Built with **Next.js**, **Firebase**, and **TypeScript**.

---

## Features

- Sign up / Sign in with Firebase Authentication  
- Create and take mock interviews  
- View interview feedback and scores  
- AI-powered guidance for improving answers  
- Responsive UI with Tailwind CSS  
- Fully client- and server-rendered pages using Next.js app router  

---

## Tech Stack

- **Next.js 15** (App Router & Turbopack)  
- **React & TypeScript**  
- **Firebase** (Authentication & Firestore)  
- **Tailwind CSS** for styling  
- **Sonner** for notifications  
- **Day.js** for date formatting  

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/prepwise.git
cd prepwise
```
### 2. Install dependencies
```bash
npm install
```
### 3. Setup environment variables

Create a .env.local file in the root with your Firebase configuration:
```bash
 NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

```

### 4. Run the development server
```bash
npm run dev
```
