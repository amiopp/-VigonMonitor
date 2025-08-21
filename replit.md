# Overview

This is a full-stack hotel IT infrastructure management system called "Vigon Systems" built with modern web technologies. The application provides real-time monitoring and management capabilities for hotel IT systems including WiFi networks, IPTV systems, security cameras, and power consumption. It features a comprehensive dashboard with AI-powered chatbot assistance, voice command capabilities, and WebSocket-based real-time updates for system metrics and alerts.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built using **React 18** with **TypeScript** and uses modern React patterns:

- **Routing**: Uses `wouter` for client-side routing with a single-page application approach
- **State Management**: Leverages React Query (`@tanstack/react-query`) for server state management with automatic caching, background updates, and optimistic updates
- **UI Framework**: Built with **shadcn/ui** components using Radix UI primitives and Tailwind CSS for consistent, accessible design
- **Build Tool**: Uses **Vite** for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom CSS variables for theming and design system consistency

The application follows a component-based architecture with clear separation between dashboard components, UI primitives, and business logic hooks.

## Backend Architecture

The backend is built as a **Node.js REST API** using **Express.js**:

- **API Design**: RESTful endpoints for dashboard data, system metrics, alerts, and chat functionality
- **Real-time Communication**: WebSocket server integration for live system updates and notifications
- **Data Layer**: Uses an abstract storage interface (`IStorage`) with in-memory implementation, designed to be easily swapped with database persistence
- **AI Integration**: OpenAI API integration for intelligent chat responses and voice command processing
- **Development Setup**: Uses `tsx` for TypeScript execution in development with hot reloading

## Data Storage Solutions

Currently implements **in-memory storage** with a well-defined interface that can be easily replaced:

- **Schema Definition**: Uses Drizzle ORM schemas with PostgreSQL dialect for future database migration
- **Data Models**: Comprehensive models for users, system metrics, network performance, alerts, power consumption, and chat messages
- **Migration Ready**: Drizzle configuration is set up for PostgreSQL with migration support

The storage abstraction allows for easy transition from development (in-memory) to production (database) environments.

## Authentication and Authorization

- **User Management**: Basic user system with role-based access (admin role default)
- **Session Handling**: Uses `connect-pg-simple` for PostgreSQL-based session storage when database is connected
- **Security**: Prepared for production authentication with password hashing and session management

## Real-time Features

- **WebSocket Integration**: Bidirectional communication for live dashboard updates
- **Voice Commands**: Browser-based speech recognition for hands-free system control
- **Auto-refresh**: Automatic data polling with configurable intervals for different data types
- **Live Notifications**: Real-time alert system with WebSocket-based delivery

# External Dependencies

## Third-party Services

- **OpenAI API**: For AI chatbot responses and natural language processing of voice commands
- **Neon Database**: PostgreSQL database service (configured via `@neondatabase/serverless`)

## Key Libraries

- **UI Components**: Complete shadcn/ui component library with Radix UI primitives
- **Data Fetching**: React Query for sophisticated server state management
- **Database**: Drizzle ORM with PostgreSQL dialect and Zod schema validation
- **Styling**: Tailwind CSS with class variance authority for component variants
- **Date Handling**: date-fns for consistent date formatting and manipulation
- **Development Tools**: Vite with React plugin and Replit integration for development environment

## Browser APIs

- **Speech Recognition**: Uses Web Speech API (webkitSpeechRecognition) for voice command functionality
- **WebSocket**: Native WebSocket API for real-time communication
- **Local Storage**: Browser storage for user preferences and session data

The architecture is designed to be modular and scalable, with clear separation of concerns and easy extensibility for additional hotel IT systems and monitoring capabilities.