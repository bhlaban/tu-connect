# TU Connect - UI Overview

## Application Screenshots

This document describes the user interface of the TU Connect application.

## Login Page

**Route:** `/login`

The login page features:
- Clean, centered design with gradient background (purple to blue)
- White card with shadow effect
- "TU Connect" branding at the top
- Email and password input fields
- Login button
- Link to registration page for new users

**Color Scheme:**
- Primary gradient: #667eea to #764ba2
- White content areas
- Purple accent color for buttons and links

---

## Registration Page

**Route:** `/register`

The registration page includes:
- Similar design to login page for consistency
- Input fields for:
  - First Name
  - Last Name
  - Email
  - Password (minimum 6 characters)
- Register button
- Link back to login page for existing users
- Client-side validation for password length
- Error messages displayed prominently when registration fails

---

## Experiences List (Main Dashboard)

**Route:** `/experiences`

The main dashboard features:

**Header:**
- Gradient background matching the brand
- "TU Connect - My Stream Experiences" title
- User greeting: "Welcome, [First Name] [Last Name]"
- Logout button

**Content Area:**
- Light gray background (#f5f7fa)
- "Log New Experience" button (purple, top right)
- Grid layout of experience cards (responsive)

**Experience Cards:**
Each card displays:
- Stream name (large, purple text)
- Location (📍 icon)
- Date (📅 icon)
- Weather conditions (🌤️ icon, if provided)
- Water condition (💧 icon, if provided)
- Fish caught count (🎣 icon, if > 0)
- Species (🐟 icon, if provided)
- Notes (italic text, if provided)
- Edit button (purple)
- Delete button (red)

**Empty State:**
When no experiences are logged:
- Centered message: "No stream experiences logged yet."
- Encouragement: "Click 'Log New Experience' to get started!"

**Responsive Design:**
- Desktop: Multiple columns (3-4 cards per row)
- Tablet: 2 columns
- Mobile: Single column, stacked cards

---

## Experience Form (New/Edit)

**Routes:** `/experiences/new` or `/experiences/edit/:id`

The experience form includes:

**Header:**
- Title: "Log New Stream Experience" or "Edit Stream Experience"
- Back to List button (purple, left side)

**Form Fields:**

1. **Stream Name*** (required)
   - Text input
   
2. **Location*** (required)
   - Text input
   - Placeholder: "e.g., Rocky Mountain National Park, CO"

3. **Date*** (required)
   - Date picker
   - Default: Today's date (for new entries)

4. **Weather Conditions** (optional)
   - Dropdown select
   - Options: Sunny, Partly Cloudy, Cloudy, Rainy, Stormy, Foggy

5. **Water Condition** (optional)
   - Dropdown select
   - Options: Clear, Slightly Murky, Murky, High Flow, Low Flow, Normal Flow

6. **Number of Fish Caught** (optional)
   - Number input (minimum 0)
   - Default: 0.

7. **Fish Species** (optional)
   - Text input
   - Placeholder: "e.g., Rainbow Trout, Brown Trout"

8. **Notes** (optional)
   - Large text area (5 rows)
   - Placeholder: "Any additional notes about your experience..."

**Form Actions:**
- Cancel button (gray) - returns to list
- "Log Experience" or "Update Experience" button (purple)
- Loading state shows "Saving..." when submitting

**Validation:**
- Required fields marked with asterisk (*)
- Client-side validation before submission
- Error messages displayed at top if submission fails

---

## Design Principles

### Color Palette
- **Primary:** #667eea (purple-blue)
- **Secondary:** #764ba2 (purple)
- **Background:** #f5f7fa (light gray)
- **Text:** #333 (dark gray) and #666 (medium gray)
- **Error:** #dc3545 (red)
- **Success:** #667eea (primary color)

### Typography
- Font Family: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', etc.)
- Smooth antialiasing for better readability

### Interactive Elements
- Buttons change opacity on hover (0.8)
- Cards lift slightly on hover (translateY(-5px))
- Form inputs highlight border on focus (purple)
- Disabled states use gray color and "not-allowed" cursor

### Spacing
- Consistent padding: 12px, 20px, 24px, 40px
- Card margins: 20px between cards
- Form field margins: 20-24px between fields

### Responsive Design
- Mobile-first approach
- Breakpoint at 768px for tablet/mobile
- Flexbox and CSS Grid for layouts
- Stacks vertically on mobile

---

## User Experience Flow

### New User Journey:
1. Lands on login page (or redirects to login if accessing protected route)
2. Clicks "Register here" link
3. Fills out registration form (first name, last name, email, password)
4. Automatically logged in after successful registration
5. Redirected to empty experiences list
6. Clicks "Log New Experience" to create first entry
7. Fills out form and submits
8. Returns to list to see their logged experience

### Returning User Journey:
1. Lands on login page
2. Enters email and password
3. Redirected to experiences list showing all their logged trips
4. Can view, edit, or delete existing experiences
5. Can add new experiences at any time
6. Logs out when done

### Authentication Flow:
- Unauthenticated users are redirected to login page
- JWT token stored in localStorage
- Token sent with all API requests via Authorization header
- User can remain logged in across browser sessions
- Logout clears token and returns to login page

---

## Accessibility Features

- Semantic HTML elements
- Clear labels for all form inputs
- Proper heading hierarchy (h1, h2, h3)
- Sufficient color contrast for text
- Focus indicators on interactive elements
- Responsive design works on all screen sizes
- Error messages clearly communicated

---

## Browser Compatibility

The application is built with modern web standards and works on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Future Enhancement Ideas

Potential features for future versions:
- Photo upload for each experience
- Map integration to show stream locations
- Weather integration (auto-populate weather data)
- Social features (share experiences with other members)
- Statistics and analytics (most caught species, favorite locations)
- Export experiences to PDF or CSV
- Mobile app versions (iOS/Android)
- Offline support (Progressive Web App)
