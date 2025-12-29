# KOZA - Enhanced Project Documentation

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to see the app.

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
├── context/         # React context providers
├── hooks/           # Custom React hooks
├── services/        # API services
├── tabs/            # Main tab components
├── utils/           # Utility functions
└── views/           # Full-page views
```

## 🎯 Core Features

### Story & Game Creation
- AI-powered story generation using Gemini 2.0
- Interactive game creation with decision-based gameplay
- Input validation and error handling
- Retry logic with exponential backoff
- Response caching for performance

### User Progression
- XP system with level progression
- 8 unique achievements
- Daily login streak tracking
- Comprehensive profile statistics

### Community
- Browse user-generated content
- Search and filter functionality
- Category-based organization

### Learning Academy
- Educational modules
- Emotional intelligence training
- Digital safety resources

## 🛠️ Technical Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **AI:** Google Gemini 2.0 Flash

## 🔧 Utilities

### Analytics (`utils/analytics.js`)
Track user interactions and app usage:
```javascript
import { analytics } from './utils/analytics';
analytics.track('event_name', { data });
```

### Validation (`utils/validation.js`)
Validate and sanitize user inputs:
```javascript
import { validateStoryInput } from './utils/validation';
const result = validateStoryInput(input);
```

### Achievements (`utils/achievements.js`)
Check and award achievements:
```javascript
import { checkAchievements } from './utils/achievements';
const newAchievements = checkAchievements(stats, unlocked);
```

### Performance (`utils/performance.js`)
Monitor app performance:
```javascript
import { performanceMonitor } from './utils/performance';
performanceMonitor.measureAsync('task', asyncFn);
```

### Accessibility (`utils/accessibility.js`)
Improve accessibility:
```javascript
import { announceToScreenReader } from './utils/accessibility';
announceToScreenReader('Message for screen readers');
```

## 🎨 Components

### ErrorBoundary
Catches and handles React errors gracefully.

### Toast
Non-intrusive notifications with auto-dismiss.

### SkeletonLoader
Loading states for better UX.

### Onboarding
4-step tutorial for new users.

## 🔐 Security

- Input validation on all user inputs
- HTML sanitization to prevent XSS
- API key should be moved to environment variables
- CORS protection via API configuration

## 📊 State Management

Global state managed via React Context (`AppContext`):
- User data and progression
- Saved stories and games
- UI state (active tab, current view)
- Notifications and toasts
- Onboarding status

## 🎯 Best Practices

1. **Error Handling:** All async operations wrapped in try-catch
2. **Validation:** User inputs validated before processing
3. **Accessibility:** ARIA labels and keyboard navigation
4. **Performance:** API caching and retry logic
5. **UX:** Loading states and error feedback

## 🚧 Future Enhancements

- [ ] TypeScript migration
- [ ] Unit and integration tests
- [ ] Dark mode support
- [ ] Story sharing functionality
- [ ] Offline support with service workers
- [ ] API key environment variable
- [ ] Rate limiting
- [ ] Image optimization

## 📝 License

Private project - All rights reserved

## 🤝 Contributing

This is a private project. Contact the maintainer for contribution guidelines.
