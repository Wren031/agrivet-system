## Context

The current auth system returns JWT tokens exclusively in JSON response bodies. The admin web (React+Vite) stores these in `localStorage` and manually attaches `Authorization: Bearer` headers. The mobile apps (Expo/RN) store tokens in `AsyncStorage` (unencrypted).

There's also a config inconsistency: `AuthService` uses `JWT_ACCESS_SECRET`/`JWT_REFRESH_SECRET` env vars (which don't exist in `.env.example`), while `JwtStrategy` uses `JWT_SECRET` through the NestJS ConfigModule.

## Goals / Non-Goals

**Goals:**
- Admin web authenticates via httpOnly cookies (immune to XSS)
- Mobile apps continue using `Authorization: Bearer` header (unchanged)
- Backend accepts both auth methods transparently
- Mobile apps store tokens in `expo-secure-store` instead of `AsyncStorage`
- Refresh flow works via cookie (admin web) or body param (mobile)
- Single `JWT_SECRET` used consistently everywhere

**Non-Goals:**
- No changes to the User model or Prisma schema
- No OAuth/social login
- No session management beyond JWT
- No changes to role/permission logic
- No CSRF token (SameSite=Strict is sufficient for SPA + CORS)

## Decisions

1. **Single JWT_SECRET** over three separate secrets — removes the current inconsistency where register endpoints sign with `JWT_SECRET` (via `jwtService`) but login signs with `JWT_ACCESS_SECRET` (via `process.env`). Simpler config, fewer env vars to manage, no meaningful security difference for this app.

2. **Dual extraction in JwtStrategy** — `ExtractJwt.fromExtractors([...])` with both `fromAuthHeaderAsBearerToken()` and cookie reader. This is the simplest way to support both auth methods without writing a custom guard.

3. **`@Res({ passthrough: true })`** — NestJS pattern that allows both setting cookies AND returning JSON from the same endpoint. Mobile apps ignore the `Set-Cookie` headers (React Native's fetch has no automatic cookie store).

4. **Path-restricted cookies** — `refresh_token` cookie limited to `Path=/api/auth/refresh` so it's only sent to the refresh endpoint, not every API call.

5. **AsyncStorage → SecureStore in mobile** — `@agrivet_token` moves to `expo-secure-store` (encrypted, Keychain/Keystore-backed). `@agrivet_user` stays in AsyncStorage (non-sensitive profile data).

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Mobile apps receive Set-Cookie headers they don't use | Harmless — React Native ignores them on iOS; Android's cookie jar stores them but they're never sent since mobile apps don't use `credentials: 'include'` |
| Existing localStorage tokens continue working after deploy | Backward compatible — admin web still accepts Bearer header from apiClient; refresh endpoint still reads `refreshToken` from body. Old tokens work until they expire. |
| Cookie size limit (~4KB) exceeded by large JWT | JWT payload is small (sub, email, role) — well within limits |
| SecureStore unavailable on some Expo clients (e.g., Expo Go) | Fallback: `SecureStore.isAvailableAsync()` check before every operation. Migration logic handles legacy AsyncStorage tokens. |
| Users lose session if they clear cookies | They log in again — same as any cookie-based auth |
