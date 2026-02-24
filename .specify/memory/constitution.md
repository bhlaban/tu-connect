# TU Connect Constitution

## Core Principles

### I. User Privacy & Data Protection (NON-NEGOTIABLE)
- Data minimization: Collect ONLY data essential for features.
- Explicit consent: Obtain opt-in for analytics and tracking.
- Encryption: MUST encrypt data in transit (TLS 1.2+) and at rest
	using platform-secure storage (Keychain/Keystore).
- Sensitive logging: MUST NOT log PII, secrets, or health/financial data.
- User control: Provide data export and account deletion within the app.
- Third-party SDKs: MUST disclose data flows and honor consent.
Rationale: Protects users, meets regulatory expectations, and maintains trust.

### II. Secure Data Handling & Authentication
- Auth: Prefer OAuth2/OIDC; store tokens in secure storage only.
- Secrets: MUST NOT hardcode API keys/secrets in source or binaries.
- TLS: Enforce HTTPS; SHOULD implement certificate pinning for critical APIs.
- Session: Implement token refresh and secure logout; clear sensitive caches.
- Input/Output: Validate all inputs; sanitize outputs that render HTML.
- Dependencies: Keep security updates current; remove unused permissions.
Rationale: Reduces attack surface and protects user accounts/data.

### III. Accessibility & Inclusive Design
- Screen readers: MUST support VoiceOver/TalkBack labels and focus order.
- Text scaling: Respect system dynamic type/font scaling.
- Touch targets: Minimum 44×44 pt/dp; maintain clear hit areas.
- Contrast: Color contrast meets WCAG 2.2 AA where applicable on mobile.
- Motion: Provide reduced motion options; avoid flashing content.
Rationale: Ensures the app is usable by everyone and compliant.

### IV. Reliability, Offline Resilience & Performance
- Startup: Aim <2s cold start on mid-tier devices (SHOULD).
- Crash-free: Target ≥99.9% crash-free sessions (SHOULD); triage crashes.
- Offline: Critical flows MUST degrade gracefully; cache and queue sync.
- Error handling: Show actionable, user-friendly messages; avoid dead ends.
- Performance: Avoid jank; keep main-thread work minimal; batch network calls.
Rationale: Delivers dependable experience across network and device conditions.

### V. Observability, Release Management & Compliance
- Telemetry: Use privacy-respecting crash reporting; respect consent/opt-out.
- Logging: Structure logs; avoid PII; tag sessions for diagnostics.
- Versioning: Follow semantic versioning for APIs; mobile uses platform
	versionCode/versionName schemes consistently.
- Releases: Maintain checklists for store submissions and rollback plans.
- Policies: Comply with App Store/Play policies and publish a privacy policy.
Rationale: Enables safe releases and responsible operations.

## Additional Constraints — Mobile Platform Standards
- Platforms: Support iOS 15+ and Android 8+ (minimums MAY change with policy).
- Permissions: Request ONLY necessary runtime permissions with clear justification.
- Networking: Use modern HTTP stacks; retry with backoff; handle captive portals.
- Storage: Prefer platform-secure stores; avoid world-readable files.
- Third-party: SDKs MUST be vetted for privacy/security and kept up to date.

## Development Workflow & Quality Gates
- Code Review: All changes require review; security/privacy concerns MUST be addressed.
- CI Gates: Build, lint, static analysis/security scan MUST pass before merge.
- Accessibility Check: Basic a11y lint/audit MUST pass for new screens.
- Release Checklist: Store assets, privacy disclosures, and crash monitoring enabled.
- Incident Response: Define triage SLAs and hotfix procedures for critical issues.

## Governance
- Authority: This constitution supersedes ad-hoc practices for mobile development.
- Amendments: Proposals MUST include rationale, impact analysis, and migration plan;
	require maintainer approval.
- Versioning Policy: Changes follow semantic versioning:
	- MAJOR: Remove/redefine principles or governance in incompatible ways.
	- MINOR: Add principles/sections or materially expand guidance.
	- PATCH: Clarifications and non-semantic refinements.
- Compliance Reviews: Perform at least once per release cycle; document exceptions
	with risk acceptance and expiration dates.

**Version**: 1.0.0 | **Ratified**: 2026-01-01 | **Last Amended**: 2026-02-04