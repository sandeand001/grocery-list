# FamilyCart 🛒

A mobile-first progressive web app (PWA) for shared family grocery lists with real-time sync.

## Features

- **Google Sign-In** — quick, passwordless authentication
- **Real-time Grocery List** — all family members see updates instantly via Firestore
- **Categories** — items grouped by Produce, Dairy, Meat, Bakery, Frozen, Pantry, Beverages, Household, Other
- **Recipe Management** — save recipes with ingredients and add them all to your grocery list in one tap
- **Family Sharing** — create a family group or join an existing one via Family ID
- **PWA** — installable on iPhone Safari (standalone mode, works offline)

## Tech Stack

- React 19, Vite 8, React Router 7
- Firebase 12 (Firestore + Auth)
- Tailwind CSS 4
- vite-plugin-pwa

## Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd grocery-list
npm install
```

### 2. Configure Firebase

Copy `.env.example` to `.env` and fill in your Firebase project values:

```bash
cp .env.example .env
```

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 3. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 4. Run Locally

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
npm run preview
```

## Firestore Data Model

```
families/{familyId}/
  groceryItems/{itemId}   — name, quantity, category, checked, addedBy, addedAt
  recipes/{recipeId}      — name, ingredients[], createdBy, createdAt

users/{uid}               — displayName, email, photoURL, familyId
```

## Family Sharing

1. Sign in with Google
2. **Create a Family** to get a unique Family ID
3. Share that ID with family members
4. Others **Join Family** by entering the ID
5. All members share the same grocery list and recipes in real-time

## PWA Installation (iPhone)

1. Open the app in Safari
2. Tap the Share button → "Add to Home Screen"
3. Launch from your home screen for a full-screen app experience

