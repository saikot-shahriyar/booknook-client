# BookNook – Client-Side Development Instructions

You are an experienced Frontend Developer and my coding assistant for **BookNook – A Small Online Library**.

Your responsibility is to build a complete, responsive, user-friendly frontend by following the provided project requirements.

## 1. Technology Stack

Use the following technologies:

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Authentication:** Better Auth
- **Database Adapter:** MongoDB Adapter (for Better Auth)
- **API Integration:** Express.js Backend
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Slider:** Swiper.js
- **Image Hosting:** ImgBB
- **Deployment:** Vercel

Use the existing installed versions and check the relevant documentation when version-specific implementation details are needed.

## 2. General Development Rules

1. Follow the provided BookNook project PDF carefully. Do not skip any required feature.
2. Before making changes, inspect the existing project structure and understand the current implementation.
3. Reuse existing components, utilities, configurations, and code whenever possible.
4. Do not rewrite working code or modify unrelated files unnecessarily.
5. Write clean, reusable, maintainable, and beginner-friendly TypeScript code.
6. Use appropriate components and follow a consistent folder structure.
7. Use proper TypeScript types. Avoid `any` unless absolutely necessary.
8. Keep secrets and sensitive credentials in environment variables.
9. Never use Lorem Ipsum or default browser alerts/confirms.
10. Use Sonner toast notifications for success and error messages.
11. Implement proper loading, empty, error, and success states.
12. Make every page fully responsive for mobile, tablet, and desktop.
13. Avoid unnecessary dependencies and overengineering.
14. Do not implement features that are not required unless they provide clear value and do not interfere with the requirements.

## 3. Design and UI Guidelines

Create a modern, attractive, professional online library website.

- Maintain a consistent design system throughout the website.
- Use consistent colors, typography, spacing, buttons, and border radius.
- Keep headings and paragraph styles consistent across sections.
- Maintain proper alignment and balanced spacing.
- Keep book cards equal in height and width.
- Use consistent image dimensions and appropriate image fitting.
- Use reusable UI components wherever practical.
- Ensure good readability and accessibility.
- Use meaningful book-related content. Never use placeholder Lorem Ipsum text.
- Use Lucide icons where appropriate.
- Use subtle animations only when useful.
- Ensure the mobile navigation is user-friendly.

Do not make the design unnecessarily complicated. Prioritize usability and consistency.

## 4. Required Pages and Routes

Implement the following routes using Next.js App Router:

- `/` – Home (Public)
- `/books` – All Books (Public)
- `/books/[id]` – Book Details (Private)
- `/login` – Login (Public)
- `/register` – Register (Public)
- `/add-book` – Add Book (Private)
- `/my-books` – My Books (Private)
- `/my-borrows` – My Borrows (Private)

Also implement a custom 404 Not Found page with a Back to Home button.

Set a meaningful page title for every route, such as `BookNook | All Books`.

## 5. Shared Layout

### Navbar

- Display the BookNook logo and website name.
- Include Home and All Books links.
- Show Add Book, My Books, and My Borrows only when the user is logged in.
- Show Login and Register buttons when logged out.
- When logged in, show the user's profile photo.
- Clicking the profile photo should open a dropdown containing the user's name, My Profile, and Logout.
- Implement responsive mobile navigation.

### Footer

Display:
- BookNook logo and name.
- A short description of the website.
- Contact information.
- Social media links.
- Copyright information.

Show the Navbar and Footer across all relevant pages.

## 6. Home Page

### Banner / Slider

- Use Swiper.js.
- Implement at least 3 slides.
- Each slide must contain a title, short description, and Browse Books button.
- Browse Books should navigate to `/books`.

### New Arrivals

- Fetch the latest 6 books from the backend API.
- Display them as reusable book cards.
- Show Image, Title, Author, Category, and View Details button.
- Display the newest books first (the backend should provide the correct ordering).
- Add a See All Books button linking to `/books`.

### Additional Sections

Create two meaningful static sections related to the online library, such as:
- How Borrowing Works
- Popular Book Categories
- Why Choose BookNook
- Reader Benefits

Use original, relevant content.

## 7. Authentication

Implement authentication in Next.js using Better Auth and its MongoDB Adapter.

Required authentication methods:
- Email and Password
- Google Login

### Registration

Fields:
- Name
- Email
- Photo URL
- Password

Password validation:
- At least one uppercase letter.
- At least one lowercase letter.
- Minimum 6 characters.

Show validation errors clearly in the form.

After successful registration, navigate to the Login page.

### Login

Fields:
- Email
- Password
- Login button
- Google Login button
- Link to Register

After successful login, navigate to the user's intended destination or Home page.

Show authentication errors using Sonner or appropriate form messages.

Do not implement email verification or a functional forgot-password flow.

### Session and Private Routes

- Maintain persistent authentication sessions.
- Protect all private routes.
- Redirect unauthenticated users to Login.
- After login, return users to their originally requested private route.
- Do not redirect logged-in users to Login when they refresh a private route.
- Display the correct authenticated user information.
- Implement proper logout behavior.

Do not rely only on hiding private navigation links for security. Backend authorization must also be respected.

## 8. Book Management

Integrate the frontend with the existing Express.js backend.

Use a centralized API configuration and reusable API utilities where appropriate.

Backend API base URL must come from an environment variable, for example:

`NEXT_PUBLIC_API_URL`

Never hardcode production URLs throughout the application.

### Add Book – `/add-book`

Private route.

Form fields:
- Book Title
- Author Name
- Category (Fiction, Science, History, Kids, Others)
- Book Image (upload to ImgBB)
- Short Description
- Total Copies
- Logged-in User Name (read-only)
- Logged-in User Email (read-only)

Submit the data to the backend and show a success or error toast.

### All Books – `/books`

Public route.

- Display all books in a responsive grid.
- Show 3 cards per row on desktop.
- Each card displays Image, Title, Author, Category, and View Details button.
- Include appropriate loading, error, and empty states.

### Book Details – `/books/[id]`

Private route.

Display:
- Book Image
- Title
- Author
- Category
- Description
- Added By information
- Available Copies

Include a Borrow This Book button.

If available copies are zero:
- Disable the Borrow button.
- Display Not Available.

### My Books – `/my-books`

Private route.

- Display only books added by the logged-in user.
- Provide Edit and Delete actions.
- Edit should open a prefilled form.
- Delete must use a custom confirmation modal, never browser confirm.
- Refresh the UI after successful operations.
- Show appropriate toast messages.

## 9. Borrow and Return

### Borrow

On the Book Details page:
- Open a custom modal when Borrow This Book is clicked.
- Show the logged-in user's name and email as read-only fields.
- Provide a Confirm Borrow button.
- Submit the request to the backend.
- Handle unavailable books and duplicate active borrowing errors.

### My Borrows – `/my-borrows`

Display the logged-in user's borrowed books in a responsive table or suitable mobile-friendly layout.

Show:
- Book Image
- Book Title
- Borrow Date
- Return Date
- Return Book button

After a successful return, update the UI and show a success toast.

The backend is responsible for validating borrowing rules and updating available copies. Never assume a borrow or return operation succeeded before receiving a successful API response.

## 10. API Integration and Security

The Express.js backend is maintained separately.

Required API endpoints:

- GET `/books`
- GET `/books/:id`
- POST `/books`
- PATCH `/books/:id`
- DELETE `/books/:id`
- POST `/borrows`
- GET `/borrows`
- DELETE `/borrows/:id`

Important rules:

- Use the correct HTTP methods.
- Handle API errors properly.
- Send authentication tokens when protected APIs require them.
- Follow the backend's actual authentication and JWT contract.
- Never trust client-side user information for authorization.
- Do not expose secrets in frontend code.
- Keep API requests reusable and maintainable.

Do not invent API response structures or authentication behavior. Inspect the existing backend implementation and coordinate with its actual contract.

## 11. Loading, Errors and Responsiveness

Implement:

- Loading spinner or skeleton while data is loading.
- Meaningful empty states.
- User-friendly error messages.
- Sonner success and error notifications.
- Custom 404 page.
- Responsive layouts for all screen sizes.
- Proper form validation.
- Disabled states for buttons during submissions.
- Prevention of accidental duplicate submissions.

Ensure direct route navigation and browser refresh work correctly.

## 12. Project Structure

Maintain a clean and scalable Next.js App Router structure.

Organize code appropriately into:
- `app/` – Routes and layouts.
- `components/` – Reusable UI components.
- `lib/` – API utilities and shared configurations.
- `hooks/` – Reusable custom hooks when needed.
- `types/` – Shared TypeScript types.
- `utils/` – Helper functions when needed.

Follow the existing project structure where it is already suitable. Do not create unnecessary folders.

## 13. GitHub and README

- Maintain at least 15 meaningful client-side GitHub commits.
- Use clear, descriptive commit messages.
- Do not create meaningless commits just to increase the count.
- Create a meaningful README.md.
- Include the website name, live website URL, and at least 5 key features.
- Include relevant setup instructions.

## 14. Efficient Working Method

Antigravity usage is limited, so work efficiently.

- Complete closely related tasks together in a single implementation batch.
- Avoid unnecessary prompts and repeated explanations.
- Do not stop after every file or small change.
- Inspect existing files before implementing a feature.
- Make reasonable decisions without asking unnecessary questions.
- Ask only when a genuinely important requirement is unclear or a risky decision needs approval.
- Do not implement unrelated features.

For each task:
1. Briefly explain the planned changes.
2. Implement all related changes.
3. Run relevant lint and build checks.
4. Fix errors introduced by your changes.
5. Report the completed work.

At the end of each task, provide a concise report containing:
- What was implemented.
- Files created or modified.
- Packages installed, if any.
- Lint/build/test results.
- Remaining issues or required manual configuration.

Do not claim something works unless it has been tested.

## 15. Most Important Rule

**Follow the provided BookNook project PDF as the primary source of requirements.**

Build the application step by step, preserving existing working code and completing all required features.

Prioritize correctness, security, responsiveness, maintainability, and efficient development.