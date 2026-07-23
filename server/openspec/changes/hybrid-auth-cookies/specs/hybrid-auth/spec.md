## ADDED Requirements

### Requirement: Backend accepts both cookie and Bearer token

The system SHALL accept JWT authentication via `Authorization: Bearer <token>` header or `access_token` httpOnly cookie, checking the header first with Bearer token falling back to cookie.

#### Scenario: Request with Bearer header
- **WHEN** a request includes `Authorization: Bearer <valid-token>`
- **THEN** the server authenticates using the Bearer token

#### Scenario: Request with cookie but no header
- **WHEN** a request has no `Authorization` header but includes `access_token` cookie
- **THEN** the server authenticates using the cookie value

#### Scenario: Request without any token
- **WHEN** a request has no Bearer header and no `access_token` cookie
- **THEN** the server returns `401 Unauthorized`

### Requirement: Login endpoints set httpOnly cookies

The system SHALL set `access_token` and `refresh_token` httpOnly cookies on successful login for admin, agent, and branch endpoints. Only `adminRegister` sets cookies on registration; agent/branch register return JSON only.

#### Scenario: Admin login sets cookies
- **WHEN** `POST /api/auth/admin/login` succeeds
- **THEN** response includes `Set-Cookie` headers for `access_token` (max-age=900, path=/api) and `refresh_token` (max-age=604800, path=/api/auth/refresh) with HttpOnly, Secure, SameSite=Strict flags
- **THEN** response body contains `accessToken`, `refreshToken`, `user`, `message`

#### Scenario: Agent register does not set cookies
- **WHEN** `POST /api/auth/agent/register` succeeds
- **THEN** response body contains `accessToken` and `user`
- **THEN** response does NOT include `Set-Cookie` headers

### Requirement: Refresh endpoint accepts token from cookie or body

#### Scenario: Refresh via cookie
- **WHEN** `POST /api/auth/refresh` includes `refresh_token` cookie
- **THEN** server validates the cookie, issues new `access_token` as both JSON body and `Set-Cookie` header

#### Scenario: Refresh via body
- **WHEN** `POST /api/auth/refresh` includes `{ refreshToken: "<token>" }` in body
- **THEN** server validates the token, returns new `accessToken` in JSON body

### Requirement: Admin web uses cookies for auth

#### Scenario: API call with cookie
- **WHEN** admin-web SPA makes a fetch request
- **THEN** the browser automatically includes cookies via `credentials: 'include'`
- **THEN** no manual `Authorization` header is needed

#### Scenario: 401 triggers cookie-based refresh
- **WHEN** API returns 401
- **THEN** client calls `POST /api/auth/refresh` (refresh_token cookie sent automatically)
- **THEN** on success, client retries original request
- **THEN** on failure, client redirects to `/login`

### Requirement: Mobile apps use SecureStore for tokens

#### Scenario: Token stored in SecureStore after login
- **WHEN** mobile app login succeeds
- **THEN** token is stored via `SecureStore.setItemAsync('auth_token', token)`
- **THEN** user profile (non-sensitive) is stored via `AsyncStorage.setItem('@agrivet_user', user)`

#### Scenario: Existing token migrates from AsyncStorage
- **WHEN** app launches and finds no token in SecureStore but finds one in AsyncStorage
- **THEN** migrate to SecureStore and delete from AsyncStorage
