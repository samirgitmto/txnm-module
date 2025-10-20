## Future: Secure Session Token Strategy (to reduce exposure)

Problem: sessionId is visible to end users (DevTools, network panel) when sent from the browser. You cannot truly hide anything the browser sends, but you can limit exposure and make the client-held token non-sensitive.

Recommended patterns:

- Opaque token (server lookup):
  - Backend generates a cryptographically random token (e.g., 128-bit).
  - Store mapping token → internal sessionId (e.g., Redis with TTL).
  - Client sends only the opaque token on subsequent requests.
  - Server looks up sessionId by token; internal sessionId is never exposed.

- Signed token (no lookup):
  - Payload: { sessionId, exp, nonce [, optional bindings like uaHash] }.
  - Token = base64(payload | HMAC(secret, payload)).
  - Server verifies signature and exp each request, then extracts sessionId.

Transport and storage guidance:
- Prefer sending token via request header (e.g., X-Session-Token) or POST body; avoid query params.
- Optionally use HttpOnly, Secure, SameSite cookies to keep token inaccessible to JS (still visible in DevTools but not via XSS).

Operational controls:
- Short TTL (e.g., 30–60 minutes) and rotation on critical steps.
- Rate-limit by token; revoke on abuse; avoid logging tokens; scrub from analytics.

Migration path from current model:
1) Keep generating client sessionId per upload (current approach).
2) On first backend call, mint and return an opaque/signed token bound to that sessionId.
3) Frontend replaces raw sessionId usage with the token for all subsequent requests.
4) Backend resolves/validates token → sessionId internally.

Result: Even if the token is observed, it carries minimal value, is short‑lived, and cannot be forged.
