# 📋 attend.io - Evaluation-II Project Roadmap

This is the master plan for the **Backend Project Evaluation-II**. It combines the teacher's mandatory requirements with the advanced topics from the syllabus (Lectures 25-48).

---

## 🚦 Project Status Checklist

### 1. Mandatory Requirements (Teacher's List)
- [ ] **Min 5 Web Pages** (Home, Signup, Login, Profile, Attendance)
- [ ] **Signup with Multer** (Profile picture upload)
- [ ] **JWT Authentication** (Secure route protection)
- [ ] **Login by Google Account** (Passport.js OAuth)
- [ ] **MongoDB Storage** (Mongoose models)

### 2. Syllabus Integration (Lectures 25-48)
- [ ] **Middleware Logic** (Lecture 25-28: Auth & Error handling)
- [ ] **Session & Cookies** (Lecture 37-40: Support for OAuth & JWT storage)
- [ ] **Password Hashing** (Lecture 41-44: Bcrypt)
- [ ] **Socket.io (Optional)** (Lecture 45-48: Only if time permits)

---

## 🏗️ Finalized Database Schema (Mongoose)

### 1. User Model (`User.js`)
*   **Fields:** `firstName`, `lastName`, `email` (Unique), `password`, `profilePic`, `googleId`, `role`, `group`, `department`, `designation`.
*   **Validation:**
    *   `role`: `enum: ["student", "teacher"]`
    *   `group`: `enum: ["G-14", "G-15", ...]` (String-based Enum)
*   **Indexes:** `{ group: 1, role: 1 }` (For fast student fetching)
*   **Settings:** `timestamps: true`.

### 2. Subject Model (`Subject.js`)
*   **Fields:** `name`, `code`, `group` (same Enum as Users).
*   **Reference:** `faculty` (Ref: `User`).
*   **Indexes:** `faculty`, `group`.
*   **Settings:** `timestamps: true`.

### 3. Attendance Model (`Attendance.js`)
*   **Fields:**
    *   `subject`: (Ref: `Subject`)
    *   `date`: (Date)
    *   `records`: Array of `{ student: ObjectId, status: enum["Present", "Absent"] }`
*   **Validation:** Status is `Present` | `Absent`.
*   **Uniqueness Rule:** **Unique Index** on `{ subject: 1, date: 1 }` (Prevents marking twice for same subject + day).
*   **Logic:** `faculty` is removed (Fetched via Subject ref).
*   **Settings:** `timestamps: true`.

---

## 🗺️ Step-by-Step Implementation Plan

### Phase 1: Database & Foundation (Lectures 33-36)
1. **Connect MongoDB:** Setup `src/config/db.js`.
2. **Models:** Create the 3 Mongoose models described above.
3. **Seed Data:** (Optional) Create a script to migrate your current `users.json` into MongoDB.

### Phase 2: Advanced Authentication (Lectures 37-44)
1. **Multer Setup:** Update `/signup` form to accept images and configure storage.
2. **Local Auth:** Implement signup/login using **Bcrypt** for hashing.
3. **Google Login:** Setup Passport.js and `express-session`.
4. **JWT & Cookies:** Generate JWTs on login and store them in Secure HTTP-only cookies.

### Phase 3: Faculty Features & Authorization
1. **Manage Subjects:** Add a page for Faculty to "Add a Subject + Group" (Creates entry in `Subject` table).
2. **Mark Attendance:** 
    - Faculty selects a Subject.
    - System fetches students where `group` matches.
    - Post attendance to DB (preventing duplicates using our index).

### Phase 4: Student Features
1. **Dashboard:** Fetch all `Subject` entries for the student's `group`.
2. **Attendance Report:** Calculate `(Present / Total)` for each subject.
3. **Filters:** Allow students to filter history by date or subject.

### Phase 5: UI/UX & Final Prep
1. **Modern EJS:** Glassmorphism/Dark Mode UI.
2. **Viva Prep:** Reviewing logic for Middlewares and Schema relations.

---

## 🎓 Viva Preparation Notes (Amitabh's Favorites)
*Keep these in mind for the final interview:*
- **JWT vs Sessions:** Why use one over the other? (Statelessness vs State).
- **Security:** Why hash passwords with Bcrypt? (Salt rounds and one-way encryption).
- **Middleware:** What is `next()` and how does the request travel through Express?
- **Multer:** How does it handle multi-part form data?

---

## 📁 Suggested File Structure
```text
attend.io/
├── src/
│   ├── config/         # DB and Passport config
│   ├── controllers/    # Logic for Auth, Attendance, etc.
│   ├── middleware/     # JWT and Role checks
│   ├── models/         # Mongoose Schemas (User, Attendance)
│   ├── routes/         # API and Page routes
│   └── utils/          # Helpers (Bcrypt, etc.)
├── public/
│   └── uploads/        # Profile pictures
├── views/              # EJS Templates
└── server.js           # Main Entry Point
```
