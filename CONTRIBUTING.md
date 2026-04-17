# Contributing to Regcat

Thanks for your interest in contributing! Here's how to get started.

## Setup

```bash
git clone https://github.com/almostkoi/regcat.git
cd regcat
npm install --legacy-peer-deps
npm run dev
```

Open http://localhost:3000

## Making Changes

- Use TypeScript for new code
- Keep functions small and focused
- Add comments for complex logic
- Test your changes in dev and prod builds

## Before Submitting

1. Run linting:
   ```bash
   npm run lint --fix
   ```

2. Run and pass all tests:
   ```bash
   npm run test              # Run tests
   npm run test:coverage     # Check coverage
   ```

3. Run the production build to check for errors:
   ```bash
   npm run build
   ```

4. Make sure there are no errors or warnings

## Testing

New features should include unit tests. Run the test suite before submitting:

```bash
npm run test              # Run tests once
npm run test:coverage     # Generate coverage report
npm run test:ui           # Open test UI
```

- New features require corresponding tests
- Aim for >80% coverage on new code
- All tests must pass before submitting a PR

1. Create a descriptive branch:
   - `feature/add-something` for features
   - `fix/bug-name` for fixes
   - `docs/update-readme` for docs

2. Commit with clear messages:
   ```bash
   git commit -m "Brief description"
   ```

3. Push and open a PR with:
   - Clear title
   - Description of what changed and why
   - Related issues (if any)

## What We're Looking For

- Bug fixes ✅
- Performance improvements ✅
- New features (discuss first) ✅
- Documentation improvements ✅
- UI/UX improvements ✅

## What We Don't Accept

- External API dependencies (defeats the purpose of Regcat)
- Breaking changes without discussion

## Questions?

- Open an issue to discuss big changes first
- Ask in GitHub Discussions if unsure

Thanks for helping!
