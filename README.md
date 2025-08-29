# PollApp - Next.js Polling Application

A modern, full-featured polling application built with Next.js, TypeScript, and Tailwind CSS. Create, share, and vote on polls with real-time results and beautiful analytics.

## 🚀 Features

### Authentication
- User registration and login
- Secure authentication system
- User profile management

### Poll Management
- Create polls with multiple options
- Set expiration dates
- Configure poll settings (public/private, multiple votes)
- Real-time voting and results
- Poll sharing capabilities

### User Dashboard
- View created polls
- Track voting history
- Analytics and insights
- Quick actions and shortcuts

### Modern UI/UX
- Responsive design
- Beautiful, accessible components
- Dark mode support (coming soon)
- Mobile-first approach

## 📁 Project Structure

```
poll-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages
│   │   │   ├── login/         # Login page
│   │   │   └── register/      # Registration page
│   │   ├── polls/             # Poll-related pages
│   │   │   ├── create/        # Create poll page
│   │   │   ├── [id]/          # Individual poll view
│   │   │   └── page.tsx       # Polls listing
│   │   ├── dashboard/         # User dashboard
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── ui/               # Shadcn UI components
│   │   │   ├── button.tsx    # Button component
│   │   │   ├── input.tsx     # Input component
│   │   │   └── card.tsx      # Card components
│   │   ├── auth/             # Authentication components
│   │   │   ├── LoginForm.tsx # Login form
│   │   │   └── RegisterForm.tsx # Registration form
│   │   ├── polls/            # Poll-related components
│   │   │   ├── PollCard.tsx  # Poll display card
│   │   │   └── CreatePollForm.tsx # Poll creation form
│   │   └── layout/           # Layout components
│   │       └── Navigation.tsx # Main navigation
│   ├── lib/                  # Utility functions
│   │   └── utils.ts          # Common utilities
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts          # App types and interfaces
│   └── hooks/                # Custom React hooks
├── public/                   # Static assets
├── package.json              # Dependencies and scripts
└── README.md                 # Project documentation
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **State Management**: React hooks (useState, useEffect)
- **Authentication**: (To be implemented - NextAuth.js recommended)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd poll-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Available Pages

### Public Pages
- **Home** (`/`) - Landing page with features and CTA
- **Browse Polls** (`/polls`) - View all available polls
- **Poll Details** (`/polls/[id]`) - View individual poll and vote
- **Login** (`/auth/login`) - User authentication
- **Register** (`/auth/register`) - User registration

### Protected Pages (Authentication Required)
- **Dashboard** (`/dashboard`) - User dashboard with stats and polls
- **Create Poll** (`/polls/create`) - Create new polls
- **Profile** (`/auth/profile`) - User profile management

## 🎨 Component Library

The app uses a custom component library built on top of Shadcn/ui:

### Core Components
- `Button` - Various button styles and variants
- `Input` - Form input fields
- `Card` - Content containers with header, content, and footer

### Custom Components
- `PollCard` - Display polls with voting functionality
- `CreatePollForm` - Form for creating new polls
- `LoginForm` / `RegisterForm` - Authentication forms
- `Navigation` - Main app navigation

## 🔧 Development

### Adding New Components

1. Create components in the appropriate directory under `src/components/`
2. Use TypeScript interfaces for props
3. Follow the existing component patterns
4. Add proper accessibility attributes

### Styling Guidelines

- Use Tailwind CSS classes for styling
- Follow the existing design system
- Ensure responsive design
- Maintain accessibility standards

### TypeScript

- Define interfaces in `src/types/index.ts`
- Use strict TypeScript configuration
- Add proper type annotations for all functions and components

## 🚧 TODO / Roadmap

### Phase 1 - Core Features ✅
- [x] Project structure and scaffolding
- [x] Basic UI components
- [x] Authentication forms
- [x] Poll creation and display
- [x] Landing page and navigation

### Phase 2 - Backend Integration
- [ ] Database setup (PostgreSQL + Prisma)
- [ ] Authentication system (NextAuth.js)
- [ ] API routes for polls and votes
- [ ] Real-time updates (WebSockets)

### Phase 3 - Advanced Features
- [ ] Poll analytics and charts
- [ ] User profiles and settings
- [ ] Poll categories and tags
- [ ] Search and filtering
- [ ] Email notifications

### Phase 4 - Polish & Performance
- [ ] Dark mode support
- [ ] PWA capabilities
- [ ] Performance optimization
- [ ] SEO improvements
- [ ] Testing suite

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.
