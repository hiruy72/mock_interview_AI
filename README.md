# PrepWise AI - Advanced Mock Interview Platform

PrepWise is a state-of-the-art AI-powered recruitment preparation platform. It leverages cutting-edge Voice AI and Generative Models to provide users with a realistic, high-pressure interview experience, complete with instant behavioral and technical analysis.

## 🚀 Key Features

*   **Real-time Voice Interviews**: Powered by **Vapi AI**, enabling seamless, low-latency natural language conversations with an AI interviewer.
*   **Intelligent Scenario Generation**: Uses **Google Gemini 2.0 Flash** to architect custom interview paths based on job descriptions, tech stacks, and seniority levels.
*   **Comprehensive Feedback Engine**: Get granular scoring (0-100) across Communication, Technical Knowledge, Problem Solving, and Cultural Fit.
*   **Dynamic UI/UX**: A premium "Midnight Gold" aesthetic built with Next.js 16, Tailwind CSS, and Framer Motion for a fluid, professional feel.
*   **Secure Authentication**: Robust session management using Firebase Auth and secure HTTP-only cookies.
*   **User Profile Management**: Personalized experience with cloud-synced profile data and professional avatar hosting.

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Styling** | Vanilla CSS + Tailwind CSS |
| **Database** | Firebase Firestore |
| **Voice AI** | Vapi.ai SDK |
| **Language Model** | Google Gemini API (Vertex AI) |
| **Authentication** | Firebase Admin SDK (Server) + Client SDK |
| **Storage** | Firebase Cloud Storage |
| **Validation** | Zod + React Hook Form |

## 📦 Project Structure

```text
├── app/                  # Next.js App Router (Root, Interview, Profile, Auth)
├── components/           # UI Components (Agent, InterviewCard, AuthForm, etc.)
├── firebase/             # Client and Admin SDK configurations
├── lib/                  # Server Actions and utility functions
├── public/               # Static assets (logos, avatars, icons)
├── types/                # TypeScript interface definitions
└── constants/            # Design tokens and static configurations
```

## ⚙️ Setting Up Locally

### 1. Clone the repository
```bash
git clone https://github.com/hiruy72/mock_interview_AI.git
cd mock_interview
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and populate it based on `.env.example`:

```env
# Vapi AI
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_token

# Google Gemini
GOOGLE_GENERATIVE_AI_API_KEY=your_key

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=your_id
FIREBASE_CLIENT_EMAIL=your_email
FIREBASE_PRIVATE_KEY="your_private_key"
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🧪 Production Build

To ensure the application is production-ready, run the build script:
```bash
npm run build
```
This performs full TypeScript checking and ESLint validation to ensure zero-runtime errors.

## 🔒 Security Features

*   **Server Actions**: All database mutations are handled via secure Next.js Server Actions.
*   **Middleware Protection**: Protected routes ensure that only authenticated users can access interview and profile data.
*   **CORS & CSP**: Configured to safely allow requests from Vapi and Gemini endpoints.
*   **Input Sanitization**: Strict Zod schemas validate all incoming data to prevent injection attacks.

## 💡 Usage Workflow

1.  **Onboarding**: Sign up or Sign in to create your persistent user profile.
2.  **Configuration**: Navigate to "Start an Interview" and talk to the AI Setup Assistant about your desired role.
3.  **The Interview**: Enter the active call room. The AI will ask role-specific questions.
4.  **End & Analyze**: Disconnect to trigger the "Intelligence Engine," which parses your entire transcript for feedback.
5.  **Review**: View your summary on the Dashboard or deep-dive into the Feedback page for improvement tips.

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Built with ❤️ by the PrepWise Team for future-ready candidates.*
