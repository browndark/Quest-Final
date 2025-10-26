# Contributing to Cinema App Frontend

Thank you for your interest in contributing to the Cinema App Frontend! This document outlines the standards, processes, and guidelines for contributing to this project.

## Table of Contents

1. [Development Workflow](#development-workflow)
2. [Code Style and Standards](#code-style-and-standards)
3. [Commit Guidelines](#commit-guidelines)
4. [Pull Request Process](#pull-request-process)
5. [Testing Guidelines](#testing-guidelines)
6. [Documentation](#documentation)
7. [Issue Reporting](#issue-reporting)

## Development Workflow

1. **Fork and Clone**
   - Fork the repository to your GitHub account
   - Clone your fork locally: `git clone https://github.com/YOUR_USERNAME/cinema-app-frontend.git`
   - Add the upstream remote: `git remote add upstream https://github.com/ORIGINAL_OWNER/cinema-app-frontend.git`

2. **Branch Management**
   - Create branches for each feature or fix: `git checkout -b feature/feature-name` or `git checkout -b fix/issue-name`
   - Keep branches focused on a single feature or fix
   - Regularly sync your fork with upstream: `git fetch upstream && git merge upstream/main`

3. **Development Cycle**
   - Make changes in your branch
   - Test your changes locally
   - Commit changes following our commit guidelines
   - Push to your fork
   - Open a pull request

## Code Style and Standards

### General Guidelines

- Write clean, readable, and maintainable code
- Follow the principle of "Do One Thing" (DOT) for functions and components
- Avoid unnecessary comments; write self-documenting code
- Keep files under 300 lines whenever possible
- Use meaningful variable and function names

### React Specific

- Use functional components with hooks
- Keep component state minimal and focused
- Extract reusable logic into custom hooks
- Avoid inline styles; use styled-components or CSS modules
- Use meaningful component names that reflect their purpose

### JavaScript/JSX Style

- Use ES6+ features appropriately
- Use destructuring for props and state
- Use template literals instead of string concatenation
- Prefer const over let; avoid var
- Use array methods (map, filter, reduce) instead of for loops when appropriate

### Naming Conventions

- **Components**: PascalCase (e.g., `MovieCard.jsx`)
- **Files for hooks**: camelCase prefixed with "use" (e.g., `useAuth.js`)
- **Regular functions**: camelCase (e.g., `getMovieDetails`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_SEAT_COUNT`)
- **CSS classes**: kebab-case (e.g., `movie-card`)

## Commit Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): subject

[optional body]

[optional footer]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Changes to the build process, auxiliary tools, libraries, etc.

Example:
```
feat(auth): add password reset functionality

- Add reset password form component
- Create API service for password reset
- Add route for password reset page

Closes #123
```

## Pull Request Process

1. Ensure your code follows our style guidelines
2. Update documentation if necessary
3. Include screenshots for UI changes
4. Reference any relevant issues
5. Make sure all tests pass
6. Request review from maintainers
7. Address review comments promptly

## Testing Guidelines

- Write tests for new features and bug fixes
- Aim for comprehensive test coverage
- Test edge cases and error scenarios
- Consider different user roles in your tests
- Test across different viewport sizes for responsive designs

## Documentation

- Update README.md if your changes affect the project setup or usage
- Document new components with JSDoc comments
- Add inline comments for complex logic
- Update DOCUMENTATION.md for architectural changes

## Issue Reporting

When creating an issue, please include:

1. **Issue Type**: Bug, Feature, Enhancement, etc.
2. **Description**: Clear and concise explanation
3. **Steps to Reproduce**: For bugs, detailed steps to reproduce the issue
4. **Expected vs. Actual Behavior**: What should happen vs. what happens
5. **Screenshots**: If applicable
6. **Environment**: Browser, OS, screen size, etc.
7. **Possible Solutions**: If you have suggestions

Thank you for contributing to make Cinema App Frontend better!
