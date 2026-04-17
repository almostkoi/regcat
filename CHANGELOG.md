# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-17

### Added

- Real-time regex matching with instant results
- Support for all 7 JavaScript regex flags (g, i, m, s, u, d, y)
- Beginner-friendly pattern explanations using local parsing
- Auto-generate test strings using randexp library
- Live string replacement preview with capture group support
- Dark terminal UI with neon green theme
- Fully responsive mobile design
- Keyboard shortcuts (Ctrl+K, Ctrl+1, Ctrl+2)
- Match highlighting with capture groups and indices
- Pagination for large match results (50 per page)
- Quick reference cheatsheet sidebar
- PWA support with manifest

### Security

- HTML encoding for XSS prevention
- CORS and CSRF protection headers
- ReDoS protection with 2-second execution timeout
- Input validation on all API endpoints
- No external API calls or data transmission

### Performance

- <10ms regex matching
- ~110KB initial JavaScript load
- Instant explanation generation (local parsing)
- Browser support: Chrome 90+, Firefox 88+, Safari 15+, Edge 90+

### Documentation

- Complete README with usage guide
- Contributing guidelines
- Security policy
- License documentation

---

## Unreleased

### Planned

- Advanced regex testing features
- Regex cookbook with community patterns
- Additional visualization options
