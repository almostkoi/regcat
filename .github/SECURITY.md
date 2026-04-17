# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Regcat, please report it responsibly by opening a [GitHub Security Advisory](https://github.com/almostkoi/regcat/security/advisories) instead of using the public issue tracker.

When reporting, please include:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact or severity
- Suggested fix (if available)

We will acknowledge your report within 48 hours and work on a fix promptly.

## Supported Versions

Only the latest version of Regcat receives security updates.

## Security Measures

Regcat includes the following security protections:

- **XSS Prevention**: All user input is HTML-encoded before display
- **CSRF Protection**: Origin/Host header validation on API endpoints
- **CORS Protection**: Properly configured CORS headers with origin validation
- **ReDoS Protection**: 2-second timeout on regex execution to prevent catastrophic backtracking
- **Input Validation**: All API endpoints validate input before processing
- **No External APIs**: All processing happens locally with no external API calls
- **No Data Collection**: User patterns and test strings are never logged or transmitted

## Dependencies

Regcat uses only a minimal set of well-maintained dependencies:

- Next.js (Next.js security is maintained by Vercel)
- React
- TypeScript
- Tailwind CSS
- Lucide React
- randexp

We regularly check dependency vulnerabilities using `npm audit`.

## Running Locally

To audit dependencies during development:

```bash
npm audit                 # Check for vulnerabilities
npm audit fix            # Auto-fix fixable vulnerabilities
npm audit fix --force    # Force fixes (may break things)
```

## Public Disclosure

Once a fix is released, we may publicly disclose the vulnerability with proper credit to the reporter.

---

For questions about security, please reach out through GitHub Issues or Discussions.
