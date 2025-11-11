# Contributing to TU Connect

Thank you for your interest in contributing to TU Connect! This guide will help you get started.

## Getting Started

### Prerequisites
- .NET 9.0 SDK or later
- Visual Studio 2022 (recommended) or VS Code
- SQL Server or Azure SQL Database
- Git

### Setting Up Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/tu-connect.git
   cd tu-connect
   ```

3. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. Build the solution:
   ```bash
   dotnet build TUConnect.sln
   ```

## Development Guidelines

### Code Style
- Follow C# coding conventions
- Use meaningful variable and method names
- Add XML documentation comments for public APIs
- Keep methods focused and concise

### Project Structure
- **TUConnect.Core**: Domain models and business logic
- **TUConnect.Data**: Data access layer with EF Core
- **TUConnect.Api**: REST API controllers and configuration
- **TUConnect.Mobile**: MAUI mobile application
- **TUConnect.Database**: SQL database schema

### Making Changes

1. **Write Clean Code**
   - Follow SOLID principles
   - Use dependency injection
   - Avoid hardcoded values

2. **Add Tests** (when test infrastructure exists)
   - Unit tests for business logic
   - Integration tests for API endpoints
   - UI tests for mobile app

3. **Update Documentation**
   - Update README.md if adding new features
   - Add XML comments to code
   - Update API documentation

### Entity Framework Migrations

When modifying database schema:

```bash
cd TUConnect.Data
dotnet ef migrations add YourMigrationName --startup-project ../TUConnect.Api
dotnet ef database update --startup-project ../TUConnect.Api
```

Also update the SQL Database Project files in `TUConnect.Database/Tables/`.

### API Development

When adding new API endpoints:

1. Create/update models in `TUConnect.Core/Models`
2. Update `TUConnectDbContext` if needed
3. Create/update controller in `TUConnect.Api/Controllers`
4. Test using Swagger UI
5. Update API documentation

### Mobile App Development

When working on the mobile app:

1. Follow MVVM pattern
2. Use data binding where possible
3. Keep ViewModels testable (no platform-specific code)
4. Use the ApiService for backend communication
5. Test on multiple platforms when possible

## Submitting Changes

### Pull Request Process

1. **Ensure your code builds**:
   ```bash
   dotnet build TUConnect.sln
   ```

2. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add feature: description of your changes"
   ```

3. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**:
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

### Pull Request Guidelines

- **Title**: Clear and descriptive
- **Description**: 
  - What changes were made
  - Why the changes were made
  - Any breaking changes
  - Screenshots (for UI changes)
- **Size**: Keep PRs focused and reasonably sized
- **Tests**: Include tests when applicable
- **Documentation**: Update docs for new features

## Reporting Issues

### Bug Reports

When reporting bugs, include:
- **Description**: Clear description of the issue
- **Steps to Reproduce**: Step-by-step instructions
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, .NET version, database version
- **Screenshots**: If applicable

### Feature Requests

When requesting features:
- **Description**: Clear description of the feature
- **Use Case**: Why is this feature needed
- **Proposed Solution**: How might it work
- **Alternatives**: Other approaches considered

## Code Review

All submissions require review. We look for:
- Code quality and style
- Test coverage
- Documentation
- Performance implications
- Security considerations

## Community Guidelines

- Be respectful and constructive
- Help others learn and grow
- Follow the code of conduct
- Ask questions if unsure

## Getting Help

- **Documentation**: Check README.md and IMPLEMENTATION_NOTES.md
- **Issues**: Search existing issues
- **Discussions**: Start a discussion for general questions
- **Email**: Contact maintainers for private matters

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to TU Connect!
