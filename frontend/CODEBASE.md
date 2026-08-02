# Mom's Care PG House — Frontend Codebase Guide

## Purpose

This is the React frontend for a PG (paying guest) booking and operations portal. It serves three roles:

- **Guests/users:** browse PG branches, view rooms and beds, submit booking details, view bookings, and manage a profile.
- **Admins:** manage branches, rooms, beds, bookings, residents, wardens, payments, complaints, reports, and settings.
- **Wardens:** manage their residents, payments, occupancy, and complaints.

The current launch scope is limited to the Chennai branches **Anna Nagar** and **Virugambakkam**.

## Stack and commands

- React 18, Vite 5, React Router 6
- Tailwind CSS 3, Lucide React icons
- Socket.IO client package is installed; the current socket implementation is an in-browser mock event bus.
- No test runner is configured.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build
npm run preview
```

`vercel.json` rewrites every route to `index.html`, supporting React Router on Vercel.

## Project map

```text
src/
  main.jsx                 Application bootstrap; BrowserRouter + theme/auth providers
  App.jsx                  All route definitions
  index.css                Global styles and dark-mode overrides
  api/apiConfig.js         API integration placeholder (`USE_MOCK = true`)
  components/
    layout/                Public navbar and admin/warden dashboard shell
    ui/                    Shared Button, Input, Card, Badge, section and stat components
    booking/BedGrid.jsx    Reusable bed-selection grid
    admin/BranchImage.jsx  Branch image presentation
  context/                 AuthContext and ThemeContext
  data/                    Demo entities plus localStorage load/save helpers
  lib/                     Availability and payment business logic/hooks
  pages/
    guest/                 Public browsing and user booking screens
    admin/                 Admin operations screens
    warden/                Warden operations screens
    complaints/            Shared complaint-management screen
  routes/                  Role mapping and route protection
  services/                Mock authentication and mock socket event bus
public/logo.jpeg           App logo
```

## Routing

All active routes are defined in `src/App.jsx`.

| Area | Routes |
| --- | --- |
| Public | `/`, `/login`, `/branches`, `/featured-branches`, `/branches/:branchId/rooms`, `/rooms/:roomId/beds`, `/booking-details`, `/booking-status` |
| Logged-in user | `/booking`, `/my-bookings`, `/profile` |
| Admin login/app | `/pgbooking/admin/login`, `/pgbooking/admin/*` |
| Warden login/app | `/pgbooking/warden/login`, `/pgbooking/warden/*` |

Admin child pages include dashboard, branches, rooms, beds, bookings, residents, wardens, payments, complaints, reports, and settings. Warden child pages include dashboard, residents, payments, occupancy, and complaints.

`PublicLayout` owns the public header/navigation. `DashboardLayout` owns the admin/warden sidebar and header. `ProtectedRoute` redirects unauthenticated users to the appropriate login page and redirects users with the wrong role to their dashboard.

## State, data, and real-time behavior

The frontend is currently **mock-first**. It does not make HTTP requests yet, despite `.env.example` exposing `VITE_API_URL` and `VITE_SOCKET_URL` for a future backend integration.

- Entity seed data and persistence helpers live in `src/data/admin*.js` and `src/data/complaints.js`.
- Changes are persisted in browser `localStorage`; each module has `load*` and `save*` helpers.
- `src/lib/liveAvailability.js` keeps rooms/beds in sync and exposes availability hooks.
- `src/lib/livePayments.js` calculates rent due, stores payments, exposes analytics, and can print receipts.
- `src/services/socket.js` is a local `on`/`off`/`emit` event bus, not a live Socket.IO connection.
- `src/data/launchScope.js` filters administrative data to `anna-nagar` and `virugambakkam`.

When replacing mock data with an API, preserve the data-module interfaces used by pages where practical, or update every consumer together. Replace the mock socket service with a `socket.io-client` connection and keep the availability/payment event contracts consistent.

## Authentication

`AuthContext` stores the session token and user in `localStorage` and normalizes display roles to app roles. Authentication is mocked in `src/services/authService.js`.

Development accounts:

| Role | Login | Password |
| --- | --- | --- |
| Admin | `admin@pgstay.com` | `admin123` |
| Warden | `warden@pgstay.com` | `warden123` |
| User | `user@pgstay.com` | `User@123` |

Google/Facebook buttons also use mock user accounts. Never treat these credentials or tokens as production authentication.

## UI conventions

- Use Tailwind utility classes and the shared components in `src/components/ui` before adding one-off controls.
- Brand colors are configured in `tailwind.config.js`: primary pink `brand` (`#DD5E67`), darker pink `brandDark` (`#D12233`), and pale pink `paper`.
- Dark mode is controlled by `ThemeContext`, which applies the `dark` class to `<html>` and persists `pgstay-theme`.
- Icons come from `lucide-react`.
- The guest-facing brand is “Mom's Care PG House”.

## Important implementation notes

- The guest booking flow and admin/warden operations share the same locally persisted room, bed, booking, resident, and payment data. Changes in one screen should be reflected in the related screens.
- Public branch IDs use a `-pg` suffix (for example, `anna-nagar-pg`); admin data generally uses IDs without it. `liveAvailability.js` contains conversion helpers—reuse them rather than duplicating ID logic.
- Existing `*PageN.jsx` files in `src/pages/guest` are legacy/design variants and are not imported by `App.jsx`. Do not assume they are active screens.
- `Payment.jsx` exists but currently has no active route.
- There are existing uncommitted changes in this working tree. Preserve them unless a task explicitly asks to alter them.

## Suggested workflow for future changes

1. Identify the route and page in `src/App.jsx`.
2. Reuse the applicable layout and shared UI component.
3. Update the corresponding data/lib helper if the change affects shared entity state.
4. Check role protection and both light/dark visual states.
5. Run `npm run build` before handoff.

