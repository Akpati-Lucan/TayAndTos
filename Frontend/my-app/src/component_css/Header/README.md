# Header CSS Modules

This directory contains modular CSS files for the header components, organized by user type and device size.

## File Structure

```
Header/
├── shared.css           # Common styles shared across all header components
├── guest_desktop.css    # Guest user desktop header styles
├── guest_mobile.css     # Guest user mobile header styles
├── user_desktop.css     # Authenticated user desktop header styles
├── user_mobile.css      # Authenticated user mobile header styles
├── admin_desktop.css    # Admin user desktop header styles
├── admin_mobile.css     # Admin user mobile header styles
└── README.md            # This documentation file
```

## Component-Specific Styles

### Guest Components
- **guest_desktop.css**: Clean navigation with login/signup buttons
- **guest_mobile.css**: Hamburger menu with sidebar navigation

### User Components
- **user_desktop.css**: User profile link and logout button
- **user_mobile.css**: Sidebar with user profile section and logout

### Admin Components
- **admin_desktop.css**: Additional admin links (Manage Bookings, Manage Users)
- **admin_mobile.css**: Admin-specific sidebar with admin badge

## Shared Styles

The `shared.css` file contains common styles used across all header components:
- Base header structure
- Logo styles
- Navigation styles
- Responsive breakpoints

## Usage

Each header component imports its specific CSS file:

```javascript
// In guest_desktop.jsx
import '../../component_css/Header/guest_desktop.css';

// In user_mobile.jsx
import '../../component_css/Header/user_mobile.css';
```

## Benefits

1. **Modularity**: Each component has its own CSS file
2. **Maintainability**: Easy to modify specific component styles
3. **Reusability**: Shared styles prevent duplication
4. **Organization**: Clear separation of concerns
5. **Scalability**: Easy to add new header variants

## Responsive Design

- **Desktop**: 769px and above
- **Mobile**: 768px and below
- **Small Mobile**: 480px and below

## CSS Import Structure

Each CSS file imports the shared styles and adds component-specific styles:

```css
/* Component-specific styles */
@import './shared.css';

/* Additional component-specific styles */
.auth-buttons { ... }
.mobile-sidebar { ... }
.admin-badge { ... }
```
