# Frontend Documentation

This directory contains the React-based frontend application for the TayAndTos hotel booking system. The frontend provides a modern, responsive user interface for users to manage bookings, authenticate, and interact with the hotel services.

## 🏗️ Frontend Overview

The frontend system provides:
- **User Authentication**: Login, signup, password reset, and profile management
- **Booking Management**: Create, view, update, and cancel hotel bookings
- **Guest Services**: Guest booking functionality without account creation
- **Admin Panel**: User and booking management for administrators
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Modern UI/UX**: Clean, intuitive interface with smooth interactions
- **State Management**: React hooks for local state and backend integration
- **Modular Architecture**: Component-based structure with reusable modules

## 📁 Project Structure

```
Frontend/
├── my-app/                    # React application root
│   ├── public/               # Static assets and HTML template
│   ├── src/                  # Source code
│   │   ├── components/       # Reusable React components
│   │   │   ├── Header/       # Modular header components
│   │   │   └── Footer.jsx    # Footer component
│   │   ├── pages/            # Page components (routes)
│   │   ├── backend_services/ # Backend API integration services
│   │   ├── component_css/    # Component-specific stylesheets
│   │   ├── pages_css/        # Page-specific stylesheets
│   │   ├── images/           # Image assets
│   │   ├── videos/           # Video assets
│   │   ├── App.js            # Main application component
│   │   ├── App.css           # Main application styles
│   │   └── index.js          # Application entry point
│   ├── package.json          # Dependencies and scripts
│   └── README.md             # Project-specific documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Backend server running on localhost:8080

### Installation
```bash
cd Frontend/my-app
npm install
```

### Environment Setup
Create a `.env` file in the `Frontend/my-app` directory:
```env
REACT_APP_BACKEND_URL=/api
REACT_APP_ENVIRONMENT=development
```

### Development Server
```bash
npm start
```
The application will open at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## 🎯 Core Features

### 1. **User Authentication System**
- **User Registration**: Complete signup process with email confirmation
- **User Login**: Secure authentication with JWT tokens
- **Password Management**: Forgot password and reset functionality
- **Profile Management**: User profile viewing and editing
- **Session Management**: Automatic token refresh and logout

### 2. **Booking Management**
- **Create Bookings**: Room selection, date picking, and guest information
- **View Bookings**: List all user bookings with filtering options
- **Update Bookings**: Modify existing booking details
- **Cancel Bookings**: Cancel bookings with confirmation
- **Booking History**: Track past and upcoming bookings

### 3. **Guest Services**
- **Guest Bookings**: Create bookings without account creation
- **Guest Token System**: Secure access to guest booking management
- **Guest Booking Updates**: Modify guest bookings using tokens
- **Guest Booking Cancellation**: Cancel guest bookings

### 4. **Admin Panel**
- **User Management**: View, edit, and manage all users
- **Booking Oversight**: Monitor and manage all system bookings
- **Admin Dashboard**: Overview of system statistics
- **Role-based Access**: Secure admin-only functionality

### 5. **Responsive Design**
- **Mobile-First**: Optimized for mobile devices
- **Desktop Experience**: Enhanced desktop interface
- **Cross-Platform**: Works on all modern browsers
- **Touch-Friendly**: Optimized for touch interactions

## 🧩 Component Architecture

### **Header Component System**
The header is modularized into different components based on user type and device size:

- **`Header.jsx`**: Main header component with conditional rendering
- **`guest_desktop.jsx`**: Desktop header for guest users
- **`guest_mobile.jsx`**: Mobile header for guest users
- **`user_desktop.jsx`**: Desktop header for authenticated users
- **`user_mobile.jsx`**: Mobile header for authenticated users
- **`admin_desktop.jsx`**: Desktop header for admin users
- **`admin_mobile.jsx`**: Mobile header for admin users

### **Page Components**
Each page is a standalone React component with its own functionality:

- **Authentication Pages**: Login, Signup, Password Reset
- **Booking Pages**: Book, Find Booking, Booking Success
- **Management Pages**: Profile, Manage Users, Manage Bookings
- **Information Pages**: Home, Learn More

### **Service Layer**
Modular backend services for API integration:

- **`auth_service.js`**: Authentication and user management
- **`booking_service.js`**: Booking operations and management
- **`user_service.js`**: User profile and management
- **`email_service.js`**: Email-related operations
- **`health_service.js`**: Backend health monitoring
- **`request_service.js`**: Base HTTP request handling
- **`config.js`**: Configuration and constants

## 🎨 Styling Architecture

### **CSS Organization**
The styling system is organized into logical modules:

- **`component_css/`**: Component-specific styles
  - **`Header/`**: Modular header styles with shared base
  - **`Footer.css`**: Footer component styles
- **`pages_css/`**: Page-specific styles
  - **`shared.css`**: Common page styles and utilities
  - **Individual page CSS**: Specific styling for each page

### **Design Principles**
- **Consistent Spacing**: Standardized margins, padding, and gaps
- **Color Scheme**: Unified color palette throughout the application
- **Typography**: Consistent font families and sizing
- **Responsive Breakpoints**: Mobile-first responsive design
- **Component Reusability**: Shared styles for common elements

## 🔌 Backend Integration

### **API Communication**
The frontend communicates with the backend through:

- **RESTful APIs**: Standard HTTP methods (GET, POST, PUT, DELETE)
- **JWT Authentication**: Secure token-based authentication
- **Guest Tokens**: Special tokens for guest booking management
- **Error Handling**: Comprehensive error handling and user feedback

### **Service Methods**
Key service methods include:

- **Authentication**: `login()`, `signup()`, `logout()`, `isAuthenticated()`
- **Bookings**: `createBooking()`, `getBookings()`, `updateBooking()`, `cancelBooking()`
- **Users**: `getUserProfile()`, `updateProfile()`, `getAllUsers()`
- **Guest Operations**: `makeGuestPut()`, `makeGuestDelete()`

## 📱 Responsive Design

### **Breakpoints**
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### **Mobile Features**
- **Hamburger Menu**: Collapsible navigation for mobile
- **Touch Optimization**: Touch-friendly buttons and interactions
- **Responsive Forms**: Optimized form layouts for small screens
- **Mobile Navigation**: Simplified navigation for mobile users

### **Desktop Features**
- **Full Navigation**: Complete navigation menu always visible
- **Enhanced Layouts**: Optimized spacing and layouts for larger screens
- **Hover Effects**: Interactive hover states for desktop users
- **Multi-column Layouts**: Efficient use of screen real estate

## 🔐 Security Features

### **Authentication Security**
- **JWT Tokens**: Secure token-based authentication
- **Token Storage**: Secure localStorage and sessionStorage usage
- **Automatic Logout**: Token expiration handling
- **Protected Routes**: Route protection based on authentication status

### **Data Security**
- **Input Validation**: Client-side validation for all forms
- **XSS Prevention**: Sanitized input handling
- **CSRF Protection**: Token-based request validation
- **Secure Storage**: Encrypted sensitive data storage

## 📊 State Management

### **Local State**
- **React Hooks**: useState and useEffect for component state
- **Form State**: Controlled components for form inputs
- **UI State**: Loading states, error states, success messages
- **Navigation State**: Sidebar, mobile menu, and navigation state

### **Global State**
- **User Context**: User authentication and profile information
- **Theme Context**: Application theme and styling preferences
- **Notification Context**: Global notification system
- **Loading Context**: Global loading state management

## 🧪 Testing

### **Testing Strategy**
- **Unit Testing**: Individual component testing
- **Integration Testing**: Component interaction testing
- **User Testing**: User experience and usability testing
- **Cross-browser Testing**: Browser compatibility testing

### **Testing Tools**
- **Jest**: JavaScript testing framework
- **React Testing Library**: Component testing utilities
- **Cypress**: End-to-end testing framework
- **Storybook**: Component development and testing

## 🚀 Performance Optimization

### **Code Splitting**
- **Route-based Splitting**: Lazy loading of page components
- **Component Splitting**: Dynamic imports for heavy components
- **Bundle Optimization**: Optimized bundle sizes

### **Performance Features**
- **Image Optimization**: Compressed and optimized images
- **CSS Optimization**: Minified and optimized stylesheets
- **Lazy Loading**: Deferred loading of non-critical resources
- **Caching**: Browser caching and local storage optimization

## 🔧 Development Features

### **Development Tools**
- **Hot Reloading**: Instant updates during development
- **Error Boundaries**: Graceful error handling
- **Debug Logging**: Comprehensive logging for development
- **Development Server**: Local development with hot reload

### **Code Quality**
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting and consistency
- **TypeScript**: Type safety and development experience
- **Git Hooks**: Pre-commit and pre-push validation

## 📱 Browser Support

### **Supported Browsers**
- **Chrome**: Version 80+
- **Firefox**: Version 75+
- **Safari**: Version 13+
- **Edge**: Version 80+

### **Mobile Support**
- **iOS Safari**: Version 13+
- **Chrome Mobile**: Version 80+
- **Samsung Internet**: Version 12+

## 🚨 Common Issues & Solutions

### 1. **Build Errors**
**Issue:** Build failures during production build
**Solution:** Check for syntax errors, missing dependencies, and environment variables

### 2. **API Connection Issues**
**Issue:** Frontend can't connect to backend
**Solution:** Verify backend server is running and CORS is configured

### 3. **Authentication Problems**
**Issue:** Users can't log in or stay logged in
**Solution:** Check JWT token storage and backend authentication

### 4. **Responsive Design Issues**
**Issue:** Layout breaks on certain screen sizes
**Solution:** Test responsive breakpoints and CSS media queries

### 5. **Performance Issues**
**Issue:** Slow loading or sluggish interactions
**Solution:** Optimize images, implement lazy loading, and check bundle size

## 📚 Related Documentation

- **Backend**: See `../Backend/README.md` for backend API documentation
- **Component CSS**: See `src/component_css/README.md` for component styling
- **Pages CSS**: See `src/pages_css/README.md` for page styling
- **Header Components**: See `src/components/Header/README.md` for header system

## 🔄 Development Workflow

### 1. **Setup**
- Clone repository and install dependencies
- Configure environment variables
- Start backend server

### 2. **Development**
- Start development server with `npm start`
- Make changes to components and styles
- Test functionality in browser

### 3. **Testing**
- Run unit tests with `npm test`
- Perform manual testing across devices
- Test user flows and edge cases

### 4. **Build & Deploy**
- Build production version with `npm run build`
- Test production build locally
- Deploy to hosting platform

## 🤝 Contributing

### **Development Guidelines**
- Follow React best practices and hooks patterns
- Maintain consistent code style and formatting
- Write comprehensive tests for new features
- Update documentation for API changes

### **Code Review Process**
- Submit pull requests for review
- Ensure all tests pass
- Follow established coding standards
- Update relevant documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For technical support or questions:
- **Documentation**: Check this README and related documentation
- **Issues**: Report bugs and issues through the issue tracker
- **Development**: Contact the development team for technical questions

## 📈 Version History

### **v1.0.0** - Initial Release
- Complete user authentication system
- Booking management functionality
- Guest booking services
- Admin panel and user management
- Responsive design implementation
- Modular component architecture
- Comprehensive backend integration
