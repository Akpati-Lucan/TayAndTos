# Components Documentation

This directory contains reusable React components for the TayAndTos frontend application. These components provide modular, maintainable building blocks for the user interface, following React best practices and modern component patterns.

## 🏗️ Components Overview

The components system provides:
- **Reusable UI Elements**: Modular components for consistent user interface
- **Header System**: Dynamic header components for different user types and devices
- **Data Components**: Static data and configuration for dynamic content
- **Component Architecture**: Clean, maintainable component structure
- **Responsive Design**: Mobile-first responsive components
- **State Management**: Local state management with React hooks
- **Props Interface**: Clear props definitions and validation

## 📁 Component Files

- **`Header/`** - Modular header component system
- **`Footer.jsx`** - Application footer component
- **`learn_more_data.js`** - Static data for Learn More page
- **`home_page_data.js`** - Static data for Home page

## 🧩 Header Component System

### Purpose
The Header system provides dynamic navigation and user interface elements that adapt based on user authentication status and device size.

### Architecture
The Header is modularized into different components for different user types and device sizes:

```
Header/
├── Header.jsx              # Main header component with conditional rendering
├── guest_desktop.jsx       # Desktop header for guest users
├── guest_mobile.jsx        # Mobile header for guest users
├── user_desktop.jsx        # Desktop header for authenticated users
├── user_mobile.jsx         # Mobile header for authenticated users
├── admin_desktop.jsx       # Desktop header for admin users
└── admin_mobile.jsx        # Mobile header for admin users
```

### Main Header Component (`Header.jsx`)

#### Purpose
Central header component that conditionally renders appropriate sub-components based on user status and device size.

#### Implementation
```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import modular header components
import GuestDesktop from './guest_desktop';
import GuestMobile from './guest_mobile';
import UserDesktop from './user_desktop';
import UserMobile from './user_mobile';
import AdminDesktop from './admin_desktop';
import AdminMobile from './admin_mobile';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Component logic and state management
  // ...

  // Conditional rendering based on user type and device size
  if (!isLoggedIn) {
    return isMobile ? (
      <GuestMobile 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        navigate={navigate}
      />
    ) : (
      <GuestDesktop navigate={navigate} />
    );
  }

  if (user?.admin) {
    return isMobile ? (
      <AdminMobile 
        user={user}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        navigate={navigate}
        onLogout={handleLogout}
      />
    ) : (
      <AdminDesktop 
        user={user}
        navigate={navigate}
        onLogout={handleLogout}
      />
    );
  }

  return isMobile ? (
    <UserMobile 
      user={user}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      navigate={navigate}
      onLogout={handleLogout}
    />
  ) : (
    <UserDesktop 
      user={user}
      navigate={navigate}
      onLogout={handleLogout}
    />
  );
}
```

#### State Management
- **`isLoggedIn`**: User authentication status
- **`user`**: Current user data and profile information
- **`isSidebarOpen`**: Mobile sidebar visibility state
- **`isMobile`**: Device size detection for responsive rendering

#### Props Interface
```javascript
// Header component props
interface HeaderProps {
  // No external props - manages internal state
}

// Sub-component props
interface HeaderSubComponentProps {
  user?: User;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
  navigate: NavigateFunction;
  onLogout?: () => void;
}
```

### Guest Header Components

#### Guest Desktop (`guest_desktop.jsx`)
**Purpose**: Desktop navigation for unauthenticated users

**Features**:
- Logo and branding
- Navigation links (Home, Learn More)
- Authentication buttons (Login, Sign Up)
- Clean, minimal design

**Implementation**:
```javascript
function GuestDesktop({ navigate }) {
  return (
    <header className="header guest-desktop">
      <div className="logo" onClick={() => navigate('/')}>
        <img src={logo} alt="TayAndTos" className="logo-image" />
      </div>
      
      <nav className="nav desktop-nav">
        <a href="/" className="nav-link">Home</a>
        <a href="/learn-more" className="nav-link">Learn More</a>
      </nav>
      
      <div className="auth-buttons">
        <button 
          className="auth-link" 
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        <button 
          className="signup-link" 
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </button>
      </div>
    </header>
  );
}
```

#### Guest Mobile (`guest_mobile.jsx`)
**Purpose**: Mobile header for unauthenticated users

**Features**:
- Hamburger menu for mobile navigation
- Collapsible sidebar with navigation
- Touch-optimized interface
- Responsive design

**Implementation**:
```javascript
function GuestMobile({ isSidebarOpen, setIsSidebarOpen, navigate }) {
  return (
    <header className="header guest-mobile">
      <div className="logo" onClick={() => navigate('/')}>
        <img src={logo} alt="TayAndTos" className="logo-image" />
      </div>
      
      <button 
        className="mobile-menu-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      
      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {/* Sidebar content */}
      </div>
    </header>
  );
}
```

### User Header Components

#### User Desktop (`user_desktop.jsx`)
**Purpose**: Desktop navigation for authenticated users

**Features**:
- User profile information
- Navigation links (Home, Book, Find Booking, Profile)
- Logout functionality
- User-specific content

**Implementation**:
```javascript
function UserDesktop({ user, navigate, onLogout }) {
  return (
    <header className="header user-desktop">
      <div className="logo" onClick={() => navigate('/')}>
        <img src={logo} alt="TayAndTos" className="logo-image" />
      </div>
      
      <nav className="nav desktop-nav">
        <a href="/" className="nav-link">Home</a>
        <a href="/book" className="nav-link">Book</a>
        <a href="/find-booking" className="nav-link">Find Booking</a>
      </nav>
      
      <div className="user-nav">
        <a href="/profile" className="profile-link">
          <span className="user-name">{user.first_name}</span>
        </a>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
```

#### User Mobile (`user_mobile.jsx`)
**Purpose**: Mobile header for authenticated users

**Features**:
- Mobile-optimized user interface
- Collapsible sidebar with user options
- Profile information display
- Touch-friendly navigation

### Admin Header Components

#### Admin Desktop (`admin_desktop.jsx`)
**Purpose**: Desktop navigation for admin users

**Features**:
- Admin-specific navigation links
- User and booking management access
- Admin badge and privileges
- Enhanced administrative interface

**Implementation**:
```javascript
function AdminDesktop({ user, navigate, onLogout }) {
  return (
    <header className="header admin-desktop">
      <div className="logo" onClick={() => navigate('/')}>
        <img src={logo} alt="TayAndTos" className="logo-image" />
      </div>
      
      <nav className="nav admin-nav">
        <a href="/" className="nav-link">Home</a>
        <a href="/manage-users" className="admin-link">Manage Users</a>
        <a href="/manage-bookings" className="admin-link">Manage Bookings</a>
      </nav>
      
      <div className="user-nav">
        <a href="/profile" className="profile-link">
          <span className="user-name">
            {user.first_name}
            <span className="admin-badge">Admin</span>
          </span>
        </a>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
```

#### Admin Mobile (`admin_mobile.jsx`)
**Purpose**: Mobile header for admin users

**Features**:
- Mobile admin interface
- Admin-specific mobile navigation
- Admin badge display
- Touch-optimized admin controls

## 🦶 Footer Component (`Footer.jsx`)

### Purpose
Provides consistent footer information across all pages.

### Implementation
```javascript
import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>TayAndTos</h3>
          <p>Your trusted partner for comfortable accommodations</p>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: info@tayandtos.com</p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/learn-more">Learn More</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 TayAndTos. All rights reserved.</p>
      </div>
    </footer>
  );
}
```

### Features
- **Company Information**: Brand details and description
- **Contact Information**: Email and phone contact details
- **Quick Links**: Navigation to important pages
- **Copyright Notice**: Legal information and rights

## 📊 Data Components

### Learn More Data (`learn_more_data.js`)

#### Purpose
Provides static data and content for the Learn More page.

#### Structure
```javascript
export const learnMoreData = {
  hero: {
    title: "Discover TayAndTos",
    subtitle: "Experience luxury and comfort like never before",
    description: "Learn about our commitment to excellence and the unique features that make us your preferred choice."
  },
  
  features: [
    {
      id: 1,
      title: "Luxury Accommodations",
      description: "Premium rooms with modern amenities and elegant design",
      icon: "🏨"
    },
    {
      id: 2,
      title: "Prime Location",
      description: "Centrally located with easy access to attractions",
      icon: "📍"
    },
    // ... more features
  ],
  
  amenities: [
    "Free Wi-Fi",
    "24/7 Room Service",
    "Fitness Center",
    "Swimming Pool",
    "Restaurant & Bar",
    "Conference Rooms"
  ],
  
  testimonials: [
    {
      id: 1,
      name: "John Doe",
      rating: 5,
      comment: "Exceptional service and beautiful accommodations!"
    },
    // ... more testimonials
  ]
};
```

#### Usage
```javascript
import { learnMoreData } from '../components/learn_more_data';

function LearnMore() {
  const { hero, features, amenities, testimonials } = learnMoreData;
  
  return (
    <div className="learn-more">
      <section className="hero">
        <h1>{hero.title}</h1>
        <p>{hero.subtitle}</p>
        <p>{hero.description}</p>
      </section>
      
      <section className="features">
        {features.map(feature => (
          <div key={feature.id} className="feature">
            <span className="feature-icon">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>
      
      {/* More sections */}
    </div>
  );
}
```

### Home Page Data (`home_page_data.js`)

#### Purpose
Provides static data and content for the Home page.

#### Structure
```javascript
export const homePageData = {
  hero: {
    title: "Welcome to TayAndTos",
    subtitle: "Your Home Away From Home",
    description: "Experience luxury, comfort, and exceptional service in the heart of the city.",
    ctaText: "Book Now",
    ctaLink: "/book"
  },
  
  highlights: [
    {
      id: 1,
      title: "Luxury Rooms",
      description: "Spacious accommodations with premium amenities",
      image: "/images/luxury-room.jpg"
    },
    {
      id: 2,
      title: "Prime Location",
      description: "Centrally located with easy access to everything",
      image: "/images/location.jpg"
    },
    {
      id: 3,
      title: "Exceptional Service",
      description: "24/7 support and personalized attention",
      image: "/images/service.jpg"
    }
  ],
  
  stats: {
    rooms: 50,
    guests: 1000,
    rating: 4.8,
    years: 10
  }
};
```

## 🎨 Component Styling

### CSS Organization
Each component has its own CSS file for styling:

- **`Header/`**: Modular header styles with shared base
- **`Footer.css`**: Footer component styles
- **Component-specific styles**: Tailored styling for each component

### Styling Principles
- **Consistent Design**: Unified color scheme and typography
- **Responsive Layout**: Mobile-first responsive design
- **Component Isolation**: Scoped styles to prevent conflicts
- **Reusable Classes**: Common utility classes for consistency

## 🔄 Component Lifecycle

### 1. **Mounting**
- Component initialization
- State setup and API calls
- Event listener registration

### 2. **Updating**
- Props and state changes
- Re-rendering and optimization
- Side effect management

### 3. **Unmounting**
- Cleanup and memory management
- Event listener removal
- State cleanup

## 🧪 Component Testing

### Testing Strategy
```javascript
// Test component rendering
describe('Header Component', () => {
  test('renders guest header for unauthenticated users', () => {
    render(<Header />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });
  
  test('renders user header for authenticated users', () => {
    // Mock authentication state
    render(<Header />);
    expect(screen.getByText('Book')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });
});
```

### Testing Tools
- **Jest**: JavaScript testing framework
- **React Testing Library**: Component testing utilities
- **Mock Service Worker**: API mocking for testing

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Responsive Features
- **Mobile Navigation**: Hamburger menu and sidebar
- **Touch Optimization**: Touch-friendly buttons and interactions
- **Adaptive Layouts**: Flexible layouts for different screen sizes
- **Performance**: Optimized rendering for mobile devices

## 🔒 Security Features

### Authentication Handling
- **Protected Routes**: Route protection based on user status
- **Token Management**: Secure token storage and handling
- **User Validation**: User data validation and sanitization
- **Access Control**: Role-based access control for admin features

### Data Security
- **Input Validation**: Client-side input validation
- **XSS Prevention**: Sanitized content rendering
- **Secure Storage**: Secure local storage usage

## 🚨 Common Issues & Solutions

### 1. **Component Not Rendering**
**Issue:** Component fails to render or display
**Solution:** Check component imports, props, and state management

### 2. **Styling Conflicts**
**Issue:** CSS styles not applying or conflicting
**Solution:** Verify CSS specificity and component isolation

### 3. **State Management Issues**
**Issue:** Component state not updating correctly
**Solution:** Check useState and useEffect implementations

### 4. **Responsive Design Problems**
**Issue:** Layout breaks on certain screen sizes
**Solution:** Test responsive breakpoints and CSS media queries

### 5. **Performance Issues**
**Issue:** Slow component rendering or memory leaks
**Solution:** Optimize re-renders and clean up effects

## 📚 Related Documentation

- **Main Frontend**: See `../README.md` for overall frontend documentation
- **Backend Services**: See `../backend_services/README.md` for API integration
- **Page Components**: See `../pages/README.md` for page implementation
- **CSS Styling**: See `../component_css/README.md` for component styling

## 🔄 Component Maintenance

### 1. **Regular Updates**
- Update component logic for new features
- Maintain backward compatibility
- Update styling for design changes
- Refresh component documentation

### 2. **Performance Optimization**
- Monitor component rendering performance
- Optimize re-renders and state updates
- Implement lazy loading for heavy components
- Clean up memory leaks and event listeners

### 3. **Testing and Validation**
- Test component functionality
- Validate responsive design
- Test accessibility features
- Perform cross-browser testing

### 4. **Code Quality**
- Maintain consistent coding standards
- Update component documentation
- Refactor complex logic
- Implement error boundaries

## 🤝 Contributing

### Development Guidelines
- Follow React best practices and hooks patterns
- Maintain consistent component structure
- Write comprehensive tests for new components
- Update component documentation

### Component Creation
- Create new components in appropriate directories
- Follow established naming conventions
- Implement proper props interface
- Add comprehensive styling

### Code Review Process
- Submit pull requests for review
- Ensure all tests pass
- Follow established coding standards
- Update relevant documentation
