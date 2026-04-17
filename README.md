# Regcat - Regex Tester & Explainer

Built by [@almostkoi](https://github.com/almostkoi) | [GitHub](https://github.com/almostkoi/regcat) | [Discord](https://discord.gg/VvTynsHrG8)

A fast, free, and open-source regex tester with instant pattern explanations. No API keys, no costs, completely private.

**Live Demo**: https://regcat.shusui.dev
**GitHub**: https://github.com/almostkoi/regcat
**Discord**: https://discord.gg/VvTynsHrG8

## Features

- **Real-time Regex Testing** - See all matches instantly with capture groups and indices
- **All 7 JavaScript Flags** - Full support for g, i, m, s, u, d, y flags
- **Pattern Explanations** - Instant breakdown of regex patterns in plain English
- **Test String Generation** - Auto-generate matching example strings using randexp
- **Substitution Mode** - Preview string replacements with captured groups
- **Dark Terminal UI** - Neon green theme inspired by developer tools
- **100% Local Processing** - No external APIs, no data collection, fully private
- **Mobile Responsive** - Works seamlessly across all devices
- **Keyboard Shortcuts** - Quick access: Ctrl+K (clear), Ctrl+1 (pattern), Ctrl+2 (test string)

## Getting Started

### Online (No Installation Required)

Visit [regcat.shusui.dev](https://regcat.shusui.dev) and start testing patterns immediately.

### Local Development

```bash
git clone https://github.com/almostkoi/regcat.git
cd regcat
npm install --legacy-peer-deps
npm run dev
```

Open http://localhost:3000 in your browser.

### Production Build

```bash
npm run build
npm start
```

Configure the port using `.env.local`:

```env
PORT=3000
```

## Usage Guide

1. Enter a regex pattern in the input field (e.g., `\d{3}-\d{2}-\d{4}`)
2. Toggle flags as needed (g, i, m, s, u, d, y)
3. Paste or type test strings to match against
4. View all matches with capture groups in the results panel
5. Click "Explain" to see a detailed breakdown of your pattern
6. Use the "Generate" button to create test strings matching your pattern
7. Use the sidebar to navigate between sections

## How It Works

Everything runs locally in your browser using pure JavaScript. No external APIs or dependencies.

### Real-Time Matching
Your regex is tested against the test string instantly using the native JavaScript RegExp engine. You get:
- All matches highlighted and listed
- Capture groups displayed with values
- Match indices and metadata
- Execution time for performance reference

### Pattern Explanations
Click "Explain" to get a breakdown of your pattern that includes:
- What each component matches
- Examples of matching strings
- Common beginner mistakes to avoid
- How each flag affects the pattern

All explanations are generated locally with no API calls.

### Test String Generation
Click the lightning bolt (zap) button to auto-generate example strings that match your pattern. Uses the randexp library to create realistic matching examples instantly.

### String Substitution
Test replacements in real-time with support for:
- Numbered capture groups ($1, $2, etc.)
- Named capture groups ($<name>)
- Instant preview of substituted text

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Test Generation**: randexp library
- **Testing**: Vitest with Testing Library
- **Hosting**: Vercel or any Node.js platform

## Project Structure

```
regcat/
├── app/
│   ├── page.tsx                    # Main page component
│   ├── layout.tsx                  # Root layout with metadata
│   ├── globals.css                 # Global styles and animations
│   ├── manifest.ts                 # PWA manifest
│   ├── icon.svg                    # App icon/favicon
│   └── api/
│       ├── explain/route.ts        # Regex explanation endpoint
│       └── generate-test-strings/route.ts  # Test generation endpoint
├── components/                     # React components
│   ├── RegexInput.tsx
│   ├── FlagToggle.tsx
│   ├── TestStringInput.tsx
│   ├── MatchList.tsx
│   ├── MatchItem.tsx
│   ├── ExplanationPanel.tsx
│   ├── SubstitutionPanel.tsx
│   ├── CheatSheet.tsx
│   ├── Sidebar.tsx
│   └── ErrorBanner.tsx
├── hooks/                          # Custom React hooks
│   ├── useRegexMatcher.ts
│   ├── useExplain.ts
│   └── useGenerateTestStrings.ts
├── lib/                            # Utilities and helpers
│   ├── regex-explainer.ts          # Regex explanation engine
│   └── types.ts                    # TypeScript type definitions
├── public/                         # Static assets
├── package.json
└── README.md
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Clear all fields |
| `Ctrl+1` | Focus on pattern input |
| `Ctrl+2` | Focus on test string input |

## Development

### Run Tests

```bash
npm run test              # Run tests once
npm run test:coverage     # Generate coverage report
npm run test:ui           # Open test UI
```

### Lint

```bash
npm run lint              # Check code style
npm run lint --fix        # Auto-fix issues
```

### Build

```bash
npm run build             # Create production build
npm start                 # Run production server
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes and commit (`git commit -m 'Add feature'`)
4. Push to your branch (`git push origin feature/your-feature`)
5. Open a pull request

Please ensure your code:
- Follows the existing code style
- Passes linting (`npm run lint`)
- Includes tests for new functionality
- Works in Chrome, Firefox, Safari, and Edge

## License

Regcat is licensed under a **Non-Commercial License with Attribution Required**.

Key terms:
- Free to use for non-commercial purposes
- Modify and build upon the code
- Commercial use prohibited without explicit permission
- All use requires attribution to almostkoi

For commercial licensing inquiries, open an issue on GitHub.

See the [LICENSE](./LICENSE) file for full details.

## Security

- No external API calls or dependencies
- All regex matching happens in your browser
- HTML encoding applied to all user input
- CORS and CSRF protection enabled
- No personal data collection or transmission
- Uses native JavaScript RegExp engine

## Performance

- Regex matching: <10ms
- Initial page load: ~110KB JavaScript
- Explanations: Generated instantly (local parsing)
- Browser support: Chrome 90+, Firefox 88+, Safari 15+, Edge 90+
- Accessibility: WCAG AA compliant

## FAQ

**Q: Is my regex data stored?**
A: No. Everything runs locally in your browser. We don't store, log, or transmit your patterns or test strings.

**Q: Why no external API for explanations?**
A: We wanted zero costs, zero rate limits, complete privacy, and instant results. Local parsing achieves all of this.

**Q: Can I use this for production regex testing?**
A: Yes. We use the same JavaScript RegExp engine as your runtime, so patterns work identically in both environments.

**Q: Does this work offline?**
A: After the initial page load, yes. All functionality works offline except for checking for updates.

**Q: What about performance with complex patterns?**
A: Regex matching is under 10ms for most patterns. We include a 2-second timeout protection against catastrophic backtracking.

**Q: Can I deploy this myself?**
A: Yes. This is open source and can be deployed to any Node.js platform (Vercel, Netlify, self-hosted, etc.).

**Q: Are there regex pattern limits?**
A: Patterns up to 10,000 characters are supported. Extremely complex patterns with catastrophic backtracking are protected by a 2-second execution timeout.

## Feedback & Support

- **Report Bugs**: [GitHub Issues](https://github.com/almostkoi/regcat/issues)
- **Request Features**: [GitHub Discussions](https://github.com/almostkoi/regcat/discussions)
- **Chat with Community**: [Discord Server](https://discord.gg/VvTynsHrG8)
- **Live Demo**: [regcat.shusui.dev](https://regcat.shusui.dev)

---

Made by [@almostkoi](https://github.com/almostkoi)
