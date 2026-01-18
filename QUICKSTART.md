# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
Open your terminal in the project directory and run:
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Exploring the Application

### Teacher View Features

1. **Dashboard (Home)**
   - View quick stats (Total Students, Quizzes Created, Pass Rate)
   - Access quick action cards
   - See recent student activity

2. **Create a Class**
   - Click "My Classes" in sidebar
   - Click "Create Class" button
   - Fill in class name and description
   - Get a unique join code (e.g., AB12-XY)
   - Share code with students

3. **Upload Learning Materials**
   - Click "Library" in sidebar
   - Drag & drop PDF, PPT, DOCX, or images
   - Or paste YouTube/website URLs
   - Watch files process with RAG technology

4. **Generate AI Quiz**
   - Click "Generate Quiz" from dashboard or navigate to Quiz > Generate
   - **Step 1**: Select source materials (check boxes)
   - **Step 2**: Configure quiz:
     - Question Type: MCQ, Essay, Short Answer, or Mixed
     - Difficulty: Easy, Medium, or Hard
     - Number of Questions: 5-50
   - **Step 3**: Preview & Edit questions
     - Edit question text
     - Modify answer options
     - Delete unwanted questions
   - Click "Publish Quiz"

5. **View Analytics**
   - Click "Reports" in sidebar
   - See leaderboard with top performers
   - View detailed statistics
   - Check individual student submissions

### Student View Features

1. **Switch to Student View**
   - Use the Teacher/Student toggle in the sidebar

2. **View Dashboard**
   - See upcoming quizzes
   - Check your stats (Active Classes, Average Score, etc.)
   - Review recent scores

3. **Take Async Quiz**
   - Click "Start Quiz" on any quiz card
   - Answer questions at your own pace
   - Use Previous/Next navigation
   - Watch the timer in top-right
   - Submit when complete

4. **Try Live Mode**
   - Navigate to `/live` (or click Host Live Session as teacher)
   - Experience Kahoot-style colorful interface
   - Click colored answer buttons (Red, Blue, Yellow, Green)
   - See live score and streak

5. **Review Results**
   - Click "Results" in sidebar
   - View detailed breakdown of your answers
   - See correct vs incorrect answers
   - Read AI feedback on essay questions

## 🎨 UI Components Overview

### Reusable Components
All components are located in `/components/ui/`:
- **Button**: Multiple variants (default, outline, ghost, destructive)
- **Card**: Container with header, content, and footer sections
- **Input**: Styled form input
- **Textarea**: Multi-line text input
- **Badge**: Status indicators with color variants

### Layout Components
- **Sidebar**: Responsive navigation with role-based menu
- **RoleProvider**: Context provider for role switching

## 📁 File Structure

```
/app
  /classes          → Class management
  /library          → Material uploads & RAG processing
  /quiz/generate    → Quiz creation wizard
  /quiz/take/[id]   → Async quiz interface
  /live             → Live quiz mode (Kahoot-style)
  /reports          → Analytics & leaderboard
  /results/[id]     → Review mode with AI feedback
  /settings         → User settings
  page.tsx          → Dashboard (role-based)

/components
  /dashboard        → Dashboard components for teacher/student
  /classes          → Class management components
  /quiz             → Quiz wizard steps
  /layout           → Sidebar navigation
  /providers        → Role context
  /ui               → Reusable UI components

/lib
  utils.ts          → Utility functions (cn, generateJoinCode, formatTime)
```

## 🔧 Key Utility Functions

### `cn()` - Class Name Merger
Combines Tailwind classes safely:
```typescript
cn("base-class", condition && "conditional-class")
```

### `generateJoinCode()`
Creates unique class join codes:
```typescript
generateJoinCode() // Returns: "AB12-XY"
```

### `formatTime()`
Formats seconds to MM:SS:
```typescript
formatTime(125) // Returns: "02:05"
```

## 🎨 Customizing Colors

Edit `/tailwind.config.ts` to change theme colors:
```typescript
colors: {
  primary: 'hsl(221.2 83.2% 53.3%)', // Blue
  secondary: 'hsl(210 40% 96.1%)',   // Gray
  // ... add your custom colors
}
```

## 📱 Responsive Breakpoints

- **sm**: 640px (mobile)
- **md**: 768px (tablet)
- **lg**: 1024px (desktop)
- **xl**: 1280px (large desktop)

## 🎯 Next Steps

1. **Customize the design** to match your brand
2. **Connect to a backend API** for real data persistence
3. **Integrate actual RAG/AI services** for quiz generation
4. **Add authentication** for user management
5. **Deploy to Vercel** or your hosting platform

## 💡 Tips

- Use the role toggle frequently to see both perspectives
- All data is currently mock data - perfect for demonstrations
- The UI is fully functional and interactive
- All components follow Shadcn UI patterns for consistency
- Animations and transitions are built-in with Tailwind

## 🐛 Troubleshooting

**Port already in use?**
```bash
npm run dev -- -p 3001
```

**Module not found errors?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Styling not working?**
Make sure Tailwind is processing:
```bash
npm run dev
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
- [TypeScript](https://www.typescriptlang.org/docs)

---

Enjoy building with the AI Quiz Generator! 🎓
