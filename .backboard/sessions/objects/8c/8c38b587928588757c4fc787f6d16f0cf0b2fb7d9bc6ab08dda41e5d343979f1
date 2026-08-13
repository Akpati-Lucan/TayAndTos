# Pages Documentation

This directory contains all the page components for the TayAndTos frontend application. Each page is a standalone React component that provides specific functionality and user interface for different parts of the application.

## 🏗️ Pages Overview

The pages system provides:
- **User Authentication**: Login, signup, password management pages
- **Booking Management**: Create, view, and manage hotel bookings
- **User Management**: Profile management and admin user oversight
- **Information Pages**: Home page and informational content
- **Responsive Design**: Mobile-first responsive page layouts
- **State Management**: Local state and backend integration
- **Form Handling**: Comprehensive form validation and submission
- **Error Handling**: User-friendly error messages and feedback

## 📁 Page Files

### Authentication Pages
- **`Login_Page.jsx`** - User login and authentication
- **`Sign-up_Page.jsx`** - User registration and account creation
- **`Forgot_Password.jsx`** - Password recovery functionality
- **`Reset_Password.jsx`** - Password reset and update

### Booking Pages
- **`Book_Page.jsx`** - Create new hotel bookings
- **`Find_Booking_Page.jsx`** - View and manage existing bookings
- **`Booking_Success_Page.jsx`** - Booking confirmation and success

### Management Pages
- **`Profile_Page.jsx`** - User profile management and editing
- **`Manage_Users.jsx`** - Admin user management (admin only)
- **`Manage_Bookings.jsx`** - Admin booking oversight (admin only)

### Information Pages
- **`Home_Page.jsx`** - Main landing page and introduction
- **`Learn_More.jsx`** - Detailed information about services

## 🔐 Authentication Pages

### Login Page (`Login_Page.jsx`)

#### Purpose
Provides user authentication and login functionality.

#### Features
- **Email/Password Login**: Secure user authentication
- **Form Validation**: Client-side input validation
- **Error Handling**: User-friendly error messages
- **Password Recovery**: Link to forgot password page
- **Registration Link**: Direct access to signup page
- **Responsive Design**: Mobile-optimized interface

#### Implementation
```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import backendService from '../backend_services';
import './Login_Page.css';

function Login_Page() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResendForm, setShowResendForm] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await backendService.login(formData.email, formData.password);
      if (result.success) {
        navigate('/profile');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="login-container">
          <h1>Login to Your Account</h1>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="login-links">
            <a href="/forgot-password">Forgot Password?</a>
            <a href="/signup">Don't have an account? Sign up</a>
          </div>
        </div>
      </main>
    </div>
  );
}
```

#### State Management
- **`formData`**: Form input values (email, password)
- **`loading`**: Loading state during form submission
- **`error`**: Error message display
- **`showResendForm`**: Toggle for email confirmation resend

#### Key Functions
- **`handleSubmit`**: Form submission and authentication
- **`handleInputChange`**: Form input value updates
- **`handleResendConfirmation`**: Email confirmation resend

### Sign-up Page (`Sign-up_Page.jsx`)

#### Purpose
Handles user registration and account creation.

#### Features
- **Complete Registration Form**: All required user information
- **Email Confirmation**: Email verification system
- **Form Validation**: Comprehensive input validation
- **Password Strength**: Password requirements and validation
- **Confirmation Message**: Success feedback and next steps
- **Resend Option**: Email confirmation resend functionality

#### Form Fields
- First Name
- Last Name
- Email Address
- Phone Number
- Password
- Password Confirmation

#### Implementation
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const result = await backendService.signup(formData);
    if (result.success) {
      setShowConfirmation(true);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        confirm_password: ''
      });
    }
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### Forgot Password Page (`Forgot_Password.jsx`)

#### Purpose
Provides password recovery functionality for users.

#### Features
- **Email Input**: Simple email-based password recovery
- **Form Validation**: Email format validation
- **Success Feedback**: Confirmation message after submission
- **Back to Login**: Direct navigation to login page

### Reset Password Page (`Reset_Password.jsx`)

#### Purpose
Allows users to set new passwords after recovery.

#### Features
- **Password Reset Form**: New password and confirmation
- **Token Validation**: Secure password reset tokens
- **Password Requirements**: Strength validation
- **Success Feedback**: Confirmation and login redirect

## 📅 Booking Pages

### Book Page (`Book_Page.jsx`)

#### Purpose
Allows users to create new hotel bookings.

#### Features
- **Room Selection**: Choose from available room types
- **Date Picking**: Check-in and check-out date selection
- **Guest Information**: Number of guests and special requirements
- **Form Validation**: Comprehensive booking validation
- **Real-time Updates**: Dynamic form updates and calculations
- **Success Handling**: Booking confirmation and next steps

#### Room Types
- **Standard Room**: Basic accommodation
- **Deluxe Room**: Enhanced amenities
- **Suite**: Premium luxury accommodation

#### Implementation
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const bookingData = {
      room: formData.room,
      check_in_date: formData.checkInDate,
      check_out_date: formData.checkOutDate,
      number_of_guests: formData.numberOfGuests,
      special_requests: formData.specialRequests
    };

    const result = await backendService.createBooking(bookingData);
    if (result.success) {
      navigate('/booking-success', { 
        state: { booking: result.booking } 
      });
    }
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

#### Form Validation
- **Date Validation**: Check-in must be in the future
- **Duration Validation**: Check-out must be after check-in
- **Guest Validation**: Guest count within room limits
- **Required Fields**: All essential information must be provided

### Find Booking Page (`Find_Booking_Page.jsx`)

#### Purpose
Allows users to view, update, and cancel existing bookings.

#### Features
- **Booking Search**: Find bookings by confirmation code
- **Booking Display**: Complete booking information
- **Update Functionality**: Modify booking details
- **Cancellation**: Cancel bookings with confirmation
- **Guest Bookings**: Support for guest booking management
- **Responsive Design**: Mobile-optimized interface

#### User Types
- **Authenticated Users**: Full booking management
- **Guest Users**: Limited access with guest tokens

#### Implementation
```javascript
const handleGuestBookingUpdate = async () => {
  try {
    setLoading(true);
    setError('');

    const updateData = {
      check_in_date: formData.checkInDate,
      check_out_date: formData.checkOutDate,
      number_of_guests: formData.numberOfGuests,
      special_requests: formData.specialRequests
    };

    const result = await backendService.makeGuestPut(
      `/guest-bookings/${booking.id}`,
      updateData
    );

    if (result.success) {
      setSuccessMessage('Booking updated successfully!');
      setBooking(result.booking);
    }
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### Booking Success Page (`Booking_Success_Page.jsx`)

#### Purpose
Displays booking confirmation and success information.

#### Features
- **Confirmation Details**: Complete booking information
- **Next Steps**: Instructions for what happens next
- **Navigation Options**: Links to other pages
- **Print Option**: Printable booking confirmation

## 👤 Management Pages

### Profile Page (`Profile_Page.jsx`)

#### Purpose
Allows users to view and edit their profile information.

#### Features
- **Profile Display**: Current user information
- **Profile Editing**: Update personal details
- **Password Change**: Secure password modification
- **Form Validation**: Input validation and sanitization
- **Success Feedback**: Update confirmation messages

#### Editable Fields
- First Name
- Last Name
- Email Address
- Phone Number
- Profile Picture (future feature)

#### Implementation
```javascript
const handleProfileUpdate = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const updateData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone_number: formData.phone_number
    };

    const result = await backendService.updateUserProfile(updateData);
    if (result.success) {
      setSuccessMessage('Profile updated successfully!');
      setUser(result.user);
      setFormData({
        first_name: result.user.first_name,
        last_name: result.user.last_name,
        phone_number: result.user.phone_number
      });
    }
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### Manage Users Page (`Manage_Users.jsx`)

#### Purpose
Provides admin functionality to manage all system users.

#### Features
- **User List**: Display all registered users
- **User Details**: View complete user information
- **User Editing**: Modify user profiles and settings
- **User Deletion**: Remove users from the system
- **Admin Controls**: Role management and privileges
- **Search and Filter**: Find specific users quickly

#### Admin Functions
- View all users
- Edit user information
- Change user roles
- Deactivate/activate users
- Delete user accounts
- Monitor user activity

#### Implementation
```javascript
const fetchUsers = async () => {
  try {
    setLoading(true);
    setError('');

    const users = await backendService.makeAuthenticatedGet('/users');
    setUsers(users);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

const handleUserUpdate = async (userId, updateData) => {
  try {
    setLoading(true);
    setError('');

    const result = await backendService.updateUser(userId, updateData);
    if (result.success) {
      setSuccessMessage('User updated successfully!');
      fetchUsers(); // Refresh user list
    }
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### Manage Bookings Page (`Manage_Bookings.jsx`)

#### Purpose
Provides admin oversight of all system bookings.

#### Features
- **Booking Overview**: Complete booking information
- **Status Management**: Update booking statuses
- **User Information**: Associated user details
- **Filtering Options**: Search and filter bookings
- **Bulk Operations**: Multiple booking management
- **Export Functionality**: Data export capabilities

#### Admin Functions
- View all bookings
- Update booking status
- Modify booking details
- Cancel bookings
- Monitor booking patterns
- Generate reports

## 🏠 Information Pages

### Home Page (`Home_Page.jsx`)

#### Purpose
Main landing page and introduction to TayAndTos services.

#### Features
- **Hero Section**: Welcome message and call-to-action
- **Service Highlights**: Key features and benefits
- **Statistics**: Impressive numbers and achievements
- **Call-to-Action**: Direct booking access
- **Responsive Design**: Mobile-optimized layout

#### Content Sections
- Welcome message
- Service overview
- Key statistics
- Booking button
- Company information

### Learn More Page (`Learn_More.jsx`)

#### Purpose
Provides detailed information about TayAndTos services and amenities.

#### Features
- **Service Details**: Comprehensive service descriptions
- **Amenity List**: Available facilities and features
- **Testimonials**: Customer reviews and feedback
- **Image Gallery**: Visual representation of services
- **Contact Information**: How to get in touch

## 🎨 Page Styling

### CSS Organization
Each page has its own CSS file for specific styling:

- **`shared.css`**: Common page styles and utilities
- **Individual page CSS**: Page-specific styling and layouts
- **Responsive Design**: Mobile-first responsive layouts
- **Component Integration**: Consistent styling with components

### Styling Principles
- **Consistent Design**: Unified color scheme and typography
- **Responsive Layout**: Mobile-first responsive design
- **Accessibility**: High contrast and readable fonts
- **User Experience**: Intuitive layouts and interactions

## 🔄 Page Lifecycle

### 1. **Mounting**
- Component initialization
- Data fetching and API calls
- State setup and form initialization
- Event listener registration

### 2. **Updating**
- Props and state changes
- Form input handling
- API response processing
- Error and success state management

### 3. **Unmounting**
- Cleanup and memory management
- Event listener removal
- State cleanup and reset

## 🧪 Page Testing

### Testing Strategy
```javascript
// Test page rendering
describe('Login Page', () => {
  test('renders login form', () => {
    render(<Login_Page />);
    expect(screen.getByText('Login to Your Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    render(<Login_Page />);
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByText('Login'));
    
    // Test form submission logic
  });
});
```

### Testing Tools
- **Jest**: JavaScript testing framework
- **React Testing Library**: Component testing utilities
- **Mock Service Worker**: API mocking for testing
- **User Event**: User interaction simulation

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Responsive Features
- **Mobile Navigation**: Touch-optimized interfaces
- **Adaptive Layouts**: Flexible layouts for different screen sizes
- **Touch Interactions**: Mobile-friendly buttons and forms
- **Performance**: Optimized rendering for mobile devices

## 🔒 Security Features

### Authentication
- **Route Protection**: Protected routes for authenticated users
- **Admin Access**: Role-based access control
- **Token Validation**: JWT token verification
- **Session Management**: Secure user sessions

### Data Security
- **Input Validation**: Client-side and server-side validation
- **XSS Prevention**: Sanitized content rendering
- **CSRF Protection**: Token-based request validation
- **Secure Storage**: Encrypted sensitive data storage

## 🚨 Common Issues & Solutions

### 1. **Form Submission Errors**
**Issue:** Forms fail to submit or return errors
**Solution:** Check form validation, API endpoints, and error handling

### 2. **Authentication Problems**
**Issue:** Users can't access protected pages
**Solution:** Verify authentication state, token storage, and route protection

### 3. **Responsive Design Issues**
**Issue:** Layout breaks on certain screen sizes
**Solution:** Test responsive breakpoints and CSS media queries

### 4. **State Management Problems**
**Issue:** Page state not updating correctly
**Solution:** Check useState and useEffect implementations

### 5. **API Integration Issues**
**Issue:** Backend calls fail or return errors
**Solution:** Verify API endpoints, authentication, and error handling

## 📚 Related Documentation

- **Main Frontend**: See `../README.md` for overall frontend documentation
- **Backend Services**: See `../backend_services/README.md` for API integration
- **Components**: See `../components/README.md` for reusable components
- **CSS Styling**: See `../pages_css/README.md` for page styling

## 🔄 Page Maintenance

### 1. **Regular Updates**
- Update page logic for new features
- Maintain backward compatibility
- Update styling for design changes
- Refresh page documentation

### 2. **Performance Optimization**
- Monitor page loading performance
- Optimize API calls and data fetching
- Implement lazy loading for heavy content
- Clean up memory leaks and event listeners

### 3. **Testing and Validation**
- Test page functionality
- Validate responsive design
- Test accessibility features
- Perform cross-browser testing

### 4. **Code Quality**
- Maintain consistent coding standards
- Update page documentation
- Refactor complex logic
- Implement error boundaries

## 🤝 Contributing

### Development Guidelines
- Follow React best practices and hooks patterns
- Maintain consistent page structure
- Write comprehensive tests for new pages
- Update page documentation

### Page Creation
- Create new pages in the pages directory
- Follow established naming conventions
- Implement proper state management
- Add comprehensive styling

### Code Review Process
- Submit pull requests for review
- Ensure all tests pass
- Follow established coding standards
- Update relevant documentation
