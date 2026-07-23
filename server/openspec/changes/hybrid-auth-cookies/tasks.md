# Tasks

| # | Task | Files | Status |
|---|------|-------|--------|
| 1 | Install `cookie-parser` + types | `server/package.json` | Done |
| 2 | Add cookie-parser middleware in `main.ts` | `server/src/main.ts` | Done |
| 3 | Unify secrets in `auth.service.ts` | `server/src/modules/auth/auth.service.ts` | Done |
| 4 | Dual extraction in `jwt.strategy.ts` | `server/src/modules/auth/jwt.strategy.ts` | Done |
| 5 | Set cookies in login/register/refresh endpoints | `server/src/modules/auth/auth.controller.ts` | Done |
| 6 | Clean up `.env.example` | `server/.env.example` | Done |
| 7 | Simplify admin-web `apiClient.ts` | `client/admin-web/src/config/apiClient.ts` | Done |
| 8 | Simplify admin-web `AuthContext.tsx` | `client/admin-web/src/features/auth/context/AuthContext.tsx` | Done |
| 9 | Update admin-web `authService.ts` | `client/admin-web/src/features/auth/services/authService.ts` | Done |
| 10 | Update admin-web `LoginPage.tsx` | `client/admin-web/src/features/auth/pages/LoginPage.tsx` | Done |
| 11 | Install `expo-secure-store` in agent-mobile | `client/agent-mobile/package.json` | Done |
| 12 | Replace AsyncStorage→SecureStore in agent-mobile | `client/agent-mobile/src/context/AuthContext.tsx`, `client/agent-mobile/src/features/auth/services/authApi.ts` | Done |
| 13 | Install `expo-secure-store` in branch-mobile | `client/branch-mobile/package.json` | Done |
| 14 | Replace AsyncStorage→SecureStore in branch-mobile | `client/branch-mobile/src/context/AuthContext.tsx`, `client/branch-mobile/src/store/authStore.ts`, `client/branch-mobile/src/features/auth/services/auth.service.ts` | Done |
| 15 | Add migration fallback (AsyncStorage→SecureStore) | Both mobile apps | Done |
