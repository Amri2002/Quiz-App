# QuizLab - AI Quiz Generator & Classroom Management App

## Overview
QuizLab is a comprehensive AI-powered educational platform that helps teachers create smart quizzes from teaching materials and manage their classroom efficiently. Students can take quizzes, participate in live interactive sessions, and track their progress.

## Demo Credentials
- **Email:** `demo@quiz.com`
- **Password:** `demo123`

---

## Features & Pages

### 🏠 Landing Page (`/`)
- **Features:** Hero section showcasing AI quiz generation, class management, RAG technology
- **Components:** Feature cards, 4-step "How It Works" section, CTA, footer
- **Navigation:** Login/Sign Up buttons in header

### 👤 Authentication

#### Sign Up (`/signup`)
1. **Role Selection:** Choose between Teacher or Student
2. **Account Creation:** Name, email, password fields
3. **Demo:** Can use `demo@quiz.com / demo123` to explore both teacher and student dashboards

#### Login (`/login`)
- Email and password authentication
- Demo credentials displayed on form
- Routes to appropriate dashboard based on user role

---

## Teacher Features

### 📊 Teacher Dashboard (`/dashboard`)
**Main hub for teachers to manage classes and quizzes**
- Quick action cards:
  - Create New Class
  - Generate Quiz
  - Host Live Session
- Stats overview (Total Students, Quizzes Created, Average Pass Rate)
- Recent activity feed showing student submissions and quiz completions

### 🏫 Classes Management (`/classes`)
- Grid view of all classes
- Auto-generated join codes for each class
- Student count display
- Each class shows schedule, grade level, and description

#### Create New Class (`/classes/new`)
- Form to set up a new class
- Fields: Class Name, Subject, Grade Level, Schedule, Description
- Generates unique join code automatically

### 🤖 Quiz Generation (`/quiz-generator`)
**4-step wizard to create AI-powered quizzes from teaching materials**

**Step 1: Material Upload**
- Upload files: PDF, DOCX, PPT, video links, website URLs
- Drag-and-drop interface
- Simulates RAG embedding processing with status badges

**Step 2: Source Selection**
- Choose which uploaded materials to use for quiz generation
- Select specific documents/URLs to focus on

**Step 3: Quiz Configuration**
- Set question types (Multiple Choice, True/False, Short Answer)
- Choose difficulty level (Easy, Medium, Hard)
- Set number of questions

**Step 4: Review & Publish**
- Preview all generated questions
- Edit individual questions or delete them
- Add custom questions if needed
- Publish quiz to specific classes

### 🎮 Live Session Host (`/live-session`)
**Kahoot-style interactive quiz with real-time leaderboard**

1. **Session Setup** (`/live-session`)
   - Select which quiz to host
   - Generate session code
   - Display tips for best practices

2. **Host Interface** (`/live-session/[id]`)
   - Colorful answer buttons (Red, Blue, Yellow, Green)
   - Real-time participant counter
   - Progress bar and question count
   - Top performers leaderboard
   - Auto-advance feature after students answer

### 📈 Reports & Analytics (`/reports`)
- **Class Performance:** Bar chart comparing class average scores
- **Weekly Trends:** Line chart showing score progression
- **Score Distribution:** Pie chart showing grade distribution
- **Leaderboard:** Top students with rankings and average completion time
- **Key Metrics:** Total quizzes, pass rate, average completion time

---

## Student Features

### 👨‍🎓 Student Dashboard (`/student-dashboard`)
**Hub for students to view assigned quizzes and track progress**
- Quick stats: Completion Rate, Average Score, Pending Quizzes
- List of all assigned quizzes with:
  - Completion status (Pending, Completed)
  - Teacher's name
  - Option to Start or Review quiz
- Join live session with session code

### 📝 Take Quiz (Async Mode) (`/student-quiz`)
**Distraction-free quiz taking experience**
- Centered, clean interface
- Question counter and progress bar
- Timer with visual warnings when time is low
- Multiple-choice selection with visual feedback
- Navigation between questions (Next/Previous)
- Submit quiz to save results

### 🎯 Live Session (Student) (`/live-session/join/[code]`)
**Join teacher-hosted live quizzes**

1. **Join Page** (`/join`)
   - Enter session code (6-character code)
   - Enter student name
   - Connect to live session

2. **Live Interface** (`/live-session/join/[code]`)
   - Large colorful answer buttons (Red, Blue, Yellow, Green)
   - Real-time score tracking
   - Auto-advance between questions
   - Final score display with congratulations message

### 📊 Quiz Review (`/quiz-review/[id]`)
**Detailed feedback on completed quizzes**
- View each question with student's answer vs correct answer
- Color-coded feedback (Green = Correct, Red = Incorrect)
- AI-powered explanations for each question
- Performance metrics and suggestions for improvement

---

## Technical Implementation

### Design System (Mux-Inspired)
- **Background:** Light beige (oklch(0.96 0.01 70))
- **Primary Color:** Purple/Magenta (oklch(0.64 0.25 280))
- **Foreground:** Black/Dark gray (oklch(0.15 0 0))
- **Accent Colors:** Various for charts and UI elements

### Components Used
- **shadcn/ui:** Button, Card, Input, Label, Select, Textarea, etc.
- **Icons:** Lucide React (BookOpen, Users, BarChart3, Sparkles, etc.)
- **Charts:** Recharts (Bar, Line, Pie charts in analytics)

### Storage & State Management
- **localStorage:** Used for demo user sessions and quiz data
- **URL Params:** For dynamic routing (quiz IDs, session codes)
- **React State:** For form handling and UI interactions

### Routing Structure
```
/                          - Landing page
/login                     - Login
/signup                    - Sign up with role selection

TEACHER ROUTES:
/dashboard                 - Teacher dashboard
/classes                   - Class management
/classes/new              - Create new class
/quiz-generator           - Quiz creation wizard
/live-session             - Live session setup
/live-session/[id]        - Live session host interface
/reports                  - Analytics and reports

STUDENT ROUTES:
/student-dashboard        - Student dashboard
/student-quiz            - Take quiz (async mode)
/quiz-review/[id]        - Review completed quiz
/join                    - Join live session
/live-session/join/[code] - Live session student interface
```

---

## User Flows

### Teacher Flow
1. Sign up as Teacher → Dashboard → Create Class → Upload Materials → Generate Quiz → Publish to Class → Host Live Session or Share Link → View Reports

### Student Flow
1. Sign up as Student → Dashboard → View Assigned Quizzes → Take Quiz → Review Results → Participate in Live Sessions → Track Progress

---

## Demo Data & Interactions

The app includes pre-populated demo data:
- Sample quizzes with biology, history, and math questions
- Mock class data with student counts
- Sample analytics showing trends and performance
- Example leaderboard entries

All interactions are fully functional with proper form validation, error handling, and user feedback.

---

## Future Enhancements

- Backend API integration for data persistence
- Real-time collaboration with WebSocket
- Advanced RAG processing with more document types
- Custom branding for schools
- Parent/Guardian portal
- Mobile app
- AI grading for essay questions
- Plagiarism detection
- Integration with LMS (Canvas, Blackboard, etc.)

---

## Support

For issues or questions, please contact support or refer to the in-app help resources.

**Version:** 1.0  
**Last Updated:** January 2026
