## Why

The backend returns auth tokens in JSON body only, forcing every frontend to manually store, attach, and refresh tokens. The admin web stores tokens in `localStorage` (XSS-accessible), while mobile apps use `AsyncStorage` (unencrypted). This creates inconsistent security and unnecessary token-management boilerplate across three separate frontends.

## What Changes

- Backend login/register endpoints set httpOnly `Set-Cookie` headers alongside existing JSON responses
- Backend JWT strategy extracts tokens from **either** `Authorization: Bearer` header **or** `access_token` cookie
- Backend refresh endpoint reads `refresh_token` from **either** request body **or** cookie
- Backend unifies secret configuration to single `JWT_SECRET` (removes `JWT_ACCESS_SECRET`/`JWT_REFRESH_SECRET` inconsistency)
- Admin web (browser) relies on httpOnly cookies instead of localStorage; simplifies API client
- Mobile apps (Expo) upgrade token storage from `AsyncStorage` to `expo-secure-store`
- Register endpoints set cookies for admin only; agent/branch register stay JSON-only

## Capabilities

### New Capabilities

- `hybrid-auth`: Cross-cutting auth enhancement supporting both cookie-based (browser) and header-based (mobile) authentication flows

### Modified Capabilities

<!-- No existing specs to modify -->

## Impact

**Backend** (`server/`):
- `package.json` — add `cookie-parser` dependency
- `main.ts` — add cookie-parser middleware
- `src/modules/auth/auth.controller.ts` — login/register handlers set cookies, refresh reads from cookie or body
- `src/modules/auth/jwt.strategy.ts` — dual extraction (header or cookie)
- `src/modules/auth/auth.service.ts` — unify secret usage
- `.env.example` — clean up secret vars

**Admin Web** (`client/admin-web/`):
- `src/config/apiClient.ts` — add `credentials: 'include'`, remove manual Bearer token logic
- `src/features/auth/context/AuthContext.tsx` — remove localStorage token storage
- `src/features/auth/services/authService.ts` — remove `setToken` import
- `src/features/auth/pages/LoginPage.tsx` — update `signIn` call signature

**Agent Mobile** (`client/agent-mobile/`):
- `package.json` — add `expo-secure-store`
- `src/context/AuthContext.tsx` — replace AsyncStorage with SecureStore for token
- `src/features/auth/services/authApi.ts` — replace AsyncStorage with SecureStore for token reads

**Branch Mobile** (`client/branch-mobile/`):
- `package.json` — add `expo-secure-store`
- `src/context/AuthContext.tsx` — replace AsyncStorage with SecureStore for token
- `src/store/authStore.ts` — replace AsyncStorage with SecureStore for token
- `src/features/auth/services/auth.service.ts` — replace AsyncStorage with SecureStore for token reads
