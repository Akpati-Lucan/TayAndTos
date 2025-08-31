# Pages CSS Structure

This directory contains CSS files for all page components, organized by page type.

## File Structure

```
pages_css/
├── shared.css                    # Common styles shared across all pages
├── Home_Page.css                # Home page specific styles
├── Book_Page.css                # Booking page specific styles
├── Find_Booking_Page.css        # Find booking page specific styles
├── Login_Page.css               # Login page specific styles
├── Sign-up_Page.css             # Sign-up page specific styles
├── Forgot_Password.css          # Forgot password page specific styles
├── Reset_Password.css           # Reset password page specific styles
├── Profile_Page.css             # Profile page specific styles
├── Manage_Users.css             # Manage users page specific styles
├── Manage_Bookings.css          # Manage bookings page specific styles
├── Learn_More.css               # Learn more page specific styles
├── Booking_Success_Page.css     # Booking success page specific styles
└── README.md                    # This documentation file
```

## Shared Styles

The `shared.css` file contains common styles used across all page components:

### Layout
- `.app` - Main application container
- `.main-content` - Page content wrapper

### Forms
- `.form-group` - Form field container
- `.form-group label` - Form labels
- `.form-group input/select/textarea` - Form inputs

### Buttons
- `.btn` - Base button styles
- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary action buttons

### Messages
- `.error-message` - Error notification styling
- `.success-message` - Success notification styling

### Loading
- `.loading-container` - Loading state wrapper
- `.loading-spinner` - Animated loading spinner

### Responsive Design
- Mobile-first approach
- Breakpoint at 768px for tablets and mobile

## Usage

Each page component imports its specific CSS file:

```javascript
// In Home_Page.jsx
import '../pages_css/Home_Page.css';

// In Book_Page.jsx
import '../pages_css/Book_Page.css';
```

## Benefits

1. **Consistency**: Shared styles ensure consistent UI across pages
2. **Maintainability**: Common styles are centralized
3. **Efficiency**: Reduces CSS duplication
4. **Scalability**: Easy to add new pages with consistent styling
5. **Organization**: Clear separation of page-specific and shared styles

## CSS Organization

### Page-Specific Styles
Each page CSS file should contain:
- Layout specific to that page
- Unique component styles
- Page-specific animations
- Custom color schemes (if different from shared)

### Shared Styles
The shared CSS file contains:
- Common layout patterns
- Standard form styling
- Button variations
- Message notifications
- Loading states
- Responsive utilities

## Responsive Design

- **Desktop**: 769px and above
- **Tablet**: 768px and below
- **Mobile**: 480px and below

## Best Practices

1. **Import shared.css first** in page-specific CSS files
2. **Use consistent naming** for CSS classes
3. **Follow mobile-first** responsive design
4. **Maintain consistent spacing** using shared variables
5. **Test across different screen sizes** regularly
