# 🇮🇳 INDIA CRICKET / TEAM CONTROL

### Local-First Cricket Squad & Fixture Management Dashboard

A modern React-based dashboard for managing an India cricket squad, player availability, Playing XI, alternates, fixtures, and match participation through a clean command-center interface.

> **Built as a local-first sports team management application with persistent browser storage.**

---

## 🌐 Live Demo

**Live Application:**  
https://kurinji-eswar.github.io/india-cricket-team-control/

**GitHub Repository:**  
https://github.com/Kurinji-Eswar/india-cricket-team-control

---

## 📌 Project Overview

**INDIA CRICKET / TEAM CONTROL** is a single-page React application designed to demonstrate how a cricket team manager or selector can organize squad information and fixture participation from one centralized dashboard.

The application provides:

- Squad management
- Player CRUD operations
- Playing XI and Alternates organization
- Player availability tracking
- Fixture creation and management
- Match participation management
- Participation statistics
- Persistent browser storage
- Responsive dashboard interface

The application intentionally follows a **local-first architecture**, meaning all application data is stored in the browser using `localStorage`.

There is currently **no backend, database, authentication system, external cricket API, or live-score integration**.

---

# 🎯 Problem Statement

Managing a sports squad can involve multiple disconnected pieces of information:

- Player details
- Jersey numbers
- Squad order
- Playing XI
- Alternates
- Player availability
- Upcoming fixtures
- Match participation

A lightweight centralized interface can make these operations easier to manage and visualize.

**INDIA CRICKET / TEAM CONTROL** addresses this by combining squad and fixture management into a single interactive dashboard.

---

# 💡 Objectives

The primary objectives of the project are:

1. Provide a centralized cricket squad management interface.
2. Maintain structured player information.
3. Separate squad serial numbers from jersey numbers.
4. Organize players into Playing XI and Alternates.
5. Track player availability.
6. Prevent injured players from participating in matches.
7. Create and manage fixtures.
8. Track match participation using stable player IDs.
9. Persist application data using browser storage.
10. Provide a responsive and visually distinctive command-center UI.

---

# ✨ Key Features

## 🏏 Squad Management

Manage the complete 23-player India squad from a dedicated squad interface.

Each player contains:

- Serial number
- Player name
- Jersey number
- Role
- Squad grouping
- Availability status

Supported player operations:

- Add player
- Edit player
- Delete player
- Search players
- Filter by role
- Filter by squad
- Update player status

---

## 🔢 Serial Number & Jersey Number

The application treats **serial number** and **jersey number** as two different concepts.

### Serial Number

Represents the player's position/order within the squad.

### Jersey Number

Represents the player's shirt number.

Jersey numbers:

- Are optional
- Accept values from 1–99
- Must be unique when provided
- Can be `null` when unavailable

This separation prevents squad ordering from being incorrectly tied to jersey numbering.

---

# 👥 Squad Structure

The application contains exactly **23 players**.

### Playing XI

The squad can be organized into an 11-player Playing XI.

### Alternates

The remaining squad members are represented as Alternates.

The application dynamically calculates the grouping from the current squad data.

---

# 🩺 Player Availability

Players have an availability status.

Supported statuses:

- `Available`
- `Injured`

When a player is marked as injured:

- The player is removed from existing match rosters.
- The player cannot be selected for match participation.
- The player is visually identified as unavailable.

This prevents injured players from being accidentally included in a match.

---

# 🏟️ Fixture Management

The Fixtures section allows users to manage cricket matches.

Each fixture contains:

- Opponent
- Match date
- Location
- Format
- Status
- Match roster

Supported fixture operations:

- Create fixture
- Delete fixture
- View fixture details
- Update fixture status
- Manage match participation

---

# 📋 Match Participation

Players can be selected for individual fixtures.

The system supports:

- Individual player selection
- Select all eligible players
- Clear selection
- Participation tracking
- Automatic exclusion of injured players

Match participation references players using their **stable player IDs**, rather than relying on names or list positions.

This allows player ordering and display information to change without breaking participation records.

---

# 📊 Dashboard

The dashboard provides an overview of the team's current state.

It includes information such as:

- Total squad size
- Available players
- Injured players
- Fixture information
- Participation information
- Featured player information

Participation percentage is calculated from the stored fixture participation data.

---

# 💾 Local-First Data Persistence

The application does not use a backend database.

Instead, application state is persisted through:

```text
Browser
   ↓
localStorage
   ↓
React Application State
```

The application uses schema-versioned local storage with normalization and legacy-data fallback handling.

This allows the dashboard to retain data across browser refreshes on the same browser/device.

---

# 🧠 Data Model

## Player

```text
Player
├── id
├── serialNumber
├── name
├── jerseyNumber
├── role
├── squad
└── status
```

## Match

```text
Match
├── id
├── opponent
├── date
├── location
├── format
├── status
└── roster[]
```

The `roster[]` array stores stable player IDs.

---

# 🏗️ System Architecture

```text
                    USER
                      │
                      ▼
             React Single Page App
                      │
                      ▼
                App State Layer
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
     Dashboard              Squad View
          │                       │
          └───────────┬───────────┘
                      │
                      ▼
                 Matches View
                      │
                      ▼
              Application Logic
                      │
                      ▼
                 localStorage
```

---

# 🧩 Application Structure

The main application is implemented in:

```text
src/
├── App.js
├── index.js
└── index.css
```

Supporting project configuration includes:

```text
tailwind.config.js
package.json
package-lock.json
.github/
└── workflows/
    └── deploy.yml
```

The primary application logic is intentionally centralized in `src/App.js`.

---

# 🎨 UI / UX Design

The interface follows a combination of:

- Neo-Brutalist design
- Editorial sports design
- India cricket visual language
- Command-center dashboard patterns

### Design characteristics

- Hard black borders
- Offset shadows
- Square cards
- Large editorial typography
- Dense information blocks
- High-contrast sections
- Tricolor-inspired accents
- Responsive layouts
- Strong visual hierarchy

### Primary Palette

```text
#111111  — Black
#F2EDE3  — Paper
#8D8C83  — Neutral Gray
#FF8A00  — Orange
#1E5EFF  — Blue
#138A36  — Green
#D72638  — Red
#0B1F3A  — Deep Navy
```

The visual system is designed to feel more like a **sports operations command center** than a conventional SaaS dashboard.

---

# 🛠️ Technology Stack

## Frontend

- React 19
- JavaScript
- JSX
- React Hooks
- Tailwind CSS

## Build System

- Create React App
- react-scripts 5.0.1
- PostCSS
- Autoprefixer

## Data Persistence

- Browser localStorage

## Testing

- Jest
- React Testing Library
- Testing Library DOM
- Testing Library User Event

## Deployment

- GitHub
- GitHub Actions
- GitHub Pages

## Icons

The project uses **inline SVG icons**.

No external icon library is required.

---

# 📦 Installation

## 1. Clone the repository

```bash
git clone https://github.com/Kurinji-Eswar/india-cricket-team-control.git
```

## 2. Navigate into the project

```bash
cd india-cricket-team-control
```

## 3. Install dependencies

```bash
npm install
```

## 4. Start the development server

```bash
npm start
```

The application will normally be available at:

```text
http://localhost:3000
```

---

# 🏗️ Production Build

Create an optimized production build:

```bash
npm run build
```

The generated production files are placed inside:

```text
build/
```

---

# 🚀 Deployment

The project is configured for deployment through **GitHub Actions + GitHub Pages**.

The workflow is located at:

```text
.github/workflows/deploy.yml
```

The deployment pipeline performs:

```text
Push to main
      ↓
GitHub Actions
      ↓
Install dependencies
      ↓
npm run build
      ↓
Upload build artifact
      ↓
GitHub Pages deployment
```

Live deployment:

https://kurinji-eswar.github.io/india-cricket-team-control/

---

# 🔐 Data & Security Scope

This is a **local-first demonstration application**.

The current version does not implement:

- User authentication
- Authorization
- Role-based access control
- Backend API
- Cloud database
- Server-side validation
- Multi-user synchronization
- Audit logging

Application data is stored locally in the browser.

Therefore, it should not be treated as a production-grade multi-user team management platform without additional backend and security infrastructure.

---

# 📱 Responsive Design

The interface is designed to adapt across:

- Desktop
- Laptop
- Tablet
- Mobile-sized layouts

The dashboard uses responsive Tailwind CSS utilities to reorganize content according to available screen width.

---

# 🧪 Validation & Data Integrity

The application contains client-side validation for important player operations.

Examples include:

- Preventing blank player names
- Validating serial numbers
- Validating jersey numbers
- Preventing duplicate jersey numbers
- Restricting jersey numbers to 1–99
- Normalizing player data
- Maintaining stable player IDs
- Blocking injured players from participation

---

# ⚙️ Current Limitations

The current version intentionally keeps the system lightweight.

### Not currently implemented

- Backend server
- Database
- Authentication
- Role-based access control
- Live cricket API
- Live scores
- Player performance analytics
- Advanced match analytics
- Match editing after creation
- Advanced player statistics
- Notifications
- Cloud synchronization
- PDF export
- Excel export
- AI recommendations
- Administrative audit logs

These are potential future extensions rather than existing features.

---

# 🔮 Future Scope

The project can be extended into a complete multi-user sports management platform.

### Backend Infrastructure

- REST API
- Node.js backend
- Database integration
- Server-side validation

### Authentication

- Secure login
- User roles
- Admin permissions
- Coach/selector accounts

### Cricket Data

- Live cricket API integration
- Match scorecards
- Player statistics
- Career statistics
- Fixture synchronization

### Analytics

- Player performance dashboards
- Match statistics
- Batting analytics
- Bowling analytics
- Participation trends
- Selection insights

### Cloud

- Cloud database
- Cloud synchronization
- Production deployment
- Multi-device access

### Administration

- Audit logs
- Activity history
- Advanced team controls
- Exportable reports

### AI Extensions

Future versions could introduce AI-assisted analysis for:

- Player performance summaries
- Squad analysis
- Match insights
- Selection-support information

These capabilities are **not part of the current implementation**.

---

# 📈 Project Evolution

```text
Static Squad Data
       ↓
Interactive Squad Management
       ↓
Player Availability
       ↓
Fixture Management
       ↓
Match Participation
       ↓
Persistent Local Storage
       ↓
Responsive Command Center
       ↓
Future Cloud + Analytics Platform
```

---

# 🎓 Project Value

This project demonstrates practical implementation of:

- React component development
- React state management
- React Hooks
- CRUD operations
- Form validation
- Data normalization
- Persistent browser storage
- Stable identifier design
- Conditional UI rendering
- Responsive UI development
- Tailwind CSS
- Git and GitHub
- GitHub Actions
- GitHub Pages deployment

It also demonstrates how a domain-specific workflow can be translated into a structured frontend application.

---

# 👨‍💻 Author

## Kurinji Eswar J A

B.Tech Computer Science & Engineering  
SRM Institute of Science and Technology, Trichy

### Areas of Interest

- Artificial Intelligence & Machine Learning
- Full-Stack Development
- Cloud Computing
- Software Engineering
- Web Application Development

---

# 🔗 Connect

**GitHub**  
https://github.com/Kurinji-Eswar

**LinkedIn**  
Add your LinkedIn profile URL here.

**Portfolio**  
Add your portfolio URL here.

---

# 📄 License

This project is currently maintained as an academic and portfolio project.

If you intend to publish or reuse the project commercially, define an appropriate open-source or proprietary license before distribution.

---

## ⭐ Project

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

**INDIA CRICKET / TEAM CONTROL**  
*A local-first cricket squad and fixture command center.*
