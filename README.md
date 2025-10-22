# Vigon Monitor - Hotel IT Infrastructure Management

A comprehensive, professional hotel IT infrastructure management system with AI-powered assistance, real-time monitoring, and modern UI/UX.
<img width="1919" height="902" alt="Capture d'écran 2025-09-15 045958" src="https://github.com/user-attachments/assets/4d0ffa55-3d57-4f7c-9bc8-6a7e88886d1a" />

## ✨ New Features

### 🔔 Smart Notification System
- **Real-time notifications** with categories and priorities
- **Professional styling** with timestamps and source information
- **Filtering and search** capabilities
- **Auto-mark as read** functionality
- **Toast notifications** for high-priority alerts
- **Action URLs** for direct navigation to relevant pages

### 🎭 Smooth Animations & Transitions
- **Framer Motion powered** animations throughout the UI
- **Page transitions** with fade, slide, and scale effects
- **Staggered animations** for list items and cards
- **Micro-interactions** on hover and click
- **Responsive animations** that work on all devices

### 📱 Responsive Design
- **Mobile-first approach** with adaptive layouts
- **Responsive components** that work on all screen sizes
- **Touch-friendly interfaces** for tablet and mobile
- **Flexible grid systems** that adapt to content

### 🤖 Enhanced AI Assistant
- **Context-aware responses** based on user queries
- **Voice command support** with visual feedback
- **Keyboard shortcuts** (Ctrl+K to toggle, Ctrl+M to minimize)
- **Professional chat interface** with typing indicators
- **Integration with notification system**

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern browser with ES6+ support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vigon-monitor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3000/api

## 🏗️ Project Structure

```
client/src/
├── components/
│   ├── dashboard/
│   │   ├── NotificationDropdown.tsx    # Main notification component
│   │   ├── EnhancedChatbot.tsx         # AI assistant with animations
│   │   ├── FeatureDemo.tsx             # Feature showcase
│   │   └── ...                         # Other dashboard components
│   ├── ui/
│   │   ├── PageTransition.tsx          # Animation wrappers
│   │   ├── ResponsiveWrapper.tsx       # Responsive layout components
│   │   └── ...                         # UI components
│   └── contexts/
│       └── NotificationContext.tsx     # Notification state management
├── pages/                              # Application pages
├── hooks/                              # Custom React hooks
└── lib/                                # Utility functions
```

## 🔧 Key Components

### Notification System

#### NotificationDropdown
- **Location**: `components/dashboard/NotificationDropdown.tsx`
- **Features**:
  - Real-time notification display
  - Category and priority filtering
  - Mark as read functionality
  - Professional styling with badges
  - Responsive design

#### NotificationContext
- **Location**: `contexts/NotificationContext.tsx`
- **Features**:
  - Global notification state management
  - CRUD operations for notifications
  - Auto-cleanup and expiration
  - Integration with toast system

### Animation System

#### PageTransition
- **Location**: `components/ui/PageTransition.tsx`
- **Available Animations**:
  - `PageTransition` - Basic page fade in/out
  - `StaggeredContainer` - Container with staggered children
  - `StaggeredItem` - Individual staggered items
  - `FadeIn` - Fade in with configurable delay
  - `SlideInLeft` - Slide in from left
  - `SlideInRight` - Slide in from right
  - `ScaleIn` - Scale up animation
  - `BounceIn` - Bouncy entrance effect

#### ResponsiveWrapper
- **Location**: `components/ui/ResponsiveWrapper.tsx`
- **Features**:
  - `ResponsiveWrapper` - Main responsive container
  - `ResponsiveGrid` - Responsive grid layouts
  - `ResponsiveFlex` - Responsive flexbox layouts
  - `ResponsiveText` - Responsive text sizing
  - `ResponsiveSpacing` - Responsive spacing

### AI Assistant

#### EnhancedChatbot
- **Location**: `components/dashboard/EnhancedChatbot.tsx`
- **Features**:
  - Context-aware AI responses
  - Voice command support
  - Keyboard shortcuts
  - Professional chat interface
  - Integration with notifications

## 🎨 Usage Examples

### Adding Notifications

```tsx
import { useNotifications } from '@/contexts/NotificationContext';

function MyComponent() {
  const { addNotification } = useNotifications();
  
  const handleAlert = () => {
    addNotification({
      title: 'Security Alert',
      message: 'Unauthorized access detected',
      type: 'warning',
      category: 'security',
      priority: 'high',
      source: 'Security System',
      actionUrl: '/security-systems'
    });
  };
  
  return <button onClick={handleAlert}>Trigger Alert</button>;
}
```

### Using Animations

```tsx
import { PageTransition, StaggeredContainer, StaggeredItem } from '@/components/ui/PageTransition';

function MyPage() {
  return (
    <PageTransition>
      <StaggeredContainer>
        <StaggeredItem>
          <h1>Animated Title</h1>
        </StaggeredItem>
        <StaggeredItem>
          <p>Animated content</p>
        </StaggeredItem>
      </StaggeredContainer>
    </PageTransition>
  );
}
```

### Responsive Layouts

```tsx
import { ResponsiveWrapper, ResponsiveGrid } from '@/components/ui/ResponsiveWrapper';

function MyLayout() {
  return (
    <ResponsiveWrapper padding="lg">
      <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
        <Card>Item 1</Card>
        <Card>Item 2</Card>
        <Card>Item 3</Card>
      </ResponsiveGrid>
    </ResponsiveWrapper>
  );
}
```

## 🎯 Features Demo

Visit `/demo` route to see all features in action:
- **Notification System**: Test different notification types
- **Animation Showcase**: View various animation effects
- **Interactive Elements**: Experience micro-interactions
- **Responsive Design**: Test on different screen sizes

## 🔑 Keyboard Shortcuts

- **Ctrl+K**: Toggle AI Assistant
- **Ctrl+M**: Minimize AI Assistant
- **Escape**: Close modals and dropdowns

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Info**: Blue (#3B82F6)

### Typography
- **Font Family**: Inter, system-ui, sans-serif
- **Headings**: Font weights 600-700
- **Body**: Font weight 400-500

### Spacing
- **Base Unit**: 4px (0.25rem)
- **Spacing Scale**: 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64

## 🚀 Performance Features

- **Lazy loading** for components
- **Optimized animations** with Framer Motion
- **Efficient re-renders** with React hooks
- **Responsive images** and assets
- **Minimal bundle size** with tree shaking

## 🔒 Security Features

- **Protected routes** with authentication
- **Role-based access control**
- **Secure WebSocket connections**
- **Input validation** and sanitization
- **CSRF protection**

## 📊 Monitoring & Analytics

- **Real-time system status**
- **Performance metrics**
- **User activity tracking**
- **Error logging and reporting**
- **Network performance monitoring**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

### v2.0.0 - Major Update
- ✨ New notification system with categories and priorities
- 🎭 Framer Motion animations throughout the UI
- 📱 Responsive design improvements
- 🤖 Enhanced AI assistant with voice commands
- 🎨 Professional UI/UX overhaul
- 🚀 Performance optimizations

### v1.0.0 - Initial Release
- Basic dashboard functionality
- System monitoring
- User authentication
- Basic AI chatbot

---

**Built with ❤️ for modern hotel IT infrastructure management**


Login page (<img width="1919" height="902" alt="Capture d'écran 2025-09-15 045958" src="https://github.com/user-attachments/assets/4d0ffa55-3d57-4f7c-9bc8-6a7e88886d1a" />)




