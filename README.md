# CyberSecure Study Progress Tracker

A comprehensive Next.js application for cybersecurity students to track their academic progress, manage assignments, monitor certification advancement, and integrate with modern cloud services.

![Landing Page](https://github.com/user-attachments/assets/0d182ee9-6f18-45cb-93e2-c6167d0a091d)

## 🚀 Features

### ✅ Implemented Core Features
- **🔐 Firebase Authentication** - Google OAuth integration
- **📚 Assignment Management** - Full CRUD operations for coursework tracking
- **📊 Progress Visualization** - Interactive charts and progress tracking
- **🎯 Dashboard Overview** - Comprehensive learning progress overview
- **📱 Responsive Design** - Mobile-first design with Tailwind CSS
- **🏗️ Modern Architecture** - Next.js 15 with TypeScript and App Router

### 🔄 Ready for Integration
- **☁️ Google Cloud Backend** - Firestore database structure ready
- **📌 IPFS Pinning** - Academic work storage preparation
- **🏆 NFT Metadata** - Achievement certification setup
- **📢 Slack Integration** - Notification webhook ready
- **🔍 Perplexity Research** - AI-powered research feed structure
- **📈 IEEE/Red Hat Certification Tracking** - Progress monitoring system

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Charts**: Recharts
- **Deployment**: Vercel-ready
- **Icons**: Heroicons

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Firebase project
- Vercel account (for deployment)

### 1. Clone and Install
```bash
git clone <repository-url>
cd Jerome-s-Official-PATH-IT-Study-Progress-Tracker
npm install
```

### 2. Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Google provider
3. Create Firestore database
4. Copy your config from Project Settings

### 3. Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Protected dashboard pages
│   │   ├── assignments/   # Assignment management
│   │   └── progress/      # Progress tracking & charts
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with auth
│   └── page.tsx          # Landing page
├── components/            # Reusable components
│   ├── dashboard/        # Dashboard-specific components
│   └── ui/              # UI components
├── lib/                  # Core utilities
│   ├── auth.tsx         # Authentication context
│   └── firebase.ts      # Firebase configuration
├── types/               # TypeScript definitions
└── utils/              # Helper functions
```

## 🎯 Core Features

### Authentication System
- Google OAuth integration
- Protected dashboard routes
- User profile management
- Automatic redirect handling

### Assignment Management
- Create, read, update, delete assignments
- Priority levels (High, Medium, Low)
- Status tracking (Pending, In Progress, Completed, Overdue)
- Course categorization
- Tag-based organization
- Due date management

### Progress Tracking
- Visual charts for assignment status
- Certification progress monitoring
- Priority distribution analysis
- Weekly study hour tracking
- Real-time progress updates

### Dashboard Overview
- Key metrics display
- Recent assignments summary
- Certification progress cards
- Quick access navigation

## 🔮 Future Enhancements

### Advanced Features Ready for Implementation
1. **IPFS Integration**: Pin academic work to IPFS for permanent storage
2. **NFT Certificates**: Generate blockchain certificates for achievements
3. **Slack Notifications**: Automated reminders and progress updates
4. **Perplexity Research**: AI-powered research assistance
5. **Google Cloud Functions**: Server-side processing and notifications
6. **Cloud Scheduler**: Automated task reminders

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎓 Educational Focus

This application is specifically designed for cybersecurity education with:
- IEEE certification tracking
- Red Hat certification progress
- Security-focused course management
- Industry-standard progress monitoring
- Professional development tracking

Built with modern web technologies to provide cybersecurity students with a comprehensive learning management and progress tracking solution.
