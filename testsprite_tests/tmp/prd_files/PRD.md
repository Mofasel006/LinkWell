# LinkWell - Product Requirements Document

## Product Overview

**LinkWell** is an AI-powered document writing platform that helps users create high-quality content by referencing their own knowledge and collaborating with AI in real-time.

**Target Users**: Writers, researchers, content creators, and professionals who need to produce long-form content with AI assistance.

**Primary Goal**: Enable users to write smarter by combining their own reference materials with AI-powered suggestions.

---

## Core Features

### 1. User Authentication
- **Sign Up**: Users can create an account with email and password
- **Log In**: Existing users can log in with email and password
- **Sign Out**: Users can log out from the dashboard
- **Password Requirements**: Minimum 8 characters

### 2. Subscription Management (Polar Integration)
- **Pricing**: $9/month subscription
- **Free Trial**: 7-day free trial
- **Payment Modal**: Appears for new users without active subscription
- **Upgrade Button**: Visible in header for non-subscribed users
- **Subscription Statuses**: active, inactive, trialing, canceled, past_due

### 3. Dashboard
- **Document List**: View all user's documents
- **Create Document**: Button to create new documents
- **Delete Document**: Option to delete existing documents
- **Document Preview**: Shows title, last edited date, and status (Draft/Saved)
- **Empty State**: Friendly message when no documents exist

### 4. Document Editor
- **Rich Text Editing**: Full formatting support via Tiptap editor
  - Bold, Italic, Underline, Strikethrough
  - Headings (H1, H2, H3)
  - Bullet Lists, Numbered Lists
  - Blockquotes
  - Links
  - Undo/Redo
- **Auto-save**: Documents save automatically
- **Title Editing**: Editable document title in header
- **Save Status**: Shows "Unsaved changes" or "Saved" indicator

### 5. Knowledge Panel (Left Sidebar)
- **Add Knowledge**: Button to add reference materials
- **Knowledge Items**: Display added references with labels
- **Delete Knowledge**: Remove unwanted references
- **Empty State**: Prompt to add first reference
- **Purpose**: Provides context for AI to generate more relevant suggestions

### 6. AI Assistant Panel (Right Sidebar)
- **Quick Actions**:
  - Continue: AI continues writing from current position
  - Improve: AI improves selected or recent text
  - Expand: AI expands on the current content
  - Summarize: AI summarizes the content
- **Chat Input**: Free-form text input to ask AI for help
- **Context Awareness**: AI uses knowledge references for grounded responses
- **Powered by**: OpenAI GPT-4o-mini

---

## User Flows

### Flow 1: New User Registration
1. User visits landing page (/)
2. Clicks "Get Started" or "Sign Up"
3. Fills in email, password, and confirm password
4. Clicks "Create Account"
5. Redirected to dashboard
6. Payment modal appears (subscription required)

### Flow 2: User Login
1. User visits login page (/login)
2. Enters email and password
3. Clicks "Log In"
4. Redirected to dashboard
5. If no active subscription, payment modal appears

### Flow 3: Create and Edit Document
1. User clicks "New Document" or "Create Document"
2. Redirected to editor page
3. Can edit title in header
4. Types content in editor area
5. Uses toolbar for formatting
6. Content auto-saves

### Flow 4: Add Knowledge Reference
1. In editor, user clicks "Add knowledge" or "Add your first reference"
2. Modal or form appears to add label and content
3. Reference appears in knowledge panel
4. AI can now use this reference for context

### Flow 5: Use AI Assistant
1. User selects text or positions cursor
2. Clicks quick action (Continue/Improve/Expand/Summarize)
3. OR types custom prompt in chat input
4. AI generates response using document content and knowledge
5. Response is inserted or displayed

### Flow 6: Start Subscription
1. Payment modal appears for non-subscribed users
2. User reviews features and pricing ($9/month)
3. Clicks "Start Free Trial"
4. Polar checkout popup opens
5. User completes payment
6. Subscription activated, modal closes

---

## Technical Requirements

### Frontend
- React 18 with TypeScript
- Vite build tool
- React Router for navigation
- Tailwind CSS for styling
- Tiptap for rich text editor
- Lucide React for icons

### Backend
- Convex for real-time database
- Convex Auth for authentication
- OpenAI API for AI features
- Polar for payment processing

### Data Models
- **Users**: Authentication data (managed by Convex Auth)
- **Documents**: userId, title, content, status, timestamps
- **Knowledge**: documentId, userId, label, content, timestamps
- **Subscriptions**: userId, email, polarCustomerId, polarSubscriptionId, status, currentPeriodEnd, timestamps

---

## Acceptance Criteria

### Authentication
- [ ] User can sign up with valid email and password (8+ chars)
- [ ] User sees error for invalid credentials on login
- [ ] User can sign out from dashboard
- [ ] Protected routes redirect to login if not authenticated

### Dashboard
- [ ] Empty state shows when no documents exist
- [ ] Create document button works and navigates to editor
- [ ] Documents list shows all user's documents
- [ ] Delete document removes it from list
- [ ] Document cards show title, date, and status

### Editor
- [ ] All toolbar formatting options work correctly
- [ ] Document title is editable
- [ ] Content auto-saves after changes
- [ ] Navigation back to dashboard works
- [ ] Three-panel layout renders correctly (Knowledge | Editor | AI)

### Knowledge Panel
- [ ] Add knowledge button opens form/modal
- [ ] Knowledge items display with labels
- [ ] Delete removes knowledge item
- [ ] Empty state shows appropriate message

### AI Assistant
- [ ] Quick action buttons are clickable
- [ ] Chat input accepts text
- [ ] AI responses are generated (requires OpenAI API key)
- [ ] Responses are contextual to document content

### Payments
- [ ] Payment modal appears for non-subscribed users
- [ ] Modal can be closed
- [ ] Upgrade button in header opens modal
- [ ] Start Free Trial opens Polar checkout
- [ ] Subscription status updates after successful payment

---

## Test Scenarios

### Critical Paths
1. Complete signup → dashboard → create document → edit → save
2. Login → view existing documents → open document → edit
3. Non-subscribed user sees payment modal → can close → can reopen via Upgrade
4. Create document → add knowledge → use AI quick action

### Edge Cases
1. Login with wrong password shows error
2. Signup with mismatched passwords shows error
3. Signup with password < 8 chars shows error
4. Empty document list shows friendly empty state
5. Payment modal reopens if subscription not active

### UI/UX Checks
1. All pages are responsive
2. Loading states show spinners
3. Buttons have hover states
4. Forms show validation errors
5. Navigation is intuitive

---

## URLs

- **Landing Page**: /
- **Login**: /login
- **Signup**: /signup
- **Dashboard**: /dashboard
- **Editor**: /editor/:documentId

---

## Version

- **Document Version**: 1.0
- **Last Updated**: February 5, 2026
- **Product Version**: 0.0.0
