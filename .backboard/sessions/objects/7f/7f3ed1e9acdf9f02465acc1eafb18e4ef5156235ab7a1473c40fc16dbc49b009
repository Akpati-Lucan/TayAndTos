# Header CSS Documentation

This directory contains the modular CSS styling system for the Header components. The CSS is organized to provide consistent styling across different user types (guest, user, admin) and device sizes (desktop, mobile) while maintaining a clean, maintainable structure.

## 🏗️ Header CSS Overview

The Header CSS system provides:
- **Modular Styling**: Separate CSS files for different header types
- **Shared Base Styles**: Common styles used across all header components
- **Responsive Design**: Mobile-first responsive layouts
- **User Type Adaptation**: Different styles for guest, user, and admin headers
- **Device Optimization**: Desktop and mobile-specific styling
- **Consistent Design**: Unified color scheme and typography
- **Component Isolation**: Scoped styles to prevent conflicts

## 📁 CSS File Structure

```
Header/
├── shared.css           # Common header styles and base structure
├── guest_desktop.css    # Guest user desktop header styles
├── guest_mobile.css     # Guest user mobile header styles
├── user_desktop.css     # Authenticated user desktop header styles
├── user_mobile.css      # Authenticated user mobile header styles
├── admin_desktop.css    # Admin user desktop header styles
├── admin_mobile.css     # Admin user mobile header styles
└── README.md            # This documentation file
```

## 🎨 Shared Base Styles (`shared.css`)

### Purpose
Contains common header styles used across all header components to ensure consistency and reduce duplication.

### Core Styles

#### Header Container
```css
/* Base header structure */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

/* Logo styling */
.logo {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-image {
  height: 40px;
  width: auto;
}

/* Navigation base styles */
.nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: #FFFFFF;
  text-decoration: none;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  padding: 0.5rem 0.3rem;
  border-radius: 4px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* Desktop navigation */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }
  
  .header {
    padding: 1rem;
  }
}
```

### Design Principles
- **Consistent Spacing**: Standardized margins, padding, and gaps
- **Unified Colors**: Consistent color scheme throughout
- **Smooth Transitions**: CSS transitions for interactive elements
- **Responsive Breakpoints**: Mobile-first responsive design
- **Accessibility**: High contrast and readable fonts

## 👤 Guest Header Styles

### Guest Desktop (`guest_desktop.css`)

#### Purpose
Styles for guest users on desktop devices.

#### Implementation
```css
/* Guest Desktop Header Styles */
@import './shared.css';

/* Authentication buttons */
.auth-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.auth-link {
  color: #FFFFFF;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  border: 1px solid transparent;
}

.auth-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.signup-link {
  background-color: #4CAF50;
  color: #FFFFFF;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 600;
}

.signup-link:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}
```

#### Features
- **Clean Design**: Minimal, focused interface
- **Call-to-Action**: Prominent signup button
- **Hover Effects**: Interactive button states
- **Responsive Layout**: Adapts to different screen sizes

### Guest Mobile (`guest_mobile.css`)

#### Purpose
Styles for guest users on mobile devices.

#### Implementation
```css
/* Guest Mobile Header Styles */
@import './shared.css';

/* Mobile menu button */
.mobile-menu-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.hamburger {
  width: 24px;
  height: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger span {
  width: 100%;
  height: 3px;
  background-color: #FFFFFF;
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* Mobile sidebar */
.mobile-sidebar {
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  transition: right 0.3s ease;
  z-index: 1001;
  overflow-y: auto;
}

.mobile-sidebar.open {
  right: 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-logo-image {
  height: 35px;
  width: auto;
}

.close-sidebar-btn {
  background: none;
  border: none;
  color: #FFFFFF;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.sidebar-nav {
  padding: 1.5rem;
}

.sidebar-link {
  display: block;
  color: #FFFFFF;
  text-decoration: none;
  padding: 1rem 0;
  font-size: 1.1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.sidebar-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  padding-left: 1rem;
}

.sidebar-auth-section {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-signup {
  display: block;
  background-color: #4CAF50;
  color: #FFFFFF;
  text-decoration: none;
  padding: 1rem;
  text-align: center;
  border-radius: 6px;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.sidebar-signup:hover {
  background-color: #45a049;
  transform: translateY(-2px);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .mobile-sidebar {
    width: 100%;
    right: -100%;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 0.75rem;
  }
  
  .logo-image {
    height: 35px;
  }
}
```

#### Features
- **Hamburger Menu**: Collapsible mobile navigation
- **Slide-in Sidebar**: Smooth sidebar animation
- **Touch Optimization**: Mobile-friendly interactions
- **Responsive Design**: Adapts to different mobile screen sizes

## 🔐 User Header Styles

### User Desktop (`user_desktop.css`)

#### Purpose
Styles for authenticated users on desktop devices.

#### Implementation
```css
/* User Desktop Header Styles */
@import './shared.css';

/* User navigation styles */
.user-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #FFFFFF;
  text-decoration: none;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  border: 1px solid transparent;
}

.profile-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.user-name {
  color: #FFFFFF;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logout-btn {
  background-color: #f44336;
  color: #FFFFFF;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: #d32f2f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}
```

#### Features
- **User Profile**: Profile information display
- **Logout Button**: Secure logout functionality
- **Interactive Elements**: Hover effects and transitions
- **Professional Design**: Clean, user-focused interface

### User Mobile (`user_mobile.css`)

#### Purpose
Styles for authenticated users on mobile devices.

#### Implementation
```css
/* User Mobile Header Styles */
@import './shared.css';

/* Mobile menu button */
.mobile-menu-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.hamburger {
  width: 24px;
  height: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger span {
  width: 100%;
  height: 3px;
  background-color: #FFFFFF;
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* Mobile sidebar */
.mobile-sidebar {
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  transition: right 0.3s ease;
  z-index: 1001;
  overflow-y: auto;
}

.mobile-sidebar.open {
  right: 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-logo-image {
  height: 35px;
  width: auto;
}

.close-sidebar-btn {
  background: none;
  border: none;
  color: #FFFFFF;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.sidebar-nav {
  padding: 1.5rem;
}

.sidebar-link {
  display: block;
  color: #FFFFFF;
  text-decoration: none;
  padding: 1rem 0;
  font-size: 1.1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.sidebar-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  padding-left: 1rem;
}

/* User section in sidebar */
.sidebar-user-section {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-profile-icon {
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-size: 1.2rem;
}

.sidebar-user-name {
  color: #FFFFFF;
  font-weight: 500;
  font-size: 1.1rem;
}

.sidebar-logout-btn {
  display: block;
  background-color: #f44336;
  color: #FFFFFF;
  text-decoration: none;
  padding: 1rem;
  text-align: center;
  border-radius: 6px;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.sidebar-logout-btn:hover {
  background-color: #d32f2f;
  transform: translateY(-2px);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .mobile-sidebar {
    width: 100%;
    right: -100%;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 0.75rem;
  }
  
  .logo-image {
    height: 35px;
  }
}
```

#### Features
- **User Profile Display**: Profile information in sidebar
- **Enhanced Navigation**: User-specific navigation options
- **Logout Functionality**: Secure logout in mobile interface
- **Touch Optimization**: Mobile-friendly user interactions

## 👑 Admin Header Styles

### Admin Desktop (`admin_desktop.css`)

#### Purpose
Styles for admin users on desktop devices.

#### Implementation
```css
/* Admin Desktop Header Styles */
@import './shared.css';

/* Admin navigation styles */
.admin-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.admin-link {
  color: #FFD700;
  text-decoration: none;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  font-weight: 600;
  white-space: nowrap;
  border: 1px solid transparent;
  position: relative;
}

.admin-link:hover {
  background-color: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.3);
  transform: translateY(-2px);
}

.admin-link::after {
  content: 'Admin';
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #FFD700;
  color: #1e3c72;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 700;
}

/* User navigation styles */
.user-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #FFFFFF;
  text-decoration: none;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  border: 1px solid transparent;
}

.profile-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.user-name {
  color: #FFFFFF;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.admin-badge {
  background-color: #FFD700;
  color: #1e3c72;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 700;
  margin-left: 0.5rem;
}

.logout-btn {
  background-color: #f44336;
  color: #FFFFFF;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: #d32f2f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}
```

#### Features
- **Admin Badges**: Visual admin identification
- **Enhanced Navigation**: Admin-specific navigation links
- **Golden Accents**: Premium admin styling
- **Professional Interface**: Administrative functionality focus

### Admin Mobile (`admin_mobile.css`)

#### Purpose
Styles for admin users on mobile devices.

#### Implementation
```css
/* Admin Mobile Header Styles */
@import './shared.css';

/* Mobile menu button */
.mobile-menu-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.hamburger {
  width: 24px;
  height: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger span {
  width: 100%;
  height: 3px;
  background-color: #FFFFFF;
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* Mobile sidebar */
.mobile-sidebar {
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  transition: right 0.3s ease;
  z-index: 1001;
  overflow-y: auto;
}

.mobile-sidebar.open {
  right: 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-logo-image {
  height: 35px;
  width: auto;
}

.close-sidebar-btn {
  background: none;
  border: none;
  color: #FFFFFF;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.sidebar-nav {
  padding: 1.5rem;
}

.sidebar-link {
  display: block;
  color: #FFFFFF;
  text-decoration: none;
  padding: 1rem 0;
  font-size: 1.1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.sidebar-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  padding-left: 1rem;
}

/* User section in sidebar */
.sidebar-user-section {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-profile-icon {
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-size: 1.2rem;
}

.sidebar-user-name {
  color: #FFFFFF;
  font-weight: 500;
  font-size: 1.1rem;
}

.sidebar-user-name .admin-badge {
  background-color: #FFD700;
  color: #1e3c72;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 700;
  margin-left: 0.5rem;
}

/* Admin sidebar links styling */
.sidebar-user-section .sidebar-link {
  color: #FFD700;
  font-weight: 600;
}

.sidebar-user-section .sidebar-link:hover {
  background-color: rgba(255, 215, 0, 0.1);
  color: #FFFFFF;
}

.sidebar-logout-btn {
  display: block;
  background-color: #f44336;
  color: #FFFFFF;
  text-decoration: none;
  padding: 1rem;
  text-align: center;
  border-radius: 6px;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.sidebar-logout-btn:hover {
  background-color: #d32f2f;
  transform: translateY(-2px);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .mobile-sidebar {
    width: 100%;
    right: -100%;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 0.75rem;
  }
  
  .logo-image {
    height: 35px;
  }
}
```

#### Features
- **Admin Badge Display**: Mobile admin identification
- **Enhanced Mobile Navigation**: Admin-specific mobile options
- **Golden Accents**: Premium admin styling in mobile interface
- **Touch Optimization**: Mobile-friendly admin interactions

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary-blue: #1e3c72;
--secondary-blue: #2a5298;
--accent-green: #4CAF50;
--accent-red: #f44336;
--accent-gold: #FFD700;

/* Text Colors */
--text-white: #FFFFFF;
--text-dark: #1C1C1C;
--text-muted: rgba(255, 255, 255, 0.7);

/* Background Colors */
--bg-gradient: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
--bg-overlay: rgba(255, 255, 255, 0.1);
--bg-hover: rgba(255, 255, 255, 0.2);
```

### Typography
```css
/* Font Sizes */
--font-xs: 0.7rem;
--font-sm: 0.9rem;
--font-base: 1rem;
--font-lg: 1.1rem;
--font-xl: 1.2rem;

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Spacing
```css
/* Spacing Scale */
--space-xs: 0.5rem;
--space-sm: 0.75rem;
--space-md: 1rem;
--space-lg: 1.5rem;
--space-xl: 2rem;
--space-2xl: 3rem;

/* Component Spacing */
--header-padding: 1rem 2rem;
--mobile-header-padding: 1rem;
--sidebar-padding: 1.5rem;
--nav-gap: 2rem;
--button-padding: 0.5rem 1rem;
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
/* Base styles for mobile (320px+) */

/* Small tablets and large phones */
@media (min-width: 480px) {
  /* Tablet-specific styles */
}

/* Tablets and small desktops */
@media (min-width: 768px) {
  /* Desktop styles */
  .mobile-sidebar {
    display: none;
  }
  
  .desktop-nav {
    display: flex;
  }
}

/* Large desktops */
@media (min-width: 1024px) {
  /* Enhanced desktop styles */
}
```

### Responsive Features
- **Mobile-First Design**: Base styles for mobile devices
- **Progressive Enhancement**: Additional features for larger screens
- **Touch Optimization**: Mobile-friendly interactions
- **Adaptive Layouts**: Flexible layouts for different screen sizes

## 🔧 CSS Architecture

### Import Strategy
```css
/* Each component CSS file imports shared styles */
@import './shared.css';

/* Component-specific styles follow */
.component-specific-styles {
  /* Component styles */
}
```

### Naming Conventions
- **BEM Methodology**: Block__Element--Modifier
- **Component Prefixes**: Clear component identification
- **State Classes**: Active, hover, disabled states
- **Utility Classes**: Common utility styles

### CSS Organization
```css
/* 1. Imports */
@import './shared.css';

/* 2. Component-specific variables */
:root {
  --component-specific-color: #value;
}

/* 3. Base component styles */
.component {
  /* Base styles */
}

/* 4. Component states */
.component--active {
  /* Active state */
}

.component:hover {
  /* Hover state */
}

/* 5. Responsive styles */
@media (max-width: 768px) {
  .component {
    /* Mobile styles */
  }
}
```

## 🚨 Common Issues & Solutions

### 1. **CSS Conflicts**
**Issue:** Styles from different components conflicting
**Solution:** Use component-specific CSS classes and proper specificity

### 2. **Responsive Issues**
**Issue:** Layout breaks on certain screen sizes
**Solution:** Test responsive breakpoints and use mobile-first approach

### 3. **Import Problems**
**Issue:** Shared styles not loading
**Solution:** Verify import paths and file structure

### 4. **Performance Issues**
**Issue:** CSS causing rendering delays
**Solution:** Optimize CSS selectors and minimize repaints

### 5. **Browser Compatibility**
**Issue:** Styles not working in certain browsers
**Solution:** Use vendor prefixes and test across browsers

## 📚 Related Documentation

- **Main Frontend**: See `../../README.md` for overall frontend documentation
- **Header Components**: See `../../components/Header/README.md` for component implementation
- **Pages CSS**: See `../../pages_css/README.md` for page styling
- **Component CSS**: See `../README.md` for component styling overview

## 🔄 CSS Maintenance

### 1. **Regular Updates**
- Update styles for new features
- Maintain design consistency
- Update responsive breakpoints
- Refresh component documentation

### 2. **Performance Optimization**
- Monitor CSS bundle size
- Optimize selectors and rules
- Implement CSS-in-JS if needed
- Use CSS optimization tools

### 3. **Testing and Validation**
- Test across different browsers
- Validate responsive design
- Test accessibility features
- Perform cross-device testing

### 4. **Code Quality**
- Maintain consistent naming conventions
- Update CSS documentation
- Refactor complex selectors
- Implement CSS linting

## 🤝 Contributing

### Development Guidelines
- Follow established CSS architecture
- Maintain consistent naming conventions
- Use mobile-first responsive design
- Update CSS documentation

### CSS Creation
- Create styles in appropriate files
- Follow established patterns
- Use shared variables and utilities
- Add comprehensive documentation

### Code Review Process
- Submit pull requests for review
- Ensure styles work across devices
- Follow established coding standards
- Update relevant documentation
